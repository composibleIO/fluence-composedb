use marine_rs_sdk::marine;
use serde::Deserialize;


#[marine]
#[derive(Debug)]
pub struct Result {
    pub stdout: String,
    pub stderr: String,
    // err_code: i64,
}

#[marine]
#[derive(Debug, Deserialize)]
pub struct Connection {
    pub aud: String,
    pub pid: String,
    pub port: String
}


#[marine]
#[derive(Debug, Deserialize)]
pub struct ComposeDbConfig {
    pub ceramic_sidecar: String,
    pub composedb_sidecar: String,
    pub express_port: String,
    pub ceramic_port: String,
    pub readonly_port: String 
}

#[marine]
#[derive(Debug, Deserialize)]
pub struct Middleware {
    pub composedb : ComposeDbConfig
}

#[marine]
#[derive(Debug, Deserialize)]
pub struct ContractorDetails {
    pub eth_address: String,
    pub public_encryption_key: String,
    pub middleware: Middleware
}

