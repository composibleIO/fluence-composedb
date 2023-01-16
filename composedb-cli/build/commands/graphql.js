import { ComposeClient } from '@composedb/client';
import { DIDSession } from 'did-session';
import { newDid } from '../utils/did.js';
import { base64urlToJSON } from '../utils/serialize.js';
export const graphqlQuery = async (ceramic, definition_s) => {
    const definition = JSON.parse(base64urlToJSON(definition_s));
    const client = new ComposeClient({ ceramic, definition });
    client.setDID(await newDid(null));
    let output = await client.executeQuery(`
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
    return JSON.stringify(output.data);
};
export const graphqlMutate = async (ceramic, session_string, name, definition_s) => {
    const definition = base64urlToJSON(definition_s);
    const session = await DIDSession.fromSession(session_string);
    console.log(session.did);
    const client = new ComposeClient({ ceramic, definition });
    client.setDID(session.did);
    return await client.executeQuery(`
        mutation {
            createTU_Profile(
                input: {
                    content: {
                        displayName: "` + name + `",
                        accountId: "0xA6831dD52b1CCFbCAa860109CbB4ED0aCD4bfc68"
                    }
                }
            )
            { 
                document {
                    displayName,
                    accountId  
                }
            }
        }
    `);
};
