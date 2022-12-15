import { IFluenceService, FluenceService } from "../services/fluence.service";
import { IEthereumService, EthereumService  } from "../services/ethereum.service";
import { IUiService, UiService } from "../services/ui.service";
import { ILitService, LitService } from "../services/lit.service";
import { IAquaService, AquaService } from "../services/aqua.service";
import { DidService, IDidService } from "../services/did.service";
import { GraphqlService, IGraphqlService } from "../services/graphql.service";
import { HtmlService, IHtmlService } from "../services/html.service";

import { Capability, Secrets } from "../interfaces/interfaces";
import { IButtonService, ButtonService } from "../services/button.service";
import { ContractorService, IContractorService } from "../services/contractor.service";
import { CapabilityService } from "../services/capability.service";
import { ICapabilityService } from "../services/capability.service";
import { ComposeDBService, IComposeDBService } from "../services/composedb.service";


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
        this.html = new HtmlService();
        this.lit = new LitService(this);
        this.ui = new UiService(this);
        this.init();
    }

    async init() {

        this.ui.init();
        this.buttons.init();
        let success = await this.fluence.connectToRandomRelayPeer();
        this.buttons.updateIdentityPane();

        await this.contractor.find();
        this.buttons.updateIdentityPane();

        this.renewProfileList();

    }

    async ethAddressSwitch() {

      await this.checkCap();
      this.buttons.updateIdentityPane();
      await this.renewProfileList();
      this.authConnection();
    }

    async renewProfileList() {

      let index = "simpleProfileIndex";
      let listData = this.graphql.drill(await this.aqua.query(), index);
      this.ui.insertList(this.html.renderProfileList(listData.reverse()));
    }

    async checkCap() {

      // is valid??? 
      if (await this.cap.get() == null) {
        // UIUIUIUIUI ask for signture ??? 
        // allow xx to use DID and its priv key to write on composedb 
        // add spinner ?? 
        await this.cap.new();     
      }
    }

    async authConnection() {
      
      await this.checkCap();
      document.getElementById("spinner").style.display = "flex";


      this.composedb.connection = await this.aqua.connect();

      if(this.composedb.isConnected()) {
            // greenlit contractor button 
        this.buttons.updateIdentityPane();
        document.getElementById("spinner").style.display = "none";
        //update table
        this.buttons.addEditButton(this.composedb.connection.aud);
        let b = this.ui.checkForNew(this.composedb.connection.aud);
        if (!b) {
          this.ui.addProfileForm(this.composedb.connection.aud);
        }
      }
    }


    initProfileForm() {
      this.ui.addProfileForm(this.cap.get().aud);
    }

    async updateProfile(formData: any) {

      try {

        if (this.cap.get().aud != formData["publicKey"]) {
          throw("somehow you switched wallets");
        }

        let r = await this.aqua.update(formData.displayName);

        await this.renewProfileList();
        this.buttons.addEditButton(this.cap.get().aud);
        

      } catch (e: any) {
        console.error(e);
      
      }
    }



    // async auth() {




    //  let keys = await this.aqua.fetchKeyStore();
    //  let content = await this.aqua.query();

    //     console.log(JSON.parse(keys.stderr));
    //     console.log(JSON.parse(content.stderr));

        // check if hasKEY 
                // fetchKeyStore + look up wallet address 

        // generateKey + storeKey


        // useKey





        // let message = 'fluence-composedb-' + this.eth.wallet; // should be pk 
        // let { encryptedString, encryptedSymmetricKey } = await this.lit.encrypt(message);

        // let es  = await this.blobToBase64(encryptedString).toString();

        // console.log(es);
        // console.log(encryptedString);
        // console.log(encryptedSymmetricKey);

        // let blob = await this.base64ToBlob(es);
        // console.log(blob);
    // }

    // async blobToBase64(blob: Blob) : Promise<string | ArrayBuffer> {
    //     return new Promise((resolve, _) => {
    //       const reader = new FileReader();
    //       reader.onloadend = () => resolve(reader.result);
    //       reader.readAsDataURL(blob);
    //     });
    //   }

    // async base64ToBlob(base64: string) : Promise<Blob>{

    //     const base64Response = await fetch(base64);  // type: 'application/octet-stream'
    //     return await base64Response.blob();

    //     // lit middleware 
    //     // $ base64 -d base64encodedfile > binaryfile – 


    //   }

}