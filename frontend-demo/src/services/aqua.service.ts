import { IMainController } from "../controllers/main.controller";
import { cdbQuery, cdbMutate, cdbContratorDetails, getRecords,  CdbContratorDetailsResult } from "../_aqua/export";
import { Contractor, CeramicResult, CdbIndex } from "../interfaces/interfaces";

export interface IAquaService {

    main: IMainController;
    findRecords: (resource_id: string) => Promise<any>;
    getContractorDetails: (node: string, service_id: string, cid: string) => Promise<any>;
    query: (definition: string, query: string) => Promise<any>;
    mutate: (definition: string, query: string, session: string) => Promise<any>;
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


    async query(definition: string, query: string) {

        return await cdbQuery(
            this.main.fluence.connection, 
            this.main.contractor.peerId.toString(), 
            this.main.contractor.serviceId.toString(),
            this.main.contractor.cid.toString(),
            definition,
            query,
            { ttl: 60000}
        )
    }

    async mutate(definition: string, query: string, session: string) {

        return await cdbMutate(
            this.main.fluence.connection, 
            this.main.contractor.peerId.toString(), 
            this.main.contractor.serviceId.toString(),
            this.main.contractor.cid.toString(),
            definition, 
            query,
            session,
            { ttl: 60000}
        )
    }
}