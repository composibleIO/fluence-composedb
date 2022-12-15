use marine_rs_sdk::marine;
use serde::Deserialize;

#[marine]
#[derive(Debug, Default, Deserialize)]
pub struct LitKey {
    pub ethAddress: String,
    pub encryptedSymmetricKey: String,
    pub encryptedString: String
}