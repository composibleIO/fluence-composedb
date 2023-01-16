
import { CeramicClient } from '@ceramicnetwork/http-client'
import { ComposeClient } from '@composedb/client'
import { writeEncodedCompositeRuntime } from '@composedb/devtools-node'
import { RuntimeCompositeDefinition } from '@composedb/types'
import * as dotenv from 'dotenv'

import { definition } from './tu_profile--runtime'




export interface IComposeService  {
    
    _client: any
}

dotenv.config()

// const definition : RuntimeCompositeDefinition = {"models":{"TU_Profile":{"id":"kjzl6hvfrbw6c5ma5crdcdiyxq7yw5zqpt6o0ercwuy1bw3920z8u7ty8ia3p82","accountRelation":{"type":"single"}}},"objects":{"TU_Profile":{"accountId":{"type":"string","required":true},"displayName":{"type":"string","required":true}}},"enums":{},"accountData":{"tuProfile":{"type":"node","name":"TU_Profile"}}}

export class ComposeService implements IComposeService {

        _client: any = null;

        constructor() {}

        formatUrl() {
            return 'http://' + process.env.NAMESPACE + '' + process.env.N + '_ceramic:' + process.env.CERAMIC_PORT;
        }

        async init() {

            console.log(definition)

          this._client = new ComposeClient({ceramic: this.formatUrl(), definition});

        }

        async authenticate(session: any) {

            this._client.did = session.did;
        }
}