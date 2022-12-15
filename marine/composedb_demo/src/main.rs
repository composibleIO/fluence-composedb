#![allow(
    non_snake_case,
    unused_variables,
    unused_imports,
    unused_parens,
    unused_mut
)]

// pub mod composite;
pub mod types;
// pub mod model;
pub mod requests;
pub mod files;
// pub mod lit;


use std::env;
use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;
use marine_rs_sdk::MountedBinaryResult;
// use marine_rs_sdk::WasmLoggerBuilder;
use serde_json;
use crate::types::Result;
use crate::types::Connection;
use crate::types::ComposeDbConfig;
// use crate::lit::LitKey;

module_manifest!();

const KEY: &str = "20fb10425bb635240f21189dcbe44cf7b390ef28019904eb84fa8ed62cd3d771";

pub fn main() {}

#[marine]
pub fn getContractorDetails() -> types::ContractorDetails {

    let composedb = types::ComposeDbConfig {
        ceramic_sidecar: "http://ceramic-sidecar".to_owned(),
        composedb_sidecar: "http://composedb-server".to_owned(),
        express_port: "3000".to_owned(),
        ceramic_port: "7007".to_owned(),
        readonly_port: "5501".to_owned()
    };

    let m = types::Middleware {
        composedb: composedb
    };

    types::ContractorDetails {
        eth_address: "0xF4aF5aB1F69175F94ec1A662Ab841e67Def92b2B".to_owned(),
        public_encryption_key: "RdkrKcgLPEtWcQ0aqH9Q42Gt53Al0r0+33c9otIQG1Y=".to_owned(),
        middleware: m
    }

}

#[marine] 
pub fn create_from_schema(composite_name: String, url: String) -> types::Result {

    requests::create_from_schema(composite_name, KEY.to_string(), url)
}

#[marine] 
pub fn deploy_from_schema(composite_name: String, url: String) -> types::Result {

    requests::create_from_schema(composite_name.clone(), KEY.to_owned(), url.clone());
    let composite_id = requests::deploy(composite_name.clone(), KEY.to_owned(), url.clone());
    let compilation = requests::compile(composite_name, KEY.to_owned(), url);

    compilation
}

#[marine] 
pub fn deploy_from_model(model_id: String, url: String) -> types::Result {

   // create tmp/composite.json
   let m = requests::model(model_id.to_string(), model_id.to_string(), url.clone());
   // deploy composite
   let composite_id = requests::deploy(model_id.to_string(), KEY.to_string(), url.clone());
   // compile to runtime json = ~ graphql schema
   let compilation = requests::compile(model_id.to_string(), KEY.to_string(), url.clone());
  // composite_id
   compilation
}

#[marine] 
pub fn deploy_from_composite(composite_name: String, url: String) -> types::Result {

   let composite_id = requests::deploy(composite_name.clone(), KEY.to_string(), url.clone());
   // compile to runtime json = ~ graphql schema
   let compilation = requests::compile(composite_name, KEY.to_string(), url.clone());
  // composite_id
   compilation 
}

#[marine] 
pub fn serve(composite_name: String, server_config: ComposeDbConfig) -> crate::types::Connection {
    
    requests::serve(composite_name, server_config)
}

#[marine] 
pub fn connect(cap: String, server_config: types::ComposeDbConfig ) -> crate::types::Connection {
    
    requests::connect(cap, server_config)
}

// #[marine] 
// pub fn storeKey(ethAddress: String, encryptedString: String, encryptedSymmetricKey: String, server_config: types::ComposeDbConfig) -> crate::types::Result {

//     let request = "{\"query\":\"mutation{createLitKeys(input:{content:{ethAddress:\\\"1xF816Bf1d588100b6cea06B12CCe53fA81E8124\\\",encryptedSymmetricKey:\\\"xxx\\\",encryptedString:\\\"fyu\\\"}}){document{ ethAddress,encryptedSymmetricKey,encryptedString}}}\"}";

//     requests::mutate(request.to_string(), KEY.to_string(), "5500".to_string(), server_config)
// }

#[marine] 
pub fn mutate(display_name: String, cap: String, connection: Connection, server_config: types::ComposeDbConfig  ) -> crate::types::Result {

    // content object with : 
    // slug for SimpleProfile
    // slug for displayName
    let request = "{\"query\":\"mutation{createSimpleProfile(input:{content:{displayName:\\\"$N\\\"}}){document{ displayName}}}\"}";
    let request = request.replace("$N", &display_name);
    
    requests::mutate(request.to_string(), cap, connection, server_config)
}

#[marine] 
pub fn query(server_config: types::ComposeDbConfig) -> types::Result {

    let endpoint = format!("{}:{}/graphql", server_config.composedb_sidecar, server_config.readonly_port);

    // let mut request : String; 

    // if port == "5499" {

    //     request = "{\"query\":\"query{litKeysIndex(first:100){edges{node{ethAddress,encryptedSymmetricKey,encryptedString}}}}\"}".to_owned();
   
    // } else {

    let request = "{\"query\":\"query{simpleProfileIndex(first:100){edges{node{displayName,owner{id}}}}}\"}".to_owned();
    // }

    let response = requests::query(request, endpoint.to_string());

    response
}

#[marine] 
pub fn kill(pid: String)  -> types::Result { 

    requests::kill(pid)
}

#[marine] 
pub fn test()  -> crate::types::Result { 

    crate::types::Result{
        stderr : "hi".to_owned(),
        stdout: "mafklapper".to_owned()
    }
}