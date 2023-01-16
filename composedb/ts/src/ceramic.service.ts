
import { CeramicClient } from '@ceramicnetwork/http-client'
import { writeEncodedCompositeRuntime } from '@composedb/devtools-node'
import * as dotenv from 'dotenv'

export interface ICeramicService  {
    _client: any
}

dotenv.config()

export class CeramicService implements ICeramicService {

        _client: any = null;

        constructor() {
        }

        formatUrl() {
            return 'http://' + process.env.NAMESPACE + '' + process.env.N + '_ceramic:' + process.env.CERAMIC_PORT;
        }

        async init() {
            this._client = new CeramicClient(this.formatUrl());
        }

        async compile() {

             await writeEncodedCompositeRuntime(
                this._client,
                '../composites/tu-profile.json',
                './tu_profile--runtime.js'
            )
        }
}