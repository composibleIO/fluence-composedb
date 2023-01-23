import { IFluenceService, FluenceService } from "../services/fluence.service";
import { IEthereumService, EthereumService  } from "../services/ethereum.service";
import { IUIController, UIController } from "./ui.controller";
import { ILitService, LitService } from "../services/lit.service";
import { IAquaService, AquaService } from "../services/aqua.service";
import { DidService, IDidService } from "../services/did.service";
import { IndexService, IIndexService } from "../services/index.service";
import { HtmlService, IHtmlService } from "../services/html.service";

import { CdbIndex, Contractor } from "../interfaces/interfaces";
import { IButtonService, ButtonService } from "../services/button.service";
import { ContractorService, IContractorService } from "../services/contractor.service";
import { SessionService, ISessionService } from "../services/session.service";
import { base64urlToJSON, JSONToBase64url, StringToBase64url } from "../factories/serialize";


const MY_INDEX = "TU_Profile";

export interface IMainController {

    aqua: IAquaService;
    session: ISessionService;
    contractor: IContractorService;
    did: IDidService;
    eth: IEthereumService;
    fluence: IFluenceService;
    indexes: {[key: string]: IIndexService};
    ui: IUIController;    
    findContractor: () => void;
    selectContractor : (contractor: Contractor) => void
    ethAddressSwitch: () => void;
    updateProfile: (formData: any) => void;
  }

export class MainController implements IMainController  {

    aqua: IAquaService;    cap: ISessionService;
    contractor: IContractorService;
    did: IDidService;
    eth: IEthereumService;
    fluence: IFluenceService;
    indexes: {[key: string]: IIndexService} = {};
    html: IHtmlService;
    session: ISessionService;
    ui: IUIController;
    

    constructor() {

      this.aqua = new AquaService(this);
      this.session = new SessionService(this);
      this.contractor = new ContractorService(this);
      this.did = new DidService(this);
      this.eth = new EthereumService(this);
      this.fluence = new FluenceService(this);
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

    async selectContractor(contractor: Contractor) {
      this.contractor.select(contractor);
      this.ui.afterSelectContractor();

      for (let index of this.contractor.serverConfig.indexes) {
          this.indexes[index.name] = new IndexService(this, index)
      };

      await this.renewProfileList(this.indexes[MY_INDEX]);
    }


    // 

    async ethAddressSwitch() {
      console.log({'address switch': Date.now()});
      this.ui.afterAddressSwitch();
      await this.renewProfileList(this.indexes[MY_INDEX]);
      // this.authConnection();
    }

    async renewProfileList(index: IIndexService) {

        this.ui.beforeRenewProfileList();
        await index.query();
        await this.session.has(index.resources());
      
    }


    async updateProfile(formData: any) {

        if (this.session.owner() != formData["publicKey"]) {
          throw("somehow you switched wallets");
        }

        // index name on form data ? 
        let index = this.indexes[0];

        await index.mutate('TU_Profile', formData);
        // all on index ??? 
        await this.renewProfileList(index);
        this.ui.afterUpdateProfile(this.session.owner());

    }
}