import { CeramicClient } from '@ceramicnetwork/http-client';
import { writeEncodedCompositeRuntime, readEncodedComposite, serveEncodedDefinition, writeEncodedComposite } from '@composedb/devtools-node'
import { newDid } from '../utils/did.js';
import { base64urlToJSON, JSONToBase64url, StringToBase64url } from '../utils/serialize.js';
import { Composite } from '@composedb/devtools';
import fs  from 'fs'


export const createFromSchema = async (ceramic_url: string, path: string, privateKey: string) => {

    const ceramic = new CeramicClient(ceramic_url);
    ceramic.did = await newDid(privateKey);

    const schema = fs.readFileSync(path, 'utf8'); 

    const composite = await Composite.create({
        ceramic,
        index:  false,
        schema
      });

    const compositeDefinition = JSONToBase64url(composite.toJSON());
    const runtimeDefinition = JSONToBase64url(composite.toRuntime());  
    return { runtimeDefinition, compositeDefinition } 
}

export const compositeDefinition = async (ceramic: string, name: string, serialized: boolean) => {

    // dit is schema/definition  de .graphql file 
    const def = '{"models":{"TU_Profile":{"id":"kjzl6hvfrbw6c5ma5crdcdiyxq7yw5zqpt6o0ercwuy1bw3920z8u7ty8ia3p82","accountRelation":{"type":"single"}}},"objects":{"TU_Profile":{"accountId":{"type":"string","required":true},"displayName":{"type":"string","required":true}}},"enums":{},"accountData":{"tuProfile":{"type":"node","name":"TU_Profile"}}}';

    return serialized ? JSONToBase64url(def ):  def;
    
}



