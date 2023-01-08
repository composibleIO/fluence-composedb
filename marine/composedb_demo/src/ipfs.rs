use marine_rs_sdk::marine;
use marine_rs_sdk::MountedBinaryResult;

use std::error::Error;
use serde_json::Value;

// #[marine]
// #[link(wasm_import_module = "curl_adapter")]
// extern "C" {
//     pub fn curl_request(url: Vec<String>) -> MountedBinaryResult;
// }

pub fn extract_cid (response: &String) -> String {

    let v : serde_json::Value = serde_json::from_str(response).unwrap();

    v["Cid"]["/"].as_str().unwrap().to_string()
}

// pub fn dag_put<T: types::_::_serde::Serialize>(obj: T) -> Result<String,Box<dyn Error>> {

pub fn dag_put(v: Value) -> Result<String,Box<dyn Error>> {

    let url = format!("http://127.0.0.1:5001/api/v0/dag/put?pin=true");

    let data_string = format!("file={}", v);
  
    let curl_args = vec![
        String::from("-s"),
        String::from("-X"),
        String::from("POST"),
        String::from("-F"),
        data_string,
        url
    ];
  
    let response = crate::curl::curl_request(curl_args);
  
    let response = extract_cid(&String::from_utf8(response.stdout).unwrap());

    Ok(response)
}

pub fn dag_get(cid: &String) -> Result<String,Box<dyn Error>> {

    let url = format!("http://127.0.0.1:5001/api/v0/dag/get?arg={}", cid);
  
    let curl_args = vec![
        String::from("-s"),
        String::from("-X"),
        String::from("POST"),
        url
    ];
  
    let response = crate::curl::curl_request(curl_args);
  
    let response = String::from_utf8(response.stdout).unwrap();

    Ok(response)
}