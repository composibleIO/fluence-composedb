import Handlebars from "handlebars";
import { IUIController } from "../controllers/ui.controller";
import { shortenPeerId } from "../factories/format-helpers.service";
import { Contractor } from "../interfaces/interfaces";

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('shortenDid', function(did, options) {
    return "did:key:.." + did.substr(did.length - 12)
});

Handlebars.registerHelper('shortenPeer', function(did, options) {
    return ".." + did.substr(did.length - 12)
})

Handlebars.registerHelper('shortenAddr', function(did, options) {
    return ".." + did.substr(did.length - 12)
});

export interface IHtmlService {

    ui: IUIController
    renderProfileList: (list: any[]) => Element
    rowWithForm: (public_key: string) => Element
    rowInWaiting: (public_key: string) => Element
    selectContractorList: (selection: Contractor[]) => Element
}

export class HtmlService implements IHtmlService {

    constructor(public ui: IUIController) {}

    renderProfileList(list: any[]): Element {

        let section = document.getElementById('list');

        const template = Handlebars.compile(`
                <table id="profilelist">
                    <tbody>
                    {{#list}}
                        <tr data-owner={{accountId}}>
                            <td>{{displayName}}</td>
                            <td>{{shortenAddr accountId}}</td>
                            <td>
                            </td>
                        </tr>
                    {{/list}}
                    </tbody>
                </table>
            `);

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
                    <td>{{shortenAddr public_key}}</td>  
                    <td> <button type="submit" form="edit_display_name">Save</button></td>      
            `;
        
        const template = Handlebars.compile(source);   
        
        row.innerHTML = template({public_key});

        return row;

    }

    rowInWaiting (public_key: string): Element {

        let row = document.createElement("tr");
        row.setAttribute("data-owner", public_key);
        const template = Handlebars.compile('<td>...</td><td>{{shortenAddr public_key}}</td><td></td>');
        row.innerHTML = template({public_key});
        return row;
    }

    selectContractorList (selection: Contractor[]) : Element {

        let ul = document.createElement('ul');
        ul.id = "contractor_select_list";

        for (let c of selection) {

            let li = document.createElement('li');
            li.onclick = () => { this.ui.main.selectContractor(c) };

            c.details.composedb.indexes = c.details.composedb.indexes.filter( (i) => i.name !== "tuIntermediaryIndex");

            const template = Handlebars.compile(`
                <label>Eth address:</label>
                <div>{{shortenAddr c.details.composedb.public_info.eth_address}}</div>
                <label>Fluence peer:</label>
                <div>{{shortenPeer c.metadata.peer_id}}</div>
                <label>Indexes:</label>
                <div>{{#each c.details.composedb.indexes}}<span>{{name}}</span>{{/each}}</div>
            `);  

            li.innerHTML = template({c});
            
            ul.appendChild(li);
        }

        return ul;

    }
}