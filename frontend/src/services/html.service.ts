import Handlebars from "handlebars";

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});


export interface IHtmlService {

    renderProfileList: (list: any[]) => Element
    rowWithForm: (public_key: string) => Element
    rowInWaiting: (public_key: string) => Element
}


export class HtmlService implements IHtmlService {


    constructor() {

    }

    renderProfileList(list: any[]): Element {

        let section = document.createElement('section');

        const source =`
                <table id="profilelist">
                    <tbody>
                    {{#list}}
                        <tr data-owner={{owner.id}}>
                            <td>{{displayName}}</td>
                            <td>{{owner.id}}</td>
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


}