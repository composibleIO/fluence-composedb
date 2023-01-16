import { IMainController } from "../controllers/main.controller";
import { cdbQuery, cdbMutate, cdbContratorDetails, cdbConnect, getRecords, cdbHasIntermediary, cdbStoreIntermediary, CdbContratorDetailsResult } from "../_aqua/export";
import { Contractor, CeramicResult, CdbIndex, CdbConnection, Intermediary } from "../interfaces/interfaces";

export interface IAquaService {

    main: IMainController;
    findRecords: (resource_id: string) => Promise<any>;
    getContractorDetails: (node: string, service_id: string, cid: string) => Promise<any>;
    hasIntermediary: () => Promise<Intermediary[]>;
    storeIntermediary: (intermediary: Intermediary) => Promise<Intermediary[]>;
    connect: (index: CdbIndex) => Promise<CdbConnection>;
    query: (query: string, connection: CdbConnection) => Promise<any>;
    update: (displayName: string, accountId: string) => Promise<any>;
}

const node = "";
const service_id = "";
const ceramic_url = ""

export class AquaService implements IAquaService {


    constructor(public main: IMainController) {}

    async findRecords(resource_id: string) {

        return await getRecords(
            this.main.fluence.connection, 
            resource_id,
            1
        );
    }

    async getContractorDetails(peer_id: string, service_id: string, cid: string) {
        
        return await cdbContratorDetails(
            this.main.fluence.connection, 
            peer_id, 
            service_id,
            cid
        );
    }

    async connect(index: CdbIndex): Promise<CdbConnection> {    
     
        return await cdbConnect(
            this.main.fluence.connection, 
            this.main.contractor.peerId.toString(), 
            this.main.contractor.serviceId.toString(),
            index,
            JSON.stringify(this.main.cap.getCap()),
            this.main.contractor.cid.toString(),
            { ttl: 60000 }
        )
    } 

    async query(query: string, connection:CdbConnection) {

        let response = await cdbQuery(
            this.main.fluence.connection, 
            this.main.contractor.peerId.toString(), 
            this.main.contractor.serviceId.toString(),
            query,
            connection,
            this.main.contractor.cid.toString()
        );

        // console.log(response);
    
        return JSON.parse(response.stderr);
    }

    async update(displayName: string, accountId: string) {

        return await cdbMutate(
            this.main.fluence.connection, 
            this.main.contractor.peerId.toString(), 
            this.main.contractor.serviceId.toString(),
            displayName, 
            accountId,
            JSON.stringify(this.main.cap.getCap()),
            this.main.composedb.connection,
            this.main.contractor.cid.toString(),
            { ttl: 60000}
        )
    }

    async hasIntermediary() {

        return await cdbHasIntermediary(
            this.main.fluence.connection, 
            this.main.contractor.peerId.toString(), 
            this.main.contractor.serviceId.toString(), 
            this.main.eth.walletAddress,
            this.main.contractor.cid.toString(),
            { ttl: 60000}
        )
    }

    async storeIntermediary(intermediary: Intermediary) {

        return await cdbStoreIntermediary(
            this.main.fluence.connection, 
            this.main.contractor.peerId.toString(), 
            this.main.contractor.serviceId.toString(),
            intermediary,
            this.main.contractor.cid.toString(),
            { ttl: 60000}
        )
    }
}