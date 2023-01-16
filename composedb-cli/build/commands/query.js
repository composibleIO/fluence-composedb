import { ComposeClient } from '@composedb/client';
import { definition } from '../definitions/tu_profile--runtime.js';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver as getKeyResolver } from 'key-did-resolver';
import { randomBytes } from 'crypto';
import { toString, fromString } from 'uint8arrays';
const randomSeed = () => {
    const seed = new Uint8Array(randomBytes(32));
    return toString(seed, 'base16');
};
export const composeQuery = async (ceramic) => {
    const client = new ComposeClient({ ceramic, definition });
    const seed = randomSeed();
    const did = new DID({
        provider: new Ed25519Provider(fromString(seed, 'base16')),
        resolver: getKeyResolver()
    });
    await did.authenticate();
    client.setDID(did);
    // let res1 = await client.executeQuery(`
    //     mutation {
    //         createTU_Profile(
    //             input: {
    //                 content: {
    //                     displayName: "kippenkop",
    //                     accountId: "0xA6831dD52b1CCFbCAa860109CbB4ED0aCD4bfc68"
    //                 }
    //             }
    //         )
    //         { 
    //             document {
    //                 displayName,
    //                 accountId  
    //             }
    //         }
    //     }
    // `);
    return await client.executeQuery(`
        query {
            tU_ProfileIndex(first: 10) {
                edges { 
                    node { 
                        displayName,
                        accountId
                    }
                }
            }
        }
    `);
};
