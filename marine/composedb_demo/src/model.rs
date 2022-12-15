use marine_rs_sdk::marine;
use serde::{Deserialize, Deserializer};


#[marine]
#[derive(Debug, Deserialize)]
pub struct Ref {
    pub id: String,
    pub name: String,
    pub description: String
}