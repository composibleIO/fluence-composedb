import { CeramicClient } from '@ceramicnetwork/http-client'
import { writeEncodedCompositeRuntime, readEncodedComposite, serveEncodedDefinition } from '@composedb/devtools-node'
import { newDid } from '../utils/did.js';
import { JSONToBase64url } from '../utils/serialize.js';

export const compositeCompile = async (ceramic: string, name: string) => {

    const client = new CeramicClient(ceramic);

    return await writeEncodedCompositeRuntime(
        client,
        './composites/' + name + '.json',
        './' + name + '--runtime.js'
    );
}

export const compositeDeploy = async (ceramic: string, name: string) => {

    const privateKey = '20fb10425bb635240f21189dcbe44cf7b390ef28019904eb84fa8ed62cd3d771';
    const client = new CeramicClient(ceramic);
    client.did = await newDid(privateKey);
    // Replace by the path to the local encoded composite file
    const composite = await readEncodedComposite(client, './composites/' + name + '.json');
    // Notify the Ceramic node to index the models present in the composite
    return await composite.startIndexingOn(client)
}

export const compositeDefinition = async (ceramic: string, name: string, serialized: boolean) => {

    const def = '{"models":{"TU_Profile":{"id":"kjzl6hvfrbw6c5ma5crdcdiyxq7yw5zqpt6o0ercwuy1bw3920z8u7ty8ia3p82","accountRelation":{"type":"single"}}},"objects":{"TU_Profile":{"accountId":{"type":"string","required":true},"displayName":{"type":"string","required":true}}},"enums":{},"accountData":{"tuProfile":{"type":"node","name":"TU_Profile"}}}';

    return serialized ? JSONToBase64url(def ):  def;
    
}



