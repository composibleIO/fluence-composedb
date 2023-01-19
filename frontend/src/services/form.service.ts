import { doc } from "prettier";
import { IUIController } from "../controllers/ui.controller";
import { IMainController } from "../controllers/main.controller";



interface UiElements {
    [key: string]: HTMLElement;
  }

export interface IFormService {

    ui: IUIController;
    forms: UiElements;
    init(): void;
    uiSubmit(e: FormDataEvent, method:string): void;
    addProfileForm: (owner:string) => void;
    checkForNew: (public_key: string) => boolean | HTMLElement;

}

export class FormService implements IFormService {

    ui: IUIController;
    buttons: any;
    forms: any;
    panes: any;
    sections: any;

    constructor(ui: IUIController) {

        this.ui =  ui;
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

    async uiSubmit(e: FormDataEvent, id: string)  {

        const formData = this.parseFormData(e.formData);

        switch(id) {

            case 'local-keypair-form':

                const keypair = await this.ui.main.fluence.makeKeyPair(formData.sk);
                this.ui.main.fluence.localPeer = keypair;
                this.ui.buttons.updateIdentityPane();

                this.forms['local-keypair-form'].style.zIndex = '1';
                this.forms['select-relay-form'].style.zIndex = '101';

            case 'edit_display_name':

                let tr = document.getElementById(id).parentNode.parentNode 
                tr.parentNode.replaceChild(this.ui.html.rowInWaiting(formData.publicKey),tr);
                this.ui.main.updateProfile(formData)
                
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

    checkForNew(public_key: string): boolean | HTMLElement {

        let tableBody = document.querySelector("table#profilelist tbody");
        const tr = tableBody.querySelector('[data-owner="' + public_key + '"]') as HTMLElement;
        return tr == null ? false : tr;
    }

    addProfileForm(owner:string) {

        let row = this.ui.html.rowWithForm(owner);
        const tr = this.checkForNew(owner);
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
    }
}