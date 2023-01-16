import { ComposeClient } from '@composedb/client';
import { definition } from '../definitions/tu_profile--definition.js';


export const resources = (ceramic: string) => {

    const client = new ComposeClient({ceramic, definition});

    return client.resources;

}