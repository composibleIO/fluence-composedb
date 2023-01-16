use marine_rs_sdk::marine;
use marine_rs_sdk::module_manifest;
use marine_rs_sdk::MountedBinaryResult;

module_manifest!();

#[marine]
#[derive(Debug)]
pub struct Result {
    pub stdout: String,
    pub stderr: String,
    // err_code: i64,
}

// pub fn ceramic_url(cid: &String) -> String {

//     let details = crate::contractor_details(cid);
//     let d = details.composedb.directions;
//     format!("http://{}{}_ceramic:{}", d.namespace, d.n, d.ceramic_port)
// } 

fn format_result(res: MountedBinaryResult) -> Result {

    let stdout = String::from_utf8(res.stdout).unwrap();
    let stderr = String::from_utf8(res.stderr).unwrap();

    Result {
        stdout: stderr,
        stderr: stdout,
    }
}

pub fn main() {}

#[marine]
pub fn query() -> Result {

    let ceramic_url = "http://cdb1_ceramic:7007";
    let definition = "IntcIm1vZGVsc1wiOntcIlRVX1Byb2ZpbGVcIjp7XCJpZFwiOlwia2p6bDZodmZyYnc2YzVtYTVjcmRjZGl5eHE3eXc1enFwdDZvMGVyY3d1eTFidzM5MjB6OHU3dHk4aWEzcDgyXCIsXCJhY2NvdW50UmVsYXRpb25cIjp7XCJ0eXBlXCI6XCJzaW5nbGVcIn19fSxcIm9iamVjdHNcIjp7XCJUVV9Qcm9maWxlXCI6e1wiYWNjb3VudElkXCI6e1widHlwZVwiOlwic3RyaW5nXCIsXCJyZXF1aXJlZFwiOnRydWV9LFwiZGlzcGxheU5hbWVcIjp7XCJ0eXBlXCI6XCJzdHJpbmdcIixcInJlcXVpcmVkXCI6dHJ1ZX19fSxcImVudW1zXCI6e30sXCJhY2NvdW50RGF0YVwiOntcInR1UHJvZmlsZVwiOntcInR5cGVcIjpcIm5vZGVcIixcIm5hbWVcIjpcIlRVX1Byb2ZpbGVcIn19fSI";


    let cmd = vec![
        "query".to_owned(),
        "-c".to_owned(),
        ceramic_url.to_owned(),
        "-d".to_owned(),
        definition.to_owned()
    ];
    
    format_result(tu_cdb_request(cmd))
}

#[marine]
#[link(wasm_import_module = "composedb_adapter")]
extern "C" {
    pub fn tu_cdb_request(cmd: Vec<String>) -> MountedBinaryResult;
}

