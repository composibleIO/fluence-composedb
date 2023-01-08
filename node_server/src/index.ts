// 'use strict';
import * as dotenv from 'dotenv'
import express = require("express")
import bodyParser, { json } from "body-parser";
import { ConfigService } from './config.service';
import { CeramicService } from './ceramic.service';
import { LinuxService} from './linux.service';
import { ComposeDbService } from "./composedb.service";

const app: express.Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
dotenv.config()
const port = process.env.EXPRESS_PORT;

const config = new ConfigService();
const ceramic = new CeramicService();
const linux = new LinuxService();
const composedb = new ComposeDbService();

// used to init this service. 
app.post('/init', async (req,res) => {

  console.log({"init": Date.now()});
  res.send(config.get())
})

app.post('/bin', async (req,res) => {

  console.log("bin");
  res.send(await composedb.cli(req.body.cli,req.body.cmd));
})

app.post('/connect', async (req,res) => {

  const cap = (req.body.cap && req.body.cap != "null") ? req.body.cap : null;
  res.send(await ceramic.connect(req.body.index, cap));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})