import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver as getKeyResolver } from 'key-did-resolver';
import { randomBytes } from 'crypto';
import { toString, fromString } from 'uint8arrays';
const randomSeed = () => {
    const seed = new Uint8Array(randomBytes(32));
    return toString(seed, 'base16');
};
export const newDid = async (seed) => {
    if (seed === null) {
        seed = randomSeed();
    }
    const did = new DID({
        provider: new Ed25519Provider(fromString(seed, 'base16')),
        resolver: getKeyResolver()
    });
    await did.authenticate();
    return did;
};
