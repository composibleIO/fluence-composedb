import { doc } from "prettier";
import { shortenPeerId } from "../factories/format-helpers.service";
import { IMainController } from "../controllers/main.controller";


interface UiElement {
    [key: string]: HTMLElement;
  }

export interface IButtonService {

    main: IMainController;
    buttons: UiElement[];
    init(): void;
    uiClick(e: Event, method:string): void;
    addEditButton: (public_key: string) => void
    updateIdentityPane: () => void;
}

export class ButtonService implements IButtonService {

    main: IMainController;
    buttons: any;

    constructor(main: IMainController) {

        this.main =  main;
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
                await this.main.eth.connectWallet(); // eth.signInWithEthereum();
                this.updateIdentityPane();
                this.main.authConnection();
            break;
            case 'edit_display_name_button':
                this.main.initProfileForm();
            break;
        }
    }

    addEditButton(public_key: string): void {

        let tr = document.querySelector('table#profilelist tr[data-owner="' + public_key + '"]');

        if (tr != null) {

            tr.classList.add('active');
            let td = tr.querySelector('td:last-of-type');
            td.innerHTML = '<button id="edit_display_name_button">Edit</button>';
            this.armButton(td.querySelector("button"));
        }
    }

    updateIdentityPane() {

        if (this.main.fluence.localPeerId) {
            this.buttons["select-local-peer"].innerText = shortenPeerId(this.main.fluence.localPeerId);
            this.buttons["select-local-peer"].parentNode.style.display = "block";
        }

        if (this.main.fluence.relayPeerId != undefined) {
            this.buttons["select-relay-peer"].innerText = shortenPeerId(this.main.fluence.relayPeerId);
            this.buttons["select-relay-peer"].parentNode.style.display = "block";
        }

        if (this.main.fluence.connection && this.main.fluence.status) {

            if (this.main.fluence.status.isConnected) {
                this.buttons["select-local-peer"].classList.add("connected");
                this.buttons["select-relay-peer"].classList.add("connected");   
            }
        }

        if (this.main.contractor.object != undefined) {
            this.buttons["select-contractor"].innerText = shortenPeerId(this.main.contractor.object.metadata.peer_id);
            this.buttons["select-contractor"].parentNode.style.display = "block";
            this.buttons["eth-address"].parentNode.style.display = "flex";
           
        }

        if (this.main.composedb.isConnected()) {
            this.buttons["select-contractor"].classList.add("connected"); 
        }

        if (this.main.eth.walletAddress != undefined) {
            this.buttons["eth-address"].innerText = shortenPeerId(this.main.eth.walletAddress);  
        }

         this.init();
    }

    



}