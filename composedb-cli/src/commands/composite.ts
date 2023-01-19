import { CeramicClient } from '@ceramicnetwork/http-client';
import { writeEncodedCompositeRuntime, readEncodedComposite, serveEncodedDefinition } from '@composedb/devtools-node'
import { newDid } from '../utils/did.js';
import { base64urlToJSON, JSONToBase64url } from '../utils/serialize.js';

export const compositeCompile = async (ceramic: string, name: string) => {

    const client = new CeramicClient(ceramic);

    return await writeEncodedCompositeRuntime(
        client,
        './composites/' + name + '.json',
        './' + name + '--runtime.js'
    );
}


export const compositeDefinition = async (ceramic: string, name: string, serialized: boolean) => {

    // dit is schema/definition  de .graphql file 
    const def = '{"models":{"TU_Profile":{"id":"kjzl6hvfrbw6c5ma5crdcdiyxq7yw5zqpt6o0ercwuy1bw3920z8u7ty8ia3p82","accountRelation":{"type":"single"}}},"objects":{"TU_Profile":{"accountId":{"type":"string","required":true},"displayName":{"type":"string","required":true}}},"enums":{},"accountData":{"tuProfile":{"type":"node","name":"TU_Profile"}}}';

    return serialized ? JSONToBase64url(def ):  def;
    
}



