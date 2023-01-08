// use marine_rs_sdk::marine;
// use marine_rs_sdk::module_manifest;
// use marine_rs_sdk::MountedBinaryResult;

use graphql_client::{ GraphQLQuery, Response };
use serde_json::{json, Value};
use serde::Deserialize;

use crate::types::ContractorDetails;
use crate::types::TUIntermediary;
use crate::types::TUKey;


pub fn main() {}



pub fn has_intermediary(user_address: String, endpoint: String) -> Vec<TUIntermediary>{

    if let Some(intermediary) = find_intermediary(&user_address, &endpoint) {

        vec!(convert(intermediary))

    } else {
        
        vec!()
    }
}

fn find_intermediary(user_address: &String, endpoint: &String) -> Option<Value> {

    let mut res: Option<Value> = None;

    let provider_address= String::from("0x2829199C88ae7A58E68A8FdBb97c4E47101C0332");

    let intermediaries_as_string = intermediaries(endpoint);
    let intermediaries_as_value: serde_json::Value = serde_json::from_str(&intermediaries_as_string).unwrap();

    let mut array: Vec<String> = vec!();

    if let Some(intermediaries) = intermediaries_as_value["data"]["tU_IntermediaryIndex"]["edges"].as_array() {
        for intermediary in intermediaries {
            if intermediary["node"]["iss"].to_string().replace("\"","") == user_address.to_owned() && intermediary["node"]["aud"].to_string().replace("\"","") == provider_address  {

                let mut i = intermediary["node"].to_owned();
                let mut array: Vec<Value> = vec!();

                if let Some(keys) = i["keys"]["edges"].as_array() {
                    for key in keys {
                        array.push(key["node"].to_owned())
                    }
                }
                
                i["keys"] = serde_json::Value::Array(array);

                res = Some(i);
            }
        }
    }
    res
}

pub fn store_intermediary(intermediary: TUIntermediary, endpoint: String) -> Vec<TUIntermediary> {

    let request_string = String::from("{\"query\":\"mutation{createTU_Intermediary(input:{content:{ aud: \\\"$PROVIDER\\\", did:\\\"$DID\\\", iss:\\\"$USER\\\"}}){document{ id }}}\"}");
    let request_string = request_string.replace("$DID", &intermediary.did);
    let request_string = request_string.replace("$PROVIDER", &intermediary.aud);
    let request_string = request_string.replace("$USER", &intermediary.iss);

    let res = crate::curl::curl_request(curl_args(request_string,&endpoint));

    let stdout = String::from_utf8(res.stdout).unwrap();
    let stderr = String::from_utf8(res.stderr).unwrap();

    let intermediary_as_value: serde_json::Value = serde_json::from_str(&stdout).unwrap();

    let stream_id = intermediary_as_value["data"]["createTU_Intermediary"]["document"]["id"].to_string().replace("\"","");

    let res2 = crate::curl::curl_request(curl_args(key_request_string(find_key(&intermediary.keys, &intermediary.aud).unwrap(), &stream_id, &intermediary.did), &endpoint));

    let res3 = crate::curl::curl_request(curl_args(key_request_string(find_key(&intermediary.keys, &intermediary.iss).unwrap(), &stream_id, &intermediary.did), &endpoint));
  
    has_intermediary(intermediary.iss, endpoint)
}

fn find_key(keys: &Vec<TUKey>, recipient: &String) -> Option<TUKey> {

    for k in keys {
        if(k.recipient == recipient.to_owned()) {
            return Some(k.clone())
        }
    }
    
    None
}

fn curl_args(request_string: String, endpoint: &String) -> Vec<String> {

    return vec![
            String::from("-s"),
            String::from("-X"),
            String::from("POST"),
            String::from("-H"),
            String::from("Content-Type: application/json"),
            String::from("--data"),
            request_string,
            endpoint.to_owned()
        ];
}

fn key_request_string(key: TUKey, stream_id: &String, did: &String) -> String {

    let request_string = String::from("{\"query\":\"mutation{createTU_Key(input:{content:{ encrypted_key: \\\"$KEY\\\", did:\\\"$DID\\\", recipient:\\\"$RECIPIENT\\\", intermediary:\\\"$ID\\\"}}){document{ did }}}\"}");
    let request_string = request_string.replace("$KEY", &key.encrypted_key);
    let request_string = request_string.replace("$ID", stream_id);
    let request_string = request_string.replace("$RECIPIENT", &key.recipient);
    
    request_string.replace("$DID", did)
}

fn convert(v: Value) -> crate::types::TUIntermediary {

    serde_json::from_value(v).unwrap()
}

pub fn intermediaries(endpoint: &String) -> String {

    #[derive(GraphQLQuery)]
    #[graphql(
        schema_path = "./subgraphs/schema.graphql",    // we hebben een probleem met BigInt, BigDecFDeal en Bytes
        query_path = "./subgraphs/query.graphql",
        response_derives = "Debug,Serialize,PartialEq"
    )]
    struct IntermediariesView;

    let variables = intermediaries_view::Variables {
        // id: id
    };

    let request_body = IntermediariesView::build_query(variables);
    let request_string = serde_json::to_string(&request_body).unwrap();
   
    let curl_args = vec![
            String::from("-s"),
            String::from("-X"),
            String::from("POST"),
            String::from("-H"),
            String::from("Content-Type: application/json"),
            String::from("--data"),
            request_string,
            endpoint.to_owned()
        ];

    let response = crate::curl::curl_request(curl_args);
     
    let response = String::from_utf8(response.stdout).unwrap();

    response
}
