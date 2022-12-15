import { Capability, Secrets } from "../interfaces/interfaces";
import * as ls from "local-storage";
import { IMainController } from "../controllers/main.controller";


export interface ICapabilityService {

    get: () => Capability
    store: (cap: Capability) => void
    new: () => Promise<Capability>

}

export class CapabilityService implements ICapabilityService {


    constructor(public main: IMainController) {}


    get(): Capability {
        return ls.get(this.main.eth.walletAddress)
    }

    store(cap: Capability) {
        ls.set(this.main.eth.walletAddress, cap);
    }

    // async load() {
        
    //     let cap : Capability = this.get(this.main.eth.walletAddress);

    //     if (cap == null) {
    //         // UIUIUIUIUI ask for signture ??? 
    //         // allow xx to use DID and its priv key to write on composedb 
    //         cap = await this.new();     
    //     }

    //     return cap;
    // }

    async new() {

        let seed = this.main.did.randomSeed();

        let keys: Secrets = {};
      
        keys[this.main.eth.walletAddress] = await this.main.eth.encrypt(seed, await this.main.eth.getEncryptionPublicKey(this.main.eth.walletAddress))

        keys[this.main.contractor.object.details.eth_address] = await this.main.eth.encrypt(seed, "RdkrKcgLPEtWcQ0aqH9Q42Gt53Al0r0+33c9otIQG1Y=")

        const cap =  {
          iss: this.main.eth.walletAddress,
          aud: await this.main.did.new(seed),
          with: "composedb:simpleProfileIndex",
          do: ["serve","mutate"],
          keys
        }

        // console.log(cap);

        this.store(cap);

        return cap;
    }


   
}