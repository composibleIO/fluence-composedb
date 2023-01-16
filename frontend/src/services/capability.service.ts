import { Capability, Intermediary, SecretKey } from "../interfaces/interfaces";
import * as ls from "local-storage";
import { IMainController } from "../controllers/main.controller";


export interface ICapabilityService {

    getCap: () => Capability
    storeCap: (cap: Capability) => void
    getIntermediary: () => Intermediary
    setIntermediary: (intermediary: Intermediary) => void
    newIntermediary: () => Promise<Intermediary>
    spawnIntermediary: (intermediary: Intermediary) => Promise<Intermediary>
    newCap: () => Capability
    signCap: (cap: Capability, signature: string) => void
}

export class CapabilityService implements ICapabilityService {

    _currentIntermediary: Intermediary = null;

    constructor(public main: IMainController) {}

    getCap(): Capability {
         
        return (this._currentIntermediary == null) ? null : ls.get(this._currentIntermediary.iss);
    }

    storeCap(cap: Capability) {
        ls.set(this.main.eth.walletAddress, cap);
    }

    getIntermediary() : Intermediary {
        return this._currentIntermediary;
    }

    setIntermediary(intermediary: Intermediary) {
        this._currentIntermediary = intermediary;
    }

    async spawnIntermediary(intermediary: Intermediary) {

        let keys: SecretKey[] = [];
        let example = intermediary.keys.find( k => k.recipient = this.main.eth.walletAddress);

        let seed = await this.main.eth.decrypt(intermediary.keys.find( k => k.recipient = this.main.eth.walletAddress).encrypted_key, this.main.eth.walletAddress)

        const i =  {
            aud: this.main.contractor.serverConfig.public_info.eth_address,
            did: intermediary.did,
            iss: this.main.eth.walletAddress,
            keys
        }

        this._currentIntermediary = intermediary;

        return i;

    }

    async newIntermediary() {

        const seed = this.main.did.randomSeed();
        const did = await this.main.did.new(seed);

        let keys: SecretKey[] = [];

        keys.push({
            encrypted_key: await this.main.eth.encrypt(seed, await this.main.eth.getEncryptionPublicKey(this.main.eth.walletAddress)),
            recipient: this.main.eth.walletAddress
        });

        keys.push({
            encrypted_key: await this.main.eth.encrypt(seed, this.main.contractor.serverConfig.public_info.public_encryption_key),
            recipient: this.main.contractor.serverConfig.public_info.eth_address
        });

        const intermediary =  {
            aud: this.main.contractor.serverConfig.public_info.eth_address,
            did,
            iss: this.main.eth.walletAddress,
            keys
        }

        this._currentIntermediary = intermediary;

        return intermediary;
    }


    newCap() {

        const cap =  {
          aud: this._currentIntermediary.aud,
          did: this._currentIntermediary.did,
          iss: this._currentIntermediary.iss,
          with: "composedb:simpleProfileIndex",
          do: ["serve","mutate"],
          expires: Date.now() + (1000 * 60 * 60 * 2),
          keys: this._currentIntermediary.keys,
        }

        return cap;
    }

    signCap(cap: Capability, signature: string) {

        cap.signature = signature;

        this.storeCap(cap);
    }
}