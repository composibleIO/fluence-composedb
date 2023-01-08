use marine_rs_sdk::marine;
use marine_rs_sdk::MountedBinaryResult;

#[marine]
#[link(wasm_import_module = "composedb_adapter")]
extern "C" {
    pub fn cdb_request(endpoint: String, cmd: Vec<String>) -> MountedBinaryResult; 
}



fn format_result(res: MountedBinaryResult) -> crate::types::Result {

    let stdout = String::from_utf8(res.stdout).unwrap();
    let stderr = String::from_utf8(res.stderr).unwrap();

    crate::types::Result {
        stdout: stderr,
        stderr: stdout,
    }
}


pub fn create_from_model(index: &crate::types::ComposeDbIndex, composedb_url: &String, ceramic_url: &String) -> crate::types::Result {

    let endpoint = format!("{}/bin", composedb_url);

    let cmd = vec![
        "composite:from-model".to_owned(),
        index.model.to_owned(),
        "--ceramic-url".to_owned(),
        ceramic_url.to_owned(),
        "--output".to_owned(),
        crate::files::composite_path(&index.composite)
    ];

    format_result(cdb_request(endpoint,cmd))
}

pub fn create_from_schema(index: &crate::types::ComposeDbIndex, composedb_url: &String, ceramic_url: &String) -> crate::types::Result {

    let endpoint = format!("{}/bin", composedb_url);

    let cmd = vec![
        "composite:create".to_owned(),
        crate::files::schema_path(&index.composite),
        "--ceramic-url".to_owned(),
        ceramic_url.to_owned(),
        "--did-private-key".to_owned(),
        "KEY".to_owned(),
        "--output".to_owned(),
        crate::files::composite_path(&index.composite)
    ];

    format_result(cdb_request(endpoint,cmd))
}

pub fn deploy(index: &crate::types::ComposeDbIndex, composedb_url: &String, ceramic_url: &String) -> crate::types::Result {

    let endpoint = format!("{}/bin", composedb_url);

    let cmd = vec![
        "composite:deploy".to_owned(),
        crate::files::composite_path(&index.composite),
        "--ceramic-url".to_owned(),
        ceramic_url.to_owned(),
        "--did-private-key".to_owned(),
        "KEY".to_owned()
    ];

    format_result(cdb_request(endpoint,cmd)) 
}

pub fn compile(index: &crate::types::ComposeDbIndex, composedb_url: &String, ceramic_url: &String) -> crate::types::Result {

    let endpoint = format!("{}/bin", composedb_url);

    let cmd = vec![
        "composite:compile".to_owned(),
        crate::files::composite_path(&index.composite),
        crate::files::runtime_path(&index.composite).to_owned(),
        "--ceramic-url".to_owned(),
        ceramic_url.to_owned(),
        "--did-private-key".to_owned(),
        "KEY".to_owned()
    ];

    let res = format_result(cdb_request(endpoint,cmd));

    res
}