import { CdbIndex } from "../interfaces/interfaces";
import { IMainController } from "../controllers/main.controller";
import { base64urlToJSON, StringToBase64url } from "../factories/serialize";

interface CdbModel {
    name: string,
    id: string,
    accountRelation?: any
}

export interface IIndexService {
    main: IMainController
    name: string
    resources: () => string[]
    query: () => Promise<any>
    mutate: (formData: any) => Promise<any>
    drill: (data: any, index_name: string) => any[]
}

export class IndexService {

    _models : any[] = [];
    _resources:  string[] = []
    _runtime_definition: string;
    _composite_definition: string;
    _name: string;

    constructor(public main: IMainController, index: CdbIndex) {
    
        this.parseIndex(index)
    }

    get name() {
        return this._name;
    }

    parseIndex(index: CdbIndex) {

        this._name = index.name;
        this._runtime_definition = index.runtime_definition;
        this._composite_definition = index.composite_definition;

        let d = base64urlToJSON(this._runtime_definition);

        for (let m of Object.keys(d.models)) {
            this._models.push({
                name : m,
                id: d.models[m].id,
                accountRelation: d.models[m].accountRelation
            });
        }

        // necessary? 
        for (let m of this._models) {
            this._resources.push("ceramic://*?model=" + m.id);
        }

        console.log(this);
    }

    resources() {

        return this._resources;
    }

    drill(data: any, index_name: string) : any[] {

        let array = []

        for (let node of data[index_name].edges) {
            array.push(Object.values(node)[0])
        }
        return array;
    }  


    formatIndexName(modelName: string) {
        return modelName.charAt(0).toLowerCase() + modelName.slice(1) + "Index";
    }

    formateMutationMethod(modelName: string) {
        return "create" + modelName;
    }

    formatQuery() {

        // should i really try to derive queries? Isnt the point of graphql to make custom queries? 

        const query = `
        query {
            ` + this.formatIndexName(this.name) + `(first: 24) {
                edges { 
                    node { 
                        owner {
                            id
                        },
                        version,
                        displayName,
                        accountId
                    }
                }
            }
        }
      `;

        return StringToBase64url(query.replace(/\s+/g, ''));
    }

    formatMutation(formData: any) {
        
        const query = `
        mutation {
          ` + this.formateMutationMethod(this.name) + `(
                input: {
                    content: {
                        displayName: "` + formData.displayName + `",
                        accountId: "` + formData.publicKey + `"
                    }
                }
            )
            { 
                document {
                    displayName,
                    accountId  
                }
            }
        }`;

        // console.log(query);

        return StringToBase64url(query.replace(/\s+/g, ''));
    }

    responseHandler(modelName: string, error: string, success: boolean, data: any) {

        // console.log(data);

        if(success) {
          
            let content = JSON.parse(data.content.replace(/\\/g,'').substring(1).slice(0, -1));
            if(data.success) {
                // console.log(content);
              let listData = this.drill(content, this.formatIndexName(modelName));
              this.main.ui.afterRenewProfileList(listData);
            } else {
              console.log(data.error);
            }
          } else {
              console.log(error);
          } 
    }

    async query() {

        let query = this.formatQuery();
        // console.log(query);
        let [error, success, data] = await this.main.aqua.query(this._runtime_definition, query);
        this.responseHandler(this._name, error, success, data);
    }

    async mutate(formData: any) {

        let query = this.formatMutation(formData);
        // console.log(query);
        // console.log(await this.main.session.serialize(this._resources));
        let [error, success, data] = await this.main.aqua.mutate(this._runtime_definition, query, await this.main.session.serialize(this));
        // console.log(data);
        if(error && error.length > 0) console.log(error);
}
 }