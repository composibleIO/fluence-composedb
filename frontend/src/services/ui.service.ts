import { doc } from "prettier";
import { IMainController } from "../controllers/main.controller";


interface UiElements {
    [key: string]: HTMLElement;
  }

export interface IUiService {

    main: IMainController;
    forms: UiElements;
    sections: UiElements;
    init(): void;
    uiSubmit(e: FormDataEvent, method:string): void;
    panes: UiElements;
    insertList: (el: Element) => void;
    addProfileForm: (item: string) => void;
    checkForNew: (public_key: string) => boolean | HTMLElement;
    addContractorSelectList: (html: Element) => void;
    showSection: (id: string) => void
    hideSection: (id: string) => void

}

export class UiService implements IUiService {

    main: IMainController;
    buttons: any;
    forms: any;
    panes: any;
    sections: any;

    constructor(main: IMainController) {

        this.main =  main;
        this.buttons = {};
        this.forms = {};
        this.panes = {};
        this.sections = {};
    }

    init() {

        let self = this;
    
        [].slice.call(document.getElementsByTagName("form")).forEach((el: HTMLFormElement) =>  {  

            this.forms[el.id] = el;
            this.armForm(el);   
        });

        [].slice.call(document.getElementsByTagName("aside")).concat(document.getElementsByTagName("main")[0]).forEach((el: HTMLElement) =>  { 

            let id = el.id 
            
            this.panes[el.id] = el;
        });

        [].slice.call(document.getElementsByTagName("section")).forEach((el: HTMLElement) =>  { 

            this.sections[el.id] = el;
        });

    }

    showSection(id: string) {
        this.sections[id].hidden = false;
    }

    hideSection(id: string) {
        this.sections[id].hidden = true;
    }

    armForm(el: HTMLFormElement) {

        let self = this;

        const onSubmit = (e: Event) => {

            e.preventDefault();
            new FormData(el);
        }

        el.addEventListener("submit", onSubmit );
        el.addEventListener("formdata", async (cc) => {
            self.uiSubmit(cc,el.id) // switch ding doen
        });
    }

    addContractorSelectList(html: Element) {
        this.sections.select_contractor.querySelector('.block').appendChild(html, this.panes.main.querySelector('section:nth-child(2)'));
    }


    async uiSubmit(e: FormDataEvent, id: string)  {

        const formData = this.parseFormData(e.formData);

        switch(id) {

            case 'local-keypair-form':

                const keypair = await this.main.fluence.makeKeyPair(formData.sk);
                this.main.fluence.localPeer = keypair;
                this.main.buttons.updateIdentityPane();

                this.forms['local-keypair-form'].style.zIndex = '1';
                this.forms['select-relay-form'].style.zIndex = '101';


            case 'edit_display_name':

                let tr = document.getElementById(id).parentNode.parentNode 
                
                tr.parentNode.replaceChild(this.main.html.rowInWaiting(formData.publicKey),tr);

            
                this.main.updateProfile(formData)
                // 

            break;

        }
    }


    parseFormData(formData: FormData) {

        let object: any  = {};
        formData.forEach((value, key) => {
            // Reflect.has in favor of: object.hasOwnProperty(key)
            if(!Reflect.has(object, key)){
                object[key] = value;
                return;
            }
            if(!Array.isArray(object[key])){
                object[key] = [object[key]];    
            }
            object[key].push(value);
        });

        return object;
    }

    

    insertList(el: Element): void {

        let prevList = this.panes.main.querySelector("table#profilelist") 
        
        if (prevList != null) {
            prevList.remove();
        }

        this.panes.main.appendChild(el);

    }

    checkForNew(public_key: string): boolean | HTMLElement {

        let tableBody = document.querySelector("table#profilelist tbody");
        const tr = tableBody.querySelector('[data-owner="' + public_key + '"]') as HTMLElement;

        return tr == null ? false : tr;
    }

    addProfileForm(public_key: string) {

        let row = this.main.html.rowWithForm(public_key);
        const tr = this.checkForNew(public_key);
        let value: string = null;

        if(tr && tr !=true) {

            value = (tr.querySelector("td:first-of-type") as HTMLElement).innerText
            document.querySelector("table#profilelist tbody").replaceChild(row, tr)
        
        } else {
            document.querySelector("table#profilelist tbody").prepend(row)
        }

        this.armForm(row.querySelector("form")); 

        const input = row.querySelector("input");
        if (value != null) { input.value = value; }
        input.focus();
         
        // init form
    }

  

}