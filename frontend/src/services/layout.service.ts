import { doc } from "prettier";
import { IUIController } from "../controllers/ui.controller";
import { IMainController } from "../controllers/main.controller";


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
    clearSection: (id: string) => void;
    toggleSpinner: (id: string) => void;

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

    clearSection(id: string) {

        switch (id) {
            case "list" :
                let t =  this.sections[id].querySelector('.block table');
                if (t != null)  t.remove() 
            break;
            case "select_contractor" :
                let ul =  this.sections[id].querySelector('.block ul');
                if(ul !== null) ul.remove();
            break;
        }

       
    }

    toggleSpinner(id: string) {

        let s = this.sections[id].querySelector('.spinner');
        if (s !== null) s.classList.toggle("in_view");
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