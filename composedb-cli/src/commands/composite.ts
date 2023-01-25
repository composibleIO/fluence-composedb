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

    console.log(composite.toJSON());

    return { runtimeDefinition, compositeDefinition } 
}





