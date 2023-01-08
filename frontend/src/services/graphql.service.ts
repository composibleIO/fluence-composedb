export interface IGraphqlService {
    drill: (data: any, index_name: string) => any[]
}

export class GraphqlService {

    constructor() {}

    drill(data: any, index_name: string) : any[] {

        let array = []

        for (let node of data.data[index_name].edges) {
            array.push(Object.values(node)[0])
        }
        return array;
    }  
 }