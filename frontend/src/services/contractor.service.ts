import { IMainController } from "../controllers/main.controller";
import { CdbServerConfig, Contractor, ContractorDetails } from "../interfaces/interfaces";

export interface IContractorService {

    object: Contractor
    peerId: String,
    serviceId: String,
    serverConfig: CdbServerConfig,
    find: () => Promise<Contractor>
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

        return this._active.details.middleware.composedb;

        // return {
        //     ceramicUrl : this._active.details.middleware[0].ceramicUrl.toString(), 
        //     composedbServerUrl : this._active.details.middleware[0].composedbServerUrl.toString(),
        //     readOnlyUrl : this._active.details.middleware[0].readOnlyUrl.toString()
        // }
    }

    set contractor(contractor: Contractor)  {
        this._active = contractor;
    }

    async find() : Promise<Contractor>  {

        let records = await this.main.aqua.findRecords('5zb7zPgUZTTvvJxT4E16sHo6CvguG9Rs2K91YAwGqiLM');

        console.log(records);

        let contractor = records[0].sort((a:any, b:any) => {

            return (a.timestamp_created > b.timestamp_created) ? -1 : 1;

        })[0];

        contractor.details = await this.main.aqua.getContractorDetails(contractor.metadata.peer_id,contractor.metadata.service_id[0])

        console.log(contractor.details);

        console.log(contractor);

        this.contractor = contractor; 

        return contractor

    }
}

function a(a: any, b: any) {
    throw new Error("Function not implemented.");
}


function b(a: any, b: any) {
    throw new Error("Function not implemented.");
}
