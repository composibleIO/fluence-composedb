import { type DIDProvider, DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver as getKeyResolver } from 'key-did-resolver'
import { randomBytes } from 'crypto'
import { toString, fromString } from 'uint8arrays'

import { DIDSession } from 'did-session'
import { IEthereumService } from './ethereum.service'
import { IMainController } from '../controllers/main.controller'


export interface IDidService {


    randomSeed: () => string;
    new: (seed: string) => Promise<string>;
    deriveDidPkh: (resources: string[]) => Promise<DIDSession>;
}

export class DidService implements IDidService {


    constructor(public main: IMainController) {}

    randomSeed() {

        const seed = new Uint8Array(randomBytes(32));
        return  toString(seed, 'base16');
    }

    async new(seed: string) : Promise<string> {

        const s = fromString(seed, 'base16')

        const did = new DID({
            provider: new Ed25519Provider(s) as DIDProvider,
            resolver: getKeyResolver()
          })

        return await did.authenticate()
    }

    async deriveDidPkh(resources: string[]) : Promise<DIDSession> {

        console.log(resources);

        const authMethod = await this.main.eth.getWebAuth();
        return await DIDSession.authorize(authMethod, { resources });
    }

}