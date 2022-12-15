import { doc } from "prettier";
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

        // const p = this.panes["identity-pane"];

        // if (this.main.eth.wallet) {
        //     this.buttons["eth-sign-in"].innerText = this.shortenEthAddress(this.main.eth.wallet);
        // }

        if (this.main.fluence.localPeerId) {
            this.buttons["select-local-peer"].innerText = this.shortenPeerId(this.main.fluence.localPeerId);
            this.buttons["select-local-peer"].parentNode.style.display = "block";
        }

        if (this.main.fluence.relayPeerId != undefined) {
            this.buttons["select-relay-peer"].innerText = this.shortenPeerId(this.main.fluence.relayPeerId);
            this.buttons["select-relay-peer"].parentNode.style.display = "block";
        }

        if (this.main.fluence.connection && this.main.fluence.status) {

            if (this.main.fluence.status.isConnected) {

                this.buttons["select-local-peer"].classList.add("connected");
                this.buttons["select-relay-peer"].classList.add("connected");   
            }
        }

        if (this.main.contractor.object != undefined) {
            this.buttons["select-contractor"].innerText = this.shortenPeerId(this.main.contractor.object.metadata.peer_id);
            this.buttons["select-contractor"].parentNode.style.display = "block";
          
            // this.buttons["select-service"].innerText = this.shortenPeerId(this.main.contractor.contractor.metadata.service_id[0]);
            // this.buttons["select-service"].parentNode.style.display = "block";

            this.buttons["eth-address"].parentNode.style.display = "flex";
           
        }

        if(this.main.cap.get() != null) {
            document.getElementById("eth-did").innerText = this.main.cap.get().aud;
        }

        if (this.main.composedb.isConnected()) {
            this.buttons["select-contractor"].classList.add("connected"); 
        }

        // check if has dedicated connection
        // 



        

        if (this.main.eth.walletAddress != undefined) {
            this.buttons["eth-address"].innerText = this.shortenPeerId(this.main.eth.walletAddress);
            
        }

         this.init();
    }

    shortenPeerId(id:string) : string {
        return ".." + id.substr(id.length - 12)
    }

    shortenEthAddress(id:string) : string {
        return ".." + id.substr(id.length - 16)
    }




}