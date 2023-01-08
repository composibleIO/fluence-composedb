import { IFluenceService, FluenceService } from "../services/fluence.service";
import { IEthereumService, EthereumService  } from "../services/ethereum.service";
import { IUiService, UiService } from "../services/ui.service";
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

const indexName = "simpleProfileIndex";


export interface IMainController {

    aqua: IAquaService;
    buttons: IButtonService;
    cap: ICapabilityService;
    composedb: IComposeDBService;
    contractor: IContractorService;
    did: IDidService;
    eth: IEthereumService;
    fluence: IFluenceService;
    graphql: IGraphqlService;
    html: IHtmlService;
    lit: ILitService;
    ui: IUiService;    
    // sign: () => void;
    selectContractor : (contractor: Contractor) => void
    ethAddressSwitch: () => void;
    authConnection: () => void;
    initProfileForm: () => void;
    updateProfile: (formData: any) => void;
  }

export class MainController implements IMainController  {

    aqua: IAquaService;
    buttons: IButtonService;
    cap: ICapabilityService;
    composedb: IComposeDBService;
    contractor: IContractorService;
    did: IDidService;
    eth: IEthereumService;
    fluence: IFluenceService;
    graphql: IGraphqlService;
    html: IHtmlService;
    lit: ILitService;
    ui: IUiService;
    

    constructor() {

      this.aqua = new AquaService(this);
      this.buttons = new ButtonService(this);
      this.cap = new CapabilityService(this);
      this.composedb = new ComposeDBService();
      this.contractor = new ContractorService(this);
      this.did = new DidService();
      this.eth = new EthereumService(this);
      this.fluence = new FluenceService(this);
      this.graphql = new GraphqlService();
      this.html = new HtmlService(this);
      this.lit = new LitService(this);
      this.ui = new UiService(this);
      this.init();
    }

    // connect
    // find contractors
    // get details from contractors 
    async init() {

        this.ui.init();
        this.buttons.init();
        let success = await this.fluence.connectToRandomRelayPeer();

        this.buttons.updateIdentityPane();

        let selection = await this.contractor.find();
        console.log(selection);
        this.ui.addContractorSelectList(this.html.selectContractorList(selection));
        this.ui.showSection('select_contractor');
    }

    selectContractor(contractor: Contractor) {

      this.contractor.select(contractor);
      this.buttons.updateIdentityPane();
  
      this.ui.hideSection("intermediary");
      this.ui.hideSection("capability");
      this.ui.showSection("select_eth_address");
      this.renewProfileList();
    }

    async ethAddressSwitch() {

      console.log({'address switch': Date.now()});
      this.ui.hideSection("intermediary");
      this.ui.hideSection("capability");
      document.getElementById("validated").hidden = true; 
      
      document.getElementById("cap").innerHTML = "";
      this.buttons.updateIdentityPane();
      await this.renewProfileList();
      this.authConnection();

    }

    async renewProfileList() {

      this.ui.sections.list.innerHTML = "";
      let index = this.contractor.serverConfig.indexes.find( (i: CdbIndex) => i.name == indexName);

      console.log(index);
      const time1 = Date.now();
      let connection = await this.aqua.connect(index);
      const time2 = Date.now();
      console.log('pub connection: ' + (time2 - time1) / 1000 + 'sec');

      let listData = this.graphql.drill(await this.aqua.query(connection), index.name);

      this.html.renderProfileList(listData.reverse())
    }

    async checkIntermediary() {

      let hasIntermediary = await this.aqua.hasIntermediary();
      return (hasIntermediary.length > 0) ? this.cap.setIntermediary(hasIntermediary[0]) : await this.createIntermediary();
    }

    async checkCap() {

      this.ui.showSection("capability");

      if (this.cap.getCap() == null) {

        let cap = this.cap.newCap(); 
        let signature = await this.eth.sign(JSON.stringify(cap));
        this.cap.signCap(cap,signature); 
        document.getElementById("cap").innerHTML = '<ul><li>with:' + cap.with + '</li><li>do:' + cap.do + '</li><li>expires:' + cap.expires + '</li></ul>';
     
      } else {
        let cap = this.cap.getCap();
        document.getElementById("cap").innerHTML = '<ul><li>with:' + cap.with + '</li><li>do:' + cap.do + '</li><li>expires:' + cap.expires + '</li></ul>';
      }
    }

    async createIntermediary() {

      let intermediary = await this.cap.newIntermediary();
      await this.aqua.storeIntermediary(intermediary);
      return intermediary;
    }

    async authConnection() {
      
      await this.checkIntermediary();
    
      this.ui.showSection("intermediary");
      document.getElementById("eth-did").innerText = this.cap.getIntermediary().did;
    
      await this.checkCap();

      document.getElementById("spinner").style.display = "flex";

      let index = this.contractor.serverConfig.indexes.find( (i: CdbIndex) => i.name == indexName);
      index.port = "5502";

      const time1 = Date.now();
      // check authorized connection 
      this.composedb.connection = await this.aqua.connect(index);
      const time2 = Date.now();
      console.log('auth connection: ' + (time2 - time1) / 1000 + 'sec');

      if(this.composedb.isConnected()) {

        document.getElementById("spinner").style.display = "none";
        document.getElementById("validated").hidden = false; 
        this.buttons.updateIdentityPane();
        this.buttons.addEditButton(this.composedb.connection.user);
        let b = this.ui.checkForNew(this.composedb.connection.user);
        if (!b) {
          this.ui.addProfileForm(this.composedb.connection.user);
        }
      }
    }


    initProfileForm() {
      this.ui.addProfileForm(this.cap.getCap().did);
    }

    async updateProfile(formData: any) {

      try {

        if (this.cap.getCap().did != formData["publicKey"]) {
          throw("somehow you switched wallets");
        }

        const time3 = Date.now();
        let r = await this.aqua.update(formData.displayName);
        const time4 = Date.now();
        console.log('update: ' + (time4 - time3) / 1000 + 'sec');

        await this.renewProfileList();
        this.buttons.addEditButton(this.cap.getCap().aud);
        

      } catch (e: any) {
        console.error(e);
      
      }
    }
}