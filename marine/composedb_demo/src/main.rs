#![allow(
    non_snake_case,
    unused_variables,
    unused_imports,
    unused_parens,
    unused_mut
)]


pub mod types;
pub mod curl;
pub mod bin_requests;
pub mod http_requests;
pub mod files;
pub mod ipfs;
pub mod intermediaries;

use std::fs;
use std::env;
use std::str;
// use std::io;

use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;
use marine_rs_sdk::MountedBinaryResult;
// use marine_rs_sdk::WasmLoggerBuilder;
use serde_json;
use crate::types::Result;
use crate::types::Connection;
use crate::types::ComposeDbConfig;
use crate::types::ComposeDbIndex;
use crate::types::TUIntermediary;

module_manifest!();


pub fn main() {}

#[marine]
pub fn contractor_details(cid: &String) -> types::ContractorDetails {

    let s = ipfs::dag_get(cid).unwrap();
    
    serde_json::from_str(&s).unwrap()
}

#[marine]
pub fn has_intermediary(user_address: String, cid: String) -> Vec<TUIntermediary>  {

    intermediaries::has_intermediary(user_address, format_intermediaries_endpoint(&cid))
}

#[marine]
pub fn store_intermediary(intermediary: TUIntermediary, cid: String) -> Vec<TUIntermediary>  {

    intermediaries::store_intermediary(intermediary, format_intermediaries_endpoint(&cid))
}

fn format_intermediaries_endpoint(cid: &String) -> String{

    let details = contractor_details(cid);
    let d = details.composedb.directions;

    format!("http://{}{}_composedb:{}/graphql", d.namespace, d.n, details.composedb.indexes[1].port)
}


pub fn composedb_url(cid: &String) -> String {

    let details = contractor_details(cid);
    let d = details.composedb.directions;

    format!("http://{}{}_composedb:{}", d.namespace, d.n, d.express_port)
} 

pub fn query_url(cid: &String, connection: Connection) -> String {

    let details = contractor_details(cid);
    let d = details.composedb.directions;

    format!("http://{}{}_composedb:{}/graphql", d.namespace, d.n, connection.port)
} 

pub fn ceramic_url(cid: &String) -> String {

    let details = contractor_details(cid);
    let d = details.composedb.directions;

    format!("http://{}{}_ceramic:{}", d.namespace, d.n, d.ceramic_port)
} 


#[marine]
pub fn init(namespace: &String, n: &String, indexes: Vec<types::ComposeDbIndex>) -> String {

    // potentially do other stuff to create/augment config 
    let express_port : &str = "3000";
    let ceramic_port : &str = "7007";
  
   
   // call composedb to get public info  & init readonly server
    let public_info = http_requests::init(namespace, n, &express_port.to_string());
    // 

   // store on ipfs .. cid is included in fluence record 
    let directions = crate::types::ComposeDbDirections {
        namespace: namespace.to_owned(),
        n: n.to_owned(),
        express_port: express_port.to_owned(),
        ceramic_port: ceramic_port.to_owned()
    };

    let composedb = crate::types::ComposeDbConfig {
        directions,
        indexes,
        public_info
    };

    let obj = crate::types::ContractorDetails {
        composedb: composedb
    };

   // make this generic type
   let r = ipfs::dag_put(serde_json::to_value(obj).unwrap());

    r.unwrap()

}

#[marine] 
pub fn deploy_index(index: ComposeDbIndex, contractor_cid: &String) -> String {

    let composedb_url = composedb_url(contractor_cid);
    let ceramic_url = ceramic_url(contractor_cid);

    let mut res1 = Result {
        stderr: "".to_owned(),
        stdout: "".to_owned(),
    };

    if (index.model != "") {
        res1 = bin_requests::create_from_model(&index, &composedb_url, &ceramic_url);
    } else if (index.composite !="") {
        res1 = bin_requests::create_from_schema(&index, &composedb_url, &ceramic_url);
    }

    let res2 = bin_requests::deploy(&index, &composedb_url, &ceramic_url);
    let res3 = bin_requests::compile(&index, &composedb_url, &ceramic_url);

    format!("{},{},{},{},{},{}", res1.stderr, res1.stdout, res2.stderr, res2.stdout, res3.stderr, res3.stdout)

}

#[marine] 
pub fn serve(index: ComposeDbIndex, contractor_cid: &String) -> crate::types::Connection {

    let composedb_url = composedb_url(contractor_cid);
    
    http_requests::connect(index, "null".to_owned(), composedb_url)
}

#[marine] 
pub fn connect(index: ComposeDbIndex, cap: String, contractor_cid: &String ) -> crate::types::Connection {

    let composedb_url = composedb_url(contractor_cid);
    
    http_requests::connect(index, cap, composedb_url)
}

// #[marine] 
// pub fn storeKey(ethAddress: String, encryptedString: String, encryptedSymmetricKey: String, server_config: types::ComposeDbConfig) -> crate::types::Result {

//     let request = "{\"query\":\"mutation{createLitKeys(input:{content:{ethAddress:\\\"1xF816Bf1d588100b6cea06B12CCe53fA81E8124\\\",encryptedSymmetricKey:\\\"xxx\\\",encryptedString:\\\"fyu\\\"}}){document{ ethAddress,encryptedSymmetricKey,encryptedString}}}\"}";

//     requests::mutate(request.to_string(), KEY.to_string(), "5500".to_string(), server_config)
// }

#[marine] 
pub fn mutate(display_name: String, cap: String, connection: Connection, contractor_cid: &String ) -> crate::types::Result {

    let query_url = query_url(contractor_cid, connection);
    // content object with : 
    // slug for SimpleProfile
    // slug for displayName
    let request = "{\"query\":\"mutation{createSimpleProfile(input:{content:{displayName:\\\"$N\\\"}}){document{ displayName}}}\"}";
    let request = request.replace("$N", &display_name);

    // validate capability ??? 
    
    http_requests::mutate(request.to_string(), query_url)
}

#[marine] 
pub fn query(connection: Connection, contractor_cid: &String) -> types::Result {

    let query_url = query_url(contractor_cid, connection);

    let request = "{\"query\":\"query{simpleProfileIndex(first:100){edges{node{displayName,owner{id}}}}}\"}".to_owned();

    let response = http_requests::query(request, query_url);

    response
}

