import { ComposeDBConnection } from "../interfaces/interfaces";

export interface IComposeDBService {

    connection: ComposeDBConnection
    isConnected: () => boolean
}

export class ComposeDBService implements IComposeDBService {

    _connection: ComposeDBConnection; 

    constructor() {}

    set connection(connection: ComposeDBConnection) {
        this._connection = connection;
        console.log(connection);

    }

    get connection() {
        return this._connection;
    }

    isConnected(): boolean {

        return this._connection && this._connection.port && !isNaN(parseInt(this._connection.port));
    }


}