use marine_rs_sdk::marine;
use marine_rs_sdk::MountedBinaryResult;

#[marine]
#[link(wasm_import_module = "composedb_adapter")]
extern "C" {
    pub fn tu_cdb_request(cmd: Vec<String>) -> MountedBinaryResult;
}

