import { IMainController } from "../controllers/main.controller";
import { CdbIndex, CdbServerConfig, Contractor, ContractorDetails } from "../interfaces/interfaces";
import * as isIPFS from 'is-ipfs'
import { pid } from "process";

export interface IContractorService {

    object: Contractor
    peerId: String,
    serviceId: String,
    cid: String,
    serverConfig: CdbServerConfig,
    find: () => Promise<Contractor[]>
    select: (contractor: Contractor) => Contractor

}


export class ContractorService implements IContractorService {

    resource_id: '5zb7zPgUZTTvvJxT4E16sHo6CvguG9Rs2K91YAwGqiLM';   
    _active: Contractor;   

    constructor(public main: IMainController) {
     
    }

    get object() : Contractor {

        return this._active;
    }

    get peerId() : String {

        return this._active.metadata.peer_id;
    }

    get serviceId() : String {

        return this._active.metadata.service_id[0];
    }

    get serverConfig() : CdbServerConfig {

        return this._active.details.composedb;
    }

    get cid() : String {

        return this._active.metadata.value;
    }

    set contractor(contractor: Contractor)  {
        this._active = contractor;
    }

    async find(): Promise<Contractor[]>  {

        let records = await this.main.aqua.findRecords('5zb7zPgUZTTvvJxT4E16sHo6CvguG9Rs2K91YAwGqiLM');

        console.log("no of records: " + records[0].length);

        let peers : string[] = [];
        let selection : Contractor[] = [];

        console.log(records);

        for (let record of records[0]) {
            let peerId = record.metadata.peer_id;
            if (peers.indexOf(peerId) < 0) {
                peers.push(peerId)
            }  
        }

        for (let peer of peers) {
            
            let rs = records[0]
                .filter( (r: Contractor) => r.metadata.peer_id === peer)
                .sort((a:Contractor, b:Contractor) => {
                    return (a.timestamp_created > b.timestamp_created) ? -1 : 1;
                });
            selection.push(rs[0]);
        }

        for (let contractor of selection) {

            try {

                let [error, success, values] = await this.main.aqua.getContractorDetails(contractor.metadata.peer_id,contractor.metadata.service_id[0], contractor.metadata.value);
                if(success) {
                    contractor.details = values;
                } else {
                    console.log(error);
                    // console.log(contractor.details)
                }
            } catch(err) {

                contractor.details = null;
                console.log(err);

            }

           
        }

        selection = selection.filter( (c) => c.details !== null && c.details !== undefined)
        return selection
    }

    select(contractor: Contractor) {

        this.contractor = contractor;

        return contractor;
    }

}

