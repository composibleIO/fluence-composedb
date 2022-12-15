// 'use strict';

import express = require("express")
import { spawnSync } from "child_process";
import bodyParser, { json } from "body-parser";
import { decrypt } from '@metamask/eth-sig-util';
import { toBuffer }  from 'ethereumjs-util';

const app: express.Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const port = 3000;


// REQD FROM ENV! 
const my_address = "0xF4aF5aB1F69175F94ec1A662Ab841e67Def92b2B";
const my_private_key = "7cdc2bc75eb650a6d30b919f540315c6ec500a946c5fe8fa0911f414b296ecf0";

const servers: { key: string; port: string; pid: string; timestamp: number}[] = [];


const bin = async (cli: string, args: string[]) =>  {

  return new Promise(function(resolve, reject){ 

    const spawn = require('child-process-promise').spawn;

    console.log(args);

    const promise = spawn(cli, args);
  
    const childProcess = promise.childProcess;

    childProcess.stdout.on('data', function (data: any) {
      console.log('[serve] stdout: ', data.toString());
    });

    childProcess.stderr.on('data', function (data: any) {
        // hier de poort uitpeuteren? 
        console.log('[serve] stderr: ', data.toString());

        resolve(data.toString())
    });
  })
}


const serve = async (port: string, composite_name: string, pk: string, aud: string) =>  {

  return new Promise(function(resolve, reject){ 

    const spawn = require('child-process-promise').spawn;

    const args = [ 
      'graphql:server', 
      '--ceramic-url',
      'http://ceramic-sidecar:7007',
      '--graphiql',
      '--port',
      port
    ];

    if (pk && pk != "") {
      args.push('--did-private-key')
      args.push(pk)
    } 

    if (composite_name == "simpleProfileIndex") {
      composite_name = "kjzl6hvfrbw6c7keo17n66rxyo21nqqaa9lh491jz16od43nokz7ksfcvzi6bwc";
    }

    args.push('/opt/composites/' + composite_name + '--runtime.json')

    console.log(args);

    const promise = spawn('composedb', args);
    const childProcess = promise.childProcess;  
    console.log('[spawn] childProcess.pid: ', childProcess.pid);  

    childProcess.stdout.on('data', function (data: any) {
      console.log('[serve] stdout: ', data.toString());
    });
    childProcess.stderr.on('data', function (data: any) {
       
      console.log('[serve] stderr: ', data.toString());

        // filter first relevant msg
      if(data.toString().split("/")[2] != undefined) {

        port = data.toString().split("/")[2].split(":")[1];

        let pid = childProcess.pid.toString();

        servers.push({ 
          "key": aud,
          port,
          pid,
          "timestamp": Date.now()
        });    

        resolve({
          aud,
          port,
          pid
        });
      }
     
    });

    // promise.then(function () {
    //   console.log('[serve] done!');
    // })
    // .catch(function (err: any) {
    //   console.error('[serve] ERROR: ', err);
    // });



  });

}

const kill = (pid:string) => {

  const spawn = require('child-process-promise').spawn;
  const promise = spawn('kill', [pid]);
  const childProcess = promise.childProcess;

  childProcess.stdout.on('data', function (data: any) {
    console.log('[kill] stdout: ', data.toString());
  });
  childProcess.stderr.on('data', function (data: any) {
      console.log('[kill] stderr: ', data.toString());
  });

  promise.then(function () {
    console.log('[kill] done!');
  })
  .catch(function (err: any) {
    console.error('[kill] ERROR: ', err);
  });
  
}

app.post('/bin', async (req,res) => {

    console.log(req.body)

    let r = await bin(req.body.cli,req.body.cmd);

    res.send(r);

})

app.post('/readonly', async (req, res) => {

  const connection = await serve(req.body.port,req.body.composite_name,'','readonly');

  res.send(connection);
})

// app.post('/auth', async (req, res) => {

//     const connection = await serve(req.body.port,req.body.composite_name, req.body.pk,"")
    
//     res.send(connection);
// })

app.post('/connect', async (req, res) => {

  let connection;

  let cap = req.body;

  console.log(servers);
 
  let server = servers.find( s => s.key == cap.aud);

  if(server == undefined) {
    console.log('opening new connection!')

    let composite_name = cap.with.split(":")[1];

    const encryptedData = JSON.parse(
      new TextDecoder().decode(
        toBuffer(
          cap.keys[my_address]
        )
      )
    );

    let private_key = decrypt({
      encryptedData,
      privateKey: my_private_key
    });

    connection = await serve("5511",composite_name, private_key, cap.aud);

  } else {
    server.timestamp = Date.now();
    console.log('using existing connection!')
    connection = {
      aud: cap.aud,
      pid : server.pid,
      port : server.port
    }
  }
  
  res.send(connection);
})


app.post('/kill', (req, res) => {

  kill(req.body.pid);

  res.send(req.body)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})