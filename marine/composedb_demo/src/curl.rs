use marine_rs_sdk::marine;
use marine_rs_sdk::MountedBinaryResult;

#[marine]
#[link(wasm_import_module = "curl_adapter")]
extern "C" {
    pub fn curl_request(url: Vec<String>) -> MountedBinaryResult;
}
