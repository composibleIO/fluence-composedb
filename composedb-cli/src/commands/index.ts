import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { Composite } from '@composedb/devtools';
import { newDid } from '../utils/did.js';
import { base64urlToJSON } from '../utils/serialize.js';


export const resources = (ceramic: string, runtimeDefinition_s: string) => {

    let definition = base64urlToJSON(runtimeDefinition_s);

    const client = new ComposeClient({ceramic, definition});
    return client.resources;
}

export const startIndex = async (ceramic: string, composite_definition: string, privateKey: string) => {

    // check if is indexing? 

    const client = new CeramicClient(ceramic);
    client.did = await newDid(privateKey);

    let definition = base64urlToJSON(composite_definition);
 
    const composite = await Composite.fromJSON({
        ceramic: client,
        definition
    })
    
    // Notify the Ceramic node to index the models present in the composite
    await composite.startIndexingOn(client);

    return 'indexing';
}