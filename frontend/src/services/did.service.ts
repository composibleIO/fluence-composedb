import { type DIDProvider, DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
// import type { ResolverRegistry } from 'did-resolver'
// import KeyResolver from 'key-did-resolver'
import { getResolver as getKeyResolver } from 'key-did-resolver'
import { randomBytes } from 'crypto'
import { toString, fromString } from 'uint8arrays'

export interface IDidService {

    randomSeed: () => string;
    new: (seed: string) => Promise<string>;
}

export class DidService implements IDidService {


    construtor() {}

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

}