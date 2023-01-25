import { ComposeClient } from '@composedb/client';
import { DIDSession } from 'did-session'
import { newDid } from '../utils/did.js';
import { base64urlToJSON, base64urlToString } from '../utils/serialize.js';

export const graphqlQuery = async (ceramic: string, definition_s: string, query_s: string) => {

    const definition = base64urlToJSON(definition_s);
    const query = base64urlToString(query_s);

    // console.log(definition);
    // console.log(query);

    const client = new ComposeClient({ceramic, definition });
    client.setDID(await newDid(null));

    return await client.executeQuery(query);
}

export const graphqlMutate = async (ceramic: string, session_string: string, query_s: string, definition_s: string) => {

    const definition = base64urlToJSON(definition_s);
    const session = await DIDSession.fromSession(session_string);
    const query = base64urlToString(query_s);

    // console.log(definition);
    // console.log(session.did["_capability"]["p"]);

    const client = new ComposeClient({ceramic, definition});
    client.setDID(session.did);

    let output = await client.executeQuery(query);
    return JSON.stringify(output.data);
}

