import { doc } from "prettier";
import { IUIController } from "../controllers/ui.controller";
import { IMainController } from "../controllers/main.controller";
import { Capability, CdbConnection } from "../interfaces/interfaces";


interface UiElements {
    [key: string]: HTMLElement;
  }

export interface ILayoutService {

    ui: IUIController;
    sections: UiElements;
    init(): void;
    panes: UiElements;
    insertList: (el: Element) => void;
    addContractorSelectList: (html: Element) => void;
    showSection: (id: string) => void
    hideSection: (id: string) => void

}

export class LayoutService implements ILayoutService {

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

    addContractorSelectList(html: Element) {
        this.sections.select_contractor.querySelector('.block').appendChild(html, this.panes.main.querySelector('section:nth-child(2)'));
    }

    insertList(el: Element): void {

        let prevList = this.panes.main.querySelector("table#profilelist") 
        
        if (prevList != null) {
            prevList.remove();
        }

        this.panes.main.appendChild(el);
    }
}