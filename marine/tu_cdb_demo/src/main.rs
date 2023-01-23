use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;
use marine_rs_sdk::MountedBinaryResult;

pub mod types;
pub mod config;
pub mod curl;
pub mod ipfs;
pub mod composedb;

module_manifest!();

use crate::types::CdbResult;
// use crate::types::ComposeDbIndex;
use crate::types::ContractorDetails;

pub fn main() {}

fn format_result(res: MountedBinaryResult) -> CdbResult {

    let output = String::from_utf8(res.stdout).unwrap();

    let v : serde_json::Value = serde_json::from_str(&output).unwrap();

    let mut count = v["count"].as_u64().unwrap();
    let mut content = v["content"].to_string();
    let mut error = v["error"].to_string();
    let mut success = v["success"].as_bool().unwrap();

    CdbResult {
        count,
        content,
        error,
        success
    }
}

pub fn ceramic_url(cid: &String) -> String {

    let url: String;

    if cid == "localhost" {
        
        url = String::from("http://0.0.0.0:7007");
    
    } else {
        
        let details = contractor_details(cid);
        let d = details.composedb.directions;
        url = format!("http://{}{}_ceramic:{}", d.namespace, d.n, d.ceramic_port);
    }

    url
} 


#[marine]
pub fn init(namespace: &String, n: &String, indexes: String, pk: String) -> String {
    config::init(namespace, n, indexes, &pk)
}

#[marine]
pub fn contractor_details(cid: &String) -> ContractorDetails {
    let s = ipfs::dag_get(cid).unwrap();
    serde_json::from_str(&s).unwrap()
}

// #[marine]
// pub fn deploy_index() -> Result {

//     // what needs to be done?? 
//     // 1 deploy = await composite.startIndexingOn(ceramic)
//               //  return serialized schema ? include in index? with contractor? 

//     // 2 compile -- is this necessary with ts ? 
// }
 

#[marine]
pub fn query(contractor_cid: String, definition: String, query: String) -> CdbResult {

    let ceramic_url = ceramic_url(&contractor_cid);

    let cmd = vec![
        "query".to_owned(),
        "-c".to_owned(),
        ceramic_url.to_owned(),
        "-d".to_owned(),
        definition.to_owned(),
        "-q".to_owned(),
        query.to_owned(),
    ];

    format_result(composedb::tu_cdb_request(cmd))
}

#[marine]
pub fn mutate(contractor_cid: String, definition: String, query: String, session: String) -> CdbResult {

    let ceramic_url = ceramic_url(&contractor_cid);

    let cmd = vec![
        "mutate".to_owned(),
        "-c".to_owned(),
        ceramic_url.to_owned(),
        "-d".to_owned(),
        definition.to_owned(),
        "-q".to_owned(),
        query.to_owned(),
        "-s".to_owned(),
        session.to_owned(),
    ];

    format_result(composedb::tu_cdb_request(cmd))
}

