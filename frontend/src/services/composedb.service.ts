import { CdbConnection } from "../interfaces/interfaces";

export interface IComposeDBService {

    connection: CdbConnection
    isConnected: () => boolean
}

export class ComposeDBService implements IComposeDBService {

    _connection: CdbConnection; 

    constructor() {}

    set connection(connection: CdbConnection) {
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