import { doc } from "prettier";
import { shortenPeerId } from "../factories/format-helpers.service";
import { IMainController } from "../controllers/main.controller";
import { IUIController } from "../controllers/ui.controller";


interface UiElement {
    [key: string]: HTMLElement;
  }

export interface IButtonService {

    ui: IUIController;
    buttons: UiElement[];
    init(): void;
    uiClick(e: Event, method:string): void;
    addEditButton: (public_key: string) => void
    updateIdentityPane: () => void;
}

export class ButtonService implements IButtonService {

    ui: IUIController;
    buttons: any;

    constructor(ui: IUIController) {

        this.ui =  ui;
        this.buttons = {};
    }

    init() {

        let self = this;

        [].slice.call(document.querySelectorAll("button[type='button']")).forEach((el: HTMLButtonElement) =>  {  
                 
            if (this.buttons[el.id] == undefined) {
                this.buttons[el.id] = el;   
                this.armButton(el);
            }
        });
    }

    armButton(el: HTMLButtonElement) {

        let self = this;

        el.addEventListener("click", (e: Event) => {
                self.uiClick(e, el.id)
        })
    }   

    async uiClick(e: Event, id: string)  {

        switch(id) {

            case 'eth-address':
                await this.ui.main.session.new(this.ui.main.indexes[0].resources()); // eth.signInWithEthereum();
                this.updateIdentityPane();
            //    this.ui.main.authConnection();
            break;
            case 'edit_display_name_button':
                this.ui.addProfileForm(this.ui.main.session.owner());
            break;
            case 'select-contractor':
                this.ui.main.findContractor();
            break;
        }
    }

    addEditButton(public_key: string): void {

        // console.log(public_key);

        let tr = document.querySelector('table#profilelist tr[data-owner="' + public_key + '"]');

        if (tr == null) {

            this.ui.forms.addProfileForm(public_key);

        } else {
            tr.classList.add('active');
            let td = tr.querySelector('td:last-of-type');
            td.innerHTML = '<button id="edit_display_name_button">Edit</button>';
            this.armButton(td.querySelector("button"));
        } 
    }

    updateIdentityPane() {

        if (this.ui.main.fluence.localPeerId) {
            this.buttons["select-local-peer"].innerText = shortenPeerId(this.ui.main.fluence.localPeerId);
            this.buttons["select-local-peer"].parentNode.style.display = "block";
        }

        if (this.ui.main.fluence.relayPeerId != undefined) {
            this.buttons["select-relay-peer"].innerText = shortenPeerId(this.ui.main.fluence.relayPeerId);
            this.buttons["select-relay-peer"].parentNode.style.display = "block";
        }

        if (this.ui.main.fluence.connection && this.ui.main.fluence.status) {

            if (this.ui.main.fluence.status.isConnected) {
                this.buttons["select-local-peer"].classList.add("connected");
                this.buttons["select-relay-peer"].classList.add("connected");   
            }
        }

        if (this.ui.main.contractor.object != undefined) {

            this.buttons["select-contractor"].innerText = shortenPeerId(this.ui.main.contractor.object.metadata.peer_id);
            this.buttons["select-contractor"].parentNode.style.display = "block";
            this.buttons["eth-address"].parentNode.style.display = "flex";
        }

        // if (this.ui.main.composedb.isConnected()) {
        //     this.buttons["select-contractor"].classList.add("connected"); 
        // }

        if (this.ui.main.eth.walletAddress != undefined) {
            this.buttons["eth-address"].innerText = shortenPeerId(this.ui.main.eth.walletAddress);  
        }

         this.init();
    }

    



}