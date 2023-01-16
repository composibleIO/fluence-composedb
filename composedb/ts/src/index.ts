// 'use strict';
import * as dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express';
import bodyParser, { json } from "body-parser";



// import { ConfigService } from './config.service';
import { CeramicService } from './ceramic.service.js';
// import { LinuxService} from './linux.service';
import { ComposeService } from "./compose.service.js";

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
dotenv.config()
const port = process.env.EXPRESS_PORT;

const ceramic = new CeramicService();
const composedb = new ComposeService();

ceramic.init();

// used to init this service. 
app.post('/init', async (req,res) => {
})

app.post("/query", async (req,res) => {
    res.send(await composedb.query(req.body.session,req.body.query))
});


app.post('/compile', async (req,res) => {
  res.send(await ceramic.compile());
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})