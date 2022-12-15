"use strict";
// 'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const body_parser_1 = __importDefault(require("body-parser"));
const eth_sig_util_1 = require("@metamask/eth-sig-util");
const ethereumjs_util_1 = require("ethereumjs-util");
const app = express();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const port = 3000;
// REQD FROM ENV! 
const my_address = "0xF4aF5aB1F69175F94ec1A662Ab841e67Def92b2B";
const my_private_key = "7cdc2bc75eb650a6d30b919f540315c6ec500a946c5fe8fa0911f414b296ecf0";
const servers = [];
const bin = (cli, args) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        const spawn = require('child-process-promise').spawn;
        console.log(args);
        const promise = spawn(cli, args);
        const childProcess = promise.childProcess;
        childProcess.stdout.on('data', function (data) {
            console.log('[serve] stdout: ', data.toString());
        });
        childProcess.stderr.on('data', function (data) {
            // hier de poort uitpeuteren? 
            console.log('[serve] stderr: ', data.toString());
            resolve(data.toString());
        });
    });
});
const serve = (port, composite_name, pk, aud) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
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
            args.push('--did-private-key');
            args.push(pk);
        }
        if (composite_name == "simpleProfileIndex") {
            composite_name = "kjzl6hvfrbw6c7keo17n66rxyo21nqqaa9lh491jz16od43nokz7ksfcvzi6bwc";
        }
        args.push('/opt/composites/' + composite_name + '--runtime.json');
        console.log(args);
        const promise = spawn('composedb', args);
        const childProcess = promise.childProcess;
        console.log('[spawn] childProcess.pid: ', childProcess.pid);
        childProcess.stdout.on('data', function (data) {
            console.log('[serve] stdout: ', data.toString());
        });
        childProcess.stderr.on('data', function (data) {
            console.log('[serve] stderr: ', data.toString());
            // filter first relevant msg
            if (data.toString().split("/")[2] != undefined) {
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
});
const kill = (pid) => {
    const spawn = require('child-process-promise').spawn;
    const promise = spawn('kill', [pid]);
    const childProcess = promise.childProcess;
    childProcess.stdout.on('data', function (data) {
        console.log('[kill] stdout: ', data.toString());
    });
    childProcess.stderr.on('data', function (data) {
        console.log('[kill] stderr: ', data.toString());
    });
    promise.then(function () {
        console.log('[kill] done!');
    })
        .catch(function (err) {
        console.error('[kill] ERROR: ', err);
    });
};
app.post('/bin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    let r = yield bin(req.body.cli, req.body.cmd);
    res.send(r);
}));
app.post('/readonly', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield serve(req.body.port, req.body.composite_name, '', 'readonly');
    res.send(connection);
}));
// app.post('/auth', async (req, res) => {
//     const connection = await serve(req.body.port,req.body.composite_name, req.body.pk,"")
//     res.send(connection);
// })
app.post('/connect', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    let cap = req.body;
    console.log(servers);
    let server = servers.find(s => s.key == cap.aud);
    if (server == undefined) {
        console.log('opening new connection!');
        let composite_name = cap.with.split(":")[1];
        const encryptedData = JSON.parse(new TextDecoder().decode((0, ethereumjs_util_1.toBuffer)(cap.keys[my_address])));
        let private_key = (0, eth_sig_util_1.decrypt)({
            encryptedData,
            privateKey: my_private_key
        });
        connection = yield serve("5511", composite_name, private_key, cap.aud);
    }
    else {
        server.timestamp = Date.now();
        console.log('using existing connection!');
        connection = {
            aud: cap.aud,
            pid: server.pid,
            port: server.port
        };
    }
    res.send(connection);
}));
app.post('/kill', (req, res) => {
    kill(req.body.pid);
    res.send(req.body);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
