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
    deriveDidPkh: () => void;
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

    async deriveDidPkh() {

        const authMethod = await this.main.eth.getWebAuth();
        const session = await DIDSession.authorize(authMethod, { resources: ["ceramic://*?model=kjzl6hvfrbw6c5ma5crdcdiyxq7yw5zqpt6o0ercwuy1bw3920z8u7ty8ia3p82"]});

   //     const session = await DIDSession.authorize(authMethod, { resources: ["kjzl6hvfrbw6c5ma5crdcdiyxq7yw5zqpt6o0ercwuy1bw3920z8u7ty8ia3p82","kjzl6hvfrbw6c9tklfrk2id3t0zxgj8ttnqkaudwmx8j5blt9m3istosxzktrjh"]});
        console.log(session.did);
        console.log(session.authorizations);
        console.log(session.cacao);
        console.log(session.id);
        const sessionString = session.serialize()
        console.log(sessionString);
    }

}