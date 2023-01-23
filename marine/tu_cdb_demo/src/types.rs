use marine_rs_sdk::marine;
use serde::{Deserialize, Serialize};

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
    pub composite: String,
    pub model: String,
    pub name: String,
    pub pid: u64,
    pub port: String,
    pub timestamp: u64,
    pub user: String
}

#[marine]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ComposeDbPublicInfo {
    pub eth_address: String,
    pub public_encryption_key: String
}

#[marine]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ComposeDbDirections {
    pub ceramic_port: String,
    pub express_port: String,
    pub n: String,
    pub namespace: String
}

#[marine]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ComposeDbIndex {
    pub composite_definition: String,
    pub name: String,
    pub runtime_definition: String
}

#[marine]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ComposeDbConfig {
    pub directions: ComposeDbDirections,
    pub indexes: Vec<ComposeDbIndex>,
    pub public_info: Vec<ComposeDbPublicInfo>,
}

#[marine]
#[derive(Debug, Deserialize, Serialize)]
pub struct ContractorDetails {
    pub composedb : ComposeDbConfig
}

#[marine]
#[derive(Debug, Deserialize, Serialize)]
pub struct Intermediary {
    pub composedb : ComposeDbConfig
}

#[marine]
#[derive(Debug, Deserialize, Clone)]
pub struct TUKey {
    pub encrypted_key: String,
    pub recipient: String
}

#[marine]
#[derive(Debug, Deserialize)]
pub struct TUIntermediary {
    pub aud: String,
    pub did: String,
    pub iss: String,
    pub keys: Vec<TUKey>
}

#[marine]
#[derive(Debug, Deserialize)]
pub struct CdbResult {
    pub count: u64,
    pub content: String,
    pub error: String,
    pub success: bool
}