import { IFluenceService, FluenceService } from "../services/fluence.service";
import { IEthereumService, EthereumService  } from "../services/ethereum.service";
import { IUIController, UIController } from "./ui.controller";
import { ILitService, LitService } from "../services/lit.service";
import { IAquaService, AquaService } from "../services/aqua.service";
import { DidService, IDidService } from "../services/did.service";
import { GraphqlService, IGraphqlService } from "../services/graphql.service";
import { HtmlService, IHtmlService } from "../services/html.service";

import { Capability, CdbIndex, Contractor, Intermediary, SecretKey } from "../interfaces/interfaces";
import { IButtonService, ButtonService } from "../services/button.service";
import { ContractorService, IContractorService } from "../services/contractor.service";
import { CapabilityService } from "../services/capability.service";
import { ICapabilityService } from "../services/capability.service";
import { ComposeDBService, IComposeDBService } from "../services/composedb.service";
import { NONAME } from "dns";

//const indexName = "simpleProfileIndex";
const indexName = "tU_ProfileIndex";


export interface IMainController {

    aqua: IAquaService;
    cap: ICapabilityService;
    composedb: IComposeDBService;
    contractor: IContractorService;
    did: IDidService;
    eth: IEthereumService;
    fluence: IFluenceService;
    graphql: IGraphqlService;
    ui: IUIController;    
    findContractor: () => void;
    selectContractor : (contractor: Contractor) => void
    ethAddressSwitch: () => void;
    authConnection: () => void;
    initProfileForm: () => void;
    updateProfile: (formData: any) => void;
  }

export class MainController implements IMainController  {

    aqua: IAquaService;    cap: ICapabilityService;
    composedb: IComposeDBService;
    contractor: IContractorService;
    did: IDidService;
    eth: IEthereumService;
    fluence: IFluenceService;
    graphql: IGraphqlService;
    html: IHtmlService;
    ui: IUIController;
    

    constructor() {

      this.aqua = new AquaService(this);
      this.cap = new CapabilityService(this);
      this.composedb = new ComposeDBService();
      this.contractor = new ContractorService(this);
      this.did = new DidService(this);
      this.eth = new EthereumService(this);
      this.fluence = new FluenceService(this);
      this.graphql = new GraphqlService();
      this.ui = new UIController(this);
      this.init();
    }

    // connect
    // find contractors
    // get details from contractors 
    async init() {
        this.ui.beforeInit();
        let success = await this.fluence.connectToRandomRelayPeer();
        this.ui.afterInit();
        this.findContractor()
    }

    async findContractor() {
      this.ui.beforeFindContractor();
      let selection = await this.contractor.find();
      console.log(selection);
      this.ui.beforeSelectContractor(selection);
    }

    selectContractor(contractor: Contractor) {
      this.contractor.select(contractor);
      this.ui.afterSelectContractor();
      this.renewProfileList();
    }

    async ethAddressSwitch() {
      console.log({'address switch': Date.now()});
      this.ui.afterAddressSwitch();
      await this.renewProfileList();
      this.authConnection();
    }

    async renewProfileList() {

      this.ui.beforeRenewProfileList();
      let index = this.contractor.serverConfig.indexes.find( (i: CdbIndex) => i.name == indexName);
      console.log(index);
      const time1 = Date.now();
      let connection = await this.aqua.connect(index);
      console.log('pub connection: ' + (Date.now() - time1) / 1000 + 'sec');

      let query = '{"query":"query{tU_ProfileIndex(first: 10){edges{node{displayName,accountId}}}}"}';

      let listData = this.graphql.drill(await this.aqua.query(query,connection), index.name);
      this.ui.afterRenewProfileList(listData)
    }

    async checkIntermediary() {

      let available_intermediaries = await this.aqua.hasIntermediary();

      let i_for_this_contractor = available_intermediaries.find( i => i.aud === this.contractor.serverConfig.public_info.eth_address);

      if (i_for_this_contractor != undefined) {

        this.cap.setIntermediary(i_for_this_contractor);
      
      } else if (available_intermediaries.length > 0) {

        await this.cap.spawnIntermediary(available_intermediaries[0]);

      } else {

        await this.createIntermediary();
      }


    }

    async createIntermediary() {

      let intermediary = await this.cap.newIntermediary();
      await this.aqua.storeIntermediary(intermediary);
      return intermediary;
    }

    async checkCap() {

      let cap: Capability = null;
      this.ui.beforeCheckCapability();
      
      if (this.cap.getCap() == null) {
        cap = this.cap.newCap(); 
        let signature = await this.eth.sign(JSON.stringify(cap));
        this.cap.signCap(cap,signature); 
      } else {
        cap = this.cap.getCap(); 
      }
      this.ui.afterCheckCapability(cap);
    }
    
    async authConnection() {

      await this.did.deriveDidPkh();
      
      // await this.checkIntermediary(); 
      // this.ui.afterCheckIntermediary(this.cap.getIntermediary());
      // await this.checkCap();

      // let index = this.contractor.serverConfig.indexes.find( (i: CdbIndex) => i.name == indexName);
      // index.port = "5502";

      // const time1 = Date.now();
      // this.composedb.connection = await this.aqua.connect(index);
      // console.log('auth connection: ' + (Date.now() - time1) / 1000 + 'sec');

      // if(this.composedb.isConnected()) {
      //   this.ui.afterConnection(this.composedb.connection);
      // }
    }

    initProfileForm() {
      this.ui.addProfileForm(this.cap.getCap());
    }

    async updateProfile(formData: any) {

      try {

        if (this.cap.getCap().iss != formData["publicKey"]) {
          throw("somehow you switched wallets");
        }
        const time3 = Date.now();
        let r = await this.aqua.update(formData.displayName,formData.publicKey);
        console.log('update: ' + (Date.now() - time3) / 1000 + 'sec');
        await this.renewProfileList();
        this.ui.afterUpdateProfile(this.cap.getCap());
      } catch (e: any) {
        console.error(e);
      }
    }
}