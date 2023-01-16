import { ComposeClient } from '@composedb/client';
import { definition } from '../definitions/tu_profile--runtime.js';
export const composedb = (ceramic) => {
    // console.log(definition);
    return new ComposeClient({ ceramic, definition });
};
export const query = async (composedb, session, query) => {
    if (session != null) {
        composedb.did = session.did;
    }
    return await composedb.executeQuery(`
        query {
            viewer {
            id
            }
        }
    `);
};
