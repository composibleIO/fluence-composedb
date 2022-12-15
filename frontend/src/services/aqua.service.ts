import { IMainController } from "../controllers/main.controller";
import { cdbQuery, cdbStoreKey, cdbMutate, cdbTest, cdbContratorDetails, cdbConnect, getRecords } from "../_aqua/export";
import { Contractor, CeramicResult } from "../interfaces/interfaces";

export interface IAquaService {

    main: IMainController;
    findRecords: (resource_id: string) => Promise<any>;
    getContractorDetails: (node: string, service_id: string) => Promise<any>;
    connect: () => Promise<any>;
    // fetchKeyStore: () => Promise<any>;
    // storeKey: (ethAddress: string, encryptedString: string, encryptedSymmetricKey: string) => Promise<any>;
    query: () => Promise<any>;
    update: (name: string) => Promise<any>;
    test: () => Promise<any>;
}

const node = "";
const service_id = "";
const ceramic_url = ""

export class AquaService implements IAquaService {


    constructor(public main: IMainController) {


    }

    async findRecords(resource_id: string) {

        return await getRecords(
            this.main.fluence.connection, 
            resource_id,
            1
        );
    }

    async getContractorDetails(peer_id: string, service_id: string) {
        
        return await cdbContratorDetails(
            this.main.fluence.connection, 
            peer_id, 
            service_id
        );
    }

    async connect() {
     
        return await cdbConnect(
            this.main.fluence.connection, 
            this.main.contractor.peerId.toString(), 
            this.main.contractor.serviceId.toString(),
            JSON.stringify(this.main.cap.get()),
            {
                ceramic_sidecar: this.main.contractor.serverConfig.ceramic_sidecar.toString(),
                composedb_sidecar: this.main.contractor.serverConfig.composedb_sidecar.toString(),
                express_port: this.main.contractor.serverConfig.express_port.toString(),
                ceramic_port: this.main.contractor.serverConfig.ceramic_port.toString(),
                readonly_port: this.main.contractor.serverConfig.readonly_port.toString(),
            },
            { ttl: 60000 }
        )
    }

    // async fetchKeyStore() {

    //     let m = this.main.contractor.object.metadata;

    //     return await cdbQuery(
    //         this.main.fluence.connection, 
    //         this.main.contractor.peerId.toString(), 
    //         this.main.contractor.serviceId.toString(),
    //         "5499"
    //     );
    // }

    // async storeKey(ethAddress: string, encryptedString: string, encryptedSymmetricKey: string) {


    //     return await cdbStoreKey(
    //         this.main.fluence.connection, 
    //         this.main.contractor.peerId.toString(), 
    //         this.main.contractor.serviceId.toString(),
    //         // cap
    //         // waar slaan we dit dan op?  waar hebben we het voor nodig? 
    //         ethAddress, 
    //         encryptedString, 
    //         encryptedSymmetricKey, 
    //         //
    //         this.main.contractor.serverConfig
    //     )
    // }

    async query() {

        let response = await cdbQuery(
            this.main.fluence.connection, 
            this.main.contractor.peerId.toString(), 
            this.main.contractor.serviceId.toString(),
            {
                ceramic_sidecar: this.main.contractor.serverConfig.ceramic_sidecar.toString(),
                composedb_sidecar: this.main.contractor.serverConfig.composedb_sidecar.toString(),
                express_port: this.main.contractor.serverConfig.express_port.toString(),
                ceramic_port: this.main.contractor.serverConfig.ceramic_port.toString(),
                readonly_port: this.main.contractor.serverConfig.readonly_port.toString()
            },
        );

        return JSON.parse(response.stderr);
    }

    async update(name: string) {

        let composite_name = "kjzl6hvfrbw6c7keo17n66rxyo21nqqaa9lh491jz16od43nokz7ksfcvzi6bwc";

      //  console.log(this.main.cap.get().keys[this.main.contractor.object.details.eth_address]); 

        return await cdbMutate(
            this.main.fluence.connection, 
            this.main.contractor.peerId.toString(), 
            this.main.contractor.serviceId.toString(),
            name, 
            JSON.stringify(this.main.cap.get()),
            this.main.composedb.connection,
            {
                ceramic_sidecar: this.main.contractor.serverConfig.ceramic_sidecar.toString(),
                composedb_sidecar: this.main.contractor.serverConfig.composedb_sidecar.toString(),
                express_port: this.main.contractor.serverConfig.express_port.toString(),
                ceramic_port: this.main.contractor.serverConfig.ceramic_port.toString(),
                readonly_port: this.main.contractor.serverConfig.readonly_port.toString()
            },
            { ttl: 60000}
        )
    }

    async test() {

        let m = this.main.contractor.object.metadata;
        let d = this.main.contractor.object.details;

        return await cdbTest(
            this.main.fluence.connection, 
            this.main.contractor.peerId.toString(), 
            this.main.contractor.serviceId.toString()
        )
    }
}