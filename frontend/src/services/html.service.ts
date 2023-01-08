import Handlebars from "handlebars";
import { IMainController } from "../controllers/main.controller";
import { shortenPeerId } from "../factories/format-helpers.service";
import { Contractor } from "../interfaces/interfaces";

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('shorten', function(did, options) {
    return "did:key:.." + did.substr(did.length - 16)
});

export interface IHtmlService {

    main: IMainController
    renderProfileList: (list: any[]) => Element
    rowWithForm: (public_key: string) => Element
    rowInWaiting: (public_key: string) => Element
    selectContractorList: (selection: Contractor[]) => Element
}

export class HtmlService implements IHtmlService {

    constructor(public main: IMainController) {}

    renderProfileList(list: any[]): Element {

        let section = document.getElementById('list');

        const source =`
                <table id="profilelist">
                    <tbody>
                    {{#list}}
                        <tr data-owner={{owner.id}}>
                            <td>{{displayName}}</td>
                            <td>{{shorten owner.id}}</td>
                            <td>
                            </td>
                        </tr>
                    {{/list}}
                    </tbody>
                </table>
            `;
        
        const template = Handlebars.compile(source);   
        section.innerHTML =  template({list});
        return section;
    }

    rowWithForm (public_key: string): Element {

        let row = document.createElement("tr");
        row.setAttribute("data-owner", public_key);

        const source =`                    
                    <td>
                        <form id="edit_display_name">
                            <input id="displayName" name="displayName" type="text">
                            <input id="displayName" name="publicKey" type="hidden" value="{{public_key}}">    
                        </form>
                    </td>
                    <td>{{public_key}}</td>  
                    <td> <button type="submit" form="edit_display_name">Save</button></td>      
            `;
        
        const template = Handlebars.compile(source);   
        
        row.innerHTML = template({public_key});

        return row;

    }

    rowInWaiting (public_key: string): Element {

        let row = document.createElement("tr");
        row.setAttribute("data-owner", public_key);
        row.innerHTML = '<td>...</td><td>' + public_key + '</td><td></td>';

        return row;
    }

    selectContractorList (selection: Contractor[]) : Element {

        let ul = document.createElement('ul');
        ul.id = "contractor_select_list";

        for (let c of selection) {

            let li = document.createElement('li');
            li.onclick = () => { this.main.selectContractor(c) };
            li.innerHTML = `<span>` + shortenPeerId(c.metadata.peer_id) + `</span>`
            
            ul.appendChild(li);
        }

        return ul;

    }
}