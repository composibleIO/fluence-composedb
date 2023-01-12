#![allow(
    non_snake_case,
    unused_variables,
    unused_imports,
    unused_parens,
    unused_mut
)]


pub mod types;
pub mod endpoints;
pub mod curl;
pub mod bin_requests;
pub mod http_requests;
pub mod files;
pub mod ipfs;
pub mod intermediaries;

use std::fs;
use std::env;
use std::str;

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
pub fn init(namespace: &String, n: &String, indexes: Vec<types::ComposeDbIndex>) -> String {

    // potentially do other stuff to create/augment config 
    let express_port : &str = "3000";
    let ceramic_port : &str = "7007";
  
   // call composedb to get public info  & init readonly server
    let public_info = http_requests::init(namespace, n, &express_port.to_string());

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

    let composedb_url = endpoints::composedb_url(contractor_cid);
    let ceramic_url = endpoints::ceramic_url(contractor_cid);

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

    let composedb_url = endpoints::composedb_url(contractor_cid);
    http_requests::connect(index, "null".to_owned(), composedb_url)
}

#[marine] 
pub fn connect(index: ComposeDbIndex, cap: String, contractor_cid: &String ) -> crate::types::Connection {

    let composedb_url = endpoints::composedb_url(contractor_cid);
    http_requests::connect(index, cap, composedb_url)
}

#[marine]
pub fn contractor_details(cid: &String) -> types::ContractorDetails {

    let s = ipfs::dag_get(cid).unwrap();
    serde_json::from_str(&s).unwrap()
}

#[marine]
pub fn has_intermediary(user_address: String, cid: String) -> Vec<TUIntermediary>  {

    intermediaries::has_intermediary(user_address, endpoints::format_intermediaries_endpoint(&cid))
}

#[marine]
pub fn store_intermediary(intermediary: TUIntermediary, cid: String) -> Vec<TUIntermediary>  {

    intermediaries::store_intermediary(intermediary, endpoints::format_intermediaries_endpoint(&cid))
}

#[marine] 
pub fn mutate(display_name: String, account_id: String, cap: String, connection: Connection, contractor_cid: &String ) -> crate::types::Result {

    let query_url = endpoints::query_url(contractor_cid, connection);
    let request = "{\"query\":\"mutation{createTU_Profile(input:{content:{displayName:\\\"$N\\\",accountId:\\\"$A\\\"}}){document{ displayName,accountId}}}\"}";
    let request = request.replace("$N", &display_name);
    let request = request.replace("$A", &account_id);
    
    http_requests::mutate(request.to_string(), query_url)
}

#[marine] 
pub fn query(query: String, connection: Connection, contractor_cid: &String) -> types::Result {

    let query_url = endpoints::query_url(contractor_cid, connection);
    let response = http_requests::query(query, query_url);

    response
}

