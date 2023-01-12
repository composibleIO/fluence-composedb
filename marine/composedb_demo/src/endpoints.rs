
pub fn format_intermediaries_endpoint(cid: &String) -> String{

    let details = crate::contractor_details(cid);
    let d = details.composedb.directions;

    format!("http://{}{}_composedb:{}/graphql", d.namespace, d.n, details.composedb.indexes[1].port)
}

pub fn composedb_url(cid: &String) -> String {

    let details = crate::contractor_details(cid);
    let d = details.composedb.directions;

    format!("http://{}{}_composedb:{}", d.namespace, d.n, d.express_port)
} 

pub fn query_url(cid: &String, connection: crate::types::Connection) -> String {

    let details = crate::contractor_details(cid);
    let d = details.composedb.directions;

    format!("http://{}{}_composedb:{}/graphql", d.namespace, d.n, connection.port)
} 

pub fn ceramic_url(cid: &String) -> String {

    let details = crate::contractor_details(cid);
    let d = details.composedb.directions;

    format!("http://{}{}_ceramic:{}", d.namespace, d.n, d.ceramic_port)
} 
