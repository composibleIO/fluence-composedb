import { selection } from "d3-selection";
import { IHtmlService, HtmlService } from "../services/html.service";
import { IButtonService, ButtonService } from "../services/button.service";
import { ILayoutService, LayoutService } from "../services/layout.service";
import { IFormService, FormService } from "../services/form.service";
import { IMainController } from "./main.controller";
import { Capability, CdbConnection, Contractor, Intermediary } from "../interfaces/interfaces";

export interface IUIController {

    buttons: IButtonService;
    forms: IFormService;
    html: IHtmlService;
    layout: ILayoutService; 
    main: IMainController;
    

    beforeInit: () => void;
    afterInit: () => void;
    beforeFindContractor: () => void;
    beforeSelectContractor: (selection: Contractor[]) => void;
    afterSelectContractor: () => void;
    afterAddressSwitch: () => void;
    beforeRenewProfileList: () => void;
    afterRenewProfileList: (listData: any[]) => void;
    beforeCheckCapability: () => void;
    afterCheckCapability: (cap:Capability) => void;
    afterCheckIntermediary: (intermediary: Intermediary) => void;
    afterConnection: (connection: CdbConnection) => void;
    addProfileForm: (cap:Capability) => void;
    afterUpdateProfile: (cap: Capability) => void;
}

export class UIController {

    buttons: IButtonService;
    forms: IFormService;
    html: IHtmlService;
    layout: ILayoutService;
    main: IMainController;

    constructor(main: IMainController) {

        this.buttons = new ButtonService(this);
        this.forms = new FormService(this)
        this.html = new HtmlService(this);
        this.layout = new LayoutService(this);
        this.main =  main;
    }

    beforeInit() {

        this.layout.init();
        this.forms.init();
        this.buttons.init();
    }

    afterInit() {

        this.buttons.updateIdentityPane();
    }

    beforeFindContractor() {
        this.layout.clearSection('select_contractor'); 
        this.layout.showSection('select_contractor'); 
        this.layout.toggleSpinner('select_contractor')
    }

    beforeSelectContractor(selection: Contractor[]) {

        this.layout.clearSection('select_contractor'); 
        this.layout.addContractorSelectList(this.html.selectContractorList(selection));
        this.layout.toggleSpinner('select_contractor');

        this.buttons.updateIdentityPane();
  
        this.layout.hideSection("intermediary");
        this.layout.hideSection("capability");
        this.layout.showSection("select_eth_address");
    }

    afterSelectContractor() {

        this.layout.hideSection('select_contractor'); 
        this.buttons.updateIdentityPane();
    }

    afterAddressSwitch() {
        
        this.layout.hideSection("intermediary");
        this.layout.hideSection("capability");
        document.getElementById("validated").hidden = true; 
        document.getElementById("cap").innerHTML = "";
        this.buttons.updateIdentityPane();
    }

    beforeRenewProfileList() {
        this.layout.clearSection("list");
        this.layout.toggleSpinner("list");
    }

    afterRenewProfileList(listData: any[]) {
        this.html.renderProfileList(listData.reverse())
    }

    beforeCheckCapability() {
        this.layout.showSection("capability");
    }

    afterCheckCapability(cap: Capability) {
        document.getElementById("cap").innerHTML = '<ul><li>with:' + cap.with + '</li><li>do:' + cap.do + '</li><li>expires:' + cap.expires + '</li></ul>';
        document.getElementById("spinner").style.display = "flex";
    }

    afterCheckIntermediary(intermediary: Intermediary) {
        this.layout.showSection("intermediary");
        document.getElementById("eth-did").innerText = intermediary.did;
    }

    afterConnection(connection: CdbConnection) {

        document.getElementById("spinner").style.display = "none";
        document.getElementById("validated").hidden = false; 
        this.buttons.updateIdentityPane();
        this.buttons.addEditButton(this.main.cap.getCap().iss);
        let b = this.forms.checkForNew(this.main.cap.getCap().iss);
        if (!b) {
          this.forms.addProfileForm(this.main.cap.getCap());
        }
    }

    addProfileForm(cap:Capability) {
        this.forms.addProfileForm(cap);
    }

    afterUpdateProfile(cap: Capability) {
        this.buttons.addEditButton(cap.aud);
    }
}

