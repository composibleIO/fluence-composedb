import { CeramicClient } from '@ceramicnetwork/http-client';
import { writeEncodedCompositeRuntime } from '@composedb/devtools-node';
export const ceramic = (ceramic) => {
    return new CeramicClient(ceramic);
};
export const compile = async (ceramic, name) => {
    return await writeEncodedCompositeRuntime(ceramic, '../composites/' + name + '.json', './' + name + '--runtime.js');
};
