use marine_rs_sdk::marine;
use serde::{Deserialize, Deserializer};
use std::collections::HashMap;

#[derive(Debug, Default, Deserialize)]
pub struct TempModelData {
    pub jws: JWSObject,
    pub linkedBlock: String
}

#[derive(Deserialize, Debug, Default, PartialEq)]
pub struct View {
    pub account: HashMap<String,String>,
    pub root: HashMap<String,String>,
    pub models: HashMap<String,String>
}


#[derive(Debug, Deserialize)]
pub struct TempComposite {
    pub version: String,
    pub models: HashMap<String,Vec<TempModelData>>,
    pub aliases: HashMap<String,String>,
    pub views: View
}

#[marine]
#[derive(Debug, Default, Deserialize)]
pub struct Signature {
    pub signature: String,
    pub protected: String
}

#[marine]
#[derive(Debug, Default, Deserialize)]
pub struct JWSObject {
    pub payload: String,
    pub signatures: Vec<Signature>,
    pub link: String
}

#[marine]
#[derive(Debug, Default, Deserialize)]
pub struct MarineModelData {
    pub id : String,
    pub jws: JWSObject,
    pub linkedBlock: String
}


#[marine]
#[derive(Debug)]
pub struct MarineComposite {

    pub version: String,
    pub models: Vec<MarineModelData>,
    pub aliases: Vec<String>,
   // pub views: View
}

impl MarineComposite {

    pub fn fromTemp(t: TempComposite) -> Self {

        // convert hasmap into vec
        let mut aliases : Vec<String> = vec!();
        for (key, value) in t.aliases.into_iter() {
            aliases.push(value)
        }
        // convert hasmap with vecs into flattened vec
        let mut modelData : Vec<MarineModelData> = vec!();

        for (key, arr) in t.models.into_iter() {
            for v in arr {
                modelData.push({ MarineModelData {
                    id: key.clone(),
                    jws: v.jws,
                    linkedBlock: v.linkedBlock
                }})
            }
        }
        
        MarineComposite {
            version: t.version,
            models: modelData,
            aliases: aliases,
        }
    }
}