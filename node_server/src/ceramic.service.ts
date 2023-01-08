import { Capability, Connection, Index } from "./interface";
import { IKeyService, KeyService } from "./key.service";
import * as dotenv from 'dotenv'
dotenv.config()

export interface ICeramicService  {

    connect(index: Index, cap: Capability): Promise<Connection|String>
}

export class CeramicService implements ICeramicService {

    _connections: Connection[] = [];
    _keys: IKeyService;

    constructor() {
      this._keys = new KeyService();
    }

    // set up persistent connection as child process with graphiql endpoint ..
    // that can be called within docker network (From services on paired fluence peer)
    async connect (index: Index, cap: Capability): Promise<Connection|String> {

        let self = this;

        return new Promise(function(resolve, reject){ 

          let c = self.find(index, cap);

          // check if connection has already open 
          if (c) {
            // console.log("using existing connection");
            resolve(c); 
            return;
          }

          // console.log("new connection");
          // console.log(index);
          // console.log(cap);
          // console.log(self._connections);

          // check if capability object was signed by correct user 
          if (!self._keys.validate(cap)) {
            return resolve("invalid capability")
          }
      
          const spawn = require('child-process-promise').spawn;
      
          const args = self.formatArgs(index, cap);
      
          const promise = spawn('composedb', args);
          const childProcess = promise.childProcess;  
          console.log('[spawn] childProcess.pid: ', childProcess.pid);  
      
          childProcess.stdout.on('data', function (data: any) {
            console.log('[serve] stdout: ', data.toString());
          });
          childProcess.stderr.on('data', function (data: any) {
             
            console.log('[serve] stderr: ', data.toString());
      
            let port = self.extractPort(data.toString());

            if(port != '') {
      
              let pid = parseInt(childProcess.pid.toString());

              // store connection in memory 
              let c: Connection = {
                composite: index.composite,
                model: index.model,
                name: index.name,
                port,
                pid,
                "timestamp": Date.now(),
                user: cap != null ? cap.did  : "public"
              };

              self.store(c);
              console.log(c);
              resolve(c);
            }
          });
        });
    }
    
    extractPort(msg: string): string {
         return (msg.split("/")[2] != undefined) ? msg.split("/")[2].split(":")[1] : ""
    }

    formatArgs(index: Index, cap: Capability) : string[] {

        const url = 'http://' + process.env.NAMESPACE + process.env.N + '_ceramic:' + process.env.CERAMIC_PORT;

        const args = [ 
            'graphql:server', 
            '--ceramic-url',
            url,
            '--graphiql',
            '--port',
            index.port
        ];

        args.push('--did-private-key')
      
        if (cap && cap != null) {
          let pk = this._keys.decrypt(cap);
          args.push(pk)
        }  else {
          // i now include the providers did secret .. so it can store the intermediaries
          args.push(process.env.DIDSECRET)
        }
      
        // i am using a default ceramic model here ... 
        if (index.composite == "simpleProfileIndex") {
          index.composite = "kjzl6hvfrbw6c7keo17n66rxyo21nqqaa9lh491jz16od43nokz7ksfcvzi6bwc";
        }
      
        args.push('/opt/composites/' + index.composite + '--runtime.json')
      
        console.log(args);

        return args;
    }

    find(index: Index, cap: Capability) {

      let did = (cap != null && cap.did) ? cap.did : "public"
      return this._connections.find( s => (s.user == did && s.name == index.name));
    }

    store(connection: Connection) {
      this._connections.push(connection);
    }
}