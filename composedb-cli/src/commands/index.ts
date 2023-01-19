import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { Composite } from '@composedb/devtools';
import { definition } from '../definitions/tu_profile--definition.js';
import { newDid } from '../utils/did.js';
import { base64urlToJSON } from '../utils/serialize.js';


export const resources = (ceramic: string) => {

    const client = new ComposeClient({ceramic, definition});
    return client.resources;
}

export const startIndex = async (ceramic: string, definition: string, privateKey: string) => {

    // check if is indexing? 

    const client = new CeramicClient(ceramic);
    client.did = await newDid(privateKey);
 
    const composite = await Composite.fromJSON({
        ceramic: client,
        definition: base64urlToJSON(definition)
    })
    
    // Notify the Ceramic node to index the models present in the composite
    return await composite.startIndexingOn(client)
}