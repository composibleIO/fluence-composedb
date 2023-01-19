import { IMainController } from "../controllers/main.controller";
import { base64urlToJSON, StringToBase64url } from "../factories/serialize";

interface CdbModel {
    name: string,
    id: string,
    accountRelation?: any
}

export interface IIndexService {
    main: IMainController
    resources: () => string[]
    query: (name: string) => Promise<any>
    mutate: (name: string, formData: any) => Promise<any>
    drill: (data: any, index_name: string) => any[]
}

export class IndexService {

    _models : any[] = [];
    _resources:  string[] = []
    _definition: string;

    constructor(public main: IMainController, definition: string) {
    
        this.parseDefintion(definition)
    }

    parseDefintion(definition: string) {

        this._definition = definition;

        let d = JSON.parse(base64urlToJSON(definition));

        for (let m of Object.keys(d.models)) {
            this._models.push({
                name : m,
                id: d.models[m].id,
                accountRelation: d.models[m].accountRelation
            });
        }

        for (let m of this._models) {
            this._resources.push("ceramic://*?model=" + m.id);
        }
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

    formatQuery(model: CdbModel) {

        // should i really try to derive queries? Isnt the point of graphql to make custom queries? 
        
        return StringToBase64url(`
        query {
            ` + this.formatIndexName(model.name) + `(first: 24) {
                edges { 
                    node { 
                        displayName,
                        accountId
                    }
                }
            }
        }
      `);
    }

    formatMutation(model: CdbModel, formData: any) {
        
        return StringToBase64url(`
        mutation {
          ` + this.formateMutationMethod(model.name) + `(
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
        }
    `);
    }

    responseHandler(modelName: string, error: string, success: boolean, data: any) {

        if(success) {
            let content = JSON.parse(data.content.replace(/\\/g,'').substring(1).slice(0, -1));
            if(data.success) {
              let listData = this.drill(content, this.formatIndexName(modelName));
              this.main.ui.afterRenewProfileList(listData);
            } else {
              console.log(data.error);
            }
          } else {
              console.log(error);
          } 
    }

    async query(modelName: string) {

            let model = this._models.find( m => m.name == modelName);
            let query = this.formatQuery(model);
            let [error, success, data] = await this.main.aqua.query(this._definition, query);
            this.responseHandler(modelName, error, success, data);
    }

    async mutate(modelName: string, formData: any) {

        let model = this._models.find( m => m.name == modelName);
        let query = this.formatMutation(model,formData);
        let [error, success, data] = await this.main.aqua.mutate(this._definition, query, await this.main.session.serialize(this._resources));
        this.responseHandler(modelName, error, success, data);
}
 }