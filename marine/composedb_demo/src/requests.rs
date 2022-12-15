use marine_rs_sdk::marine;
use marine_rs_sdk::MountedBinaryResult;

#[marine]
#[link(wasm_import_module = "composedb_adapter")]
extern "C" {
    pub fn cdb_request(cmd: Vec<String>) -> MountedBinaryResult; 
}

// #[marine]
// #[link(wasm_import_module = "composedb_server")]
// extern "C" {
//     pub fn cdb_server(cmd: Vec<String>) -> MountedBinaryResult;
// }

#[marine]
#[link(wasm_import_module = "curl_adapter")]
extern "C" {
    pub fn curl_request(url: Vec<String>) -> MountedBinaryResult;
}

fn format_result(res: MountedBinaryResult) -> crate::types::Result {

    let stdout = String::from_utf8(res.stdout).unwrap();
    let stderr = String::from_utf8(res.stderr).unwrap();

    crate::types::Result {
        stdout: stderr,
        stderr: stdout,
    }
}

fn format_connection(res: MountedBinaryResult) -> crate::types::Connection {

    let stdout = String::from_utf8(res.stdout).unwrap();
    let stderr = String::from_utf8(res.stderr).unwrap();

    let v: serde_json::Value = serde_json::from_str(&stdout).unwrap();

    let mut aud = v["aud"].to_string();
    aud = aud.replace("\"","");

    let mut port = v["port"].to_string();
    port = port.replace("\"","");

    let mut pid = v["pid"].to_string();
    pid = pid.replace("\"","");

    crate::types::Connection {
        aud,
        pid,
        port
    }
}

pub fn newDid(ceramic_url: String) -> crate::types::Result {
   
    let cmd = vec![
        "did:generate-private-key".to_owned()
    ];

    format_result(cdb_request(cmd))
}

pub fn didFromPrivateKey(key: String, ceramic_url: String) -> crate::types::Result {
   
    let cmd = vec![
        "did:from-private-key".to_owned(),
        "--did-private-key".to_owned(),
        key,
        "--ceramic-url".to_owned(),
        ceramic_url
    ];

    format_result(cdb_request(cmd))
}


pub fn models() -> crate::types::Result {
   
    let cmd = vec![
        "model:list".to_owned()
    ];

    format_result(cdb_request(cmd))
}

pub fn model(composite_name: String, key: String, url: String) -> crate::types::Result {

    let cmd = vec![
        "composite:from-model".to_owned(),
        key,
        "--ceramic-url".to_owned(),
        url,
        "--output".to_owned(),
        crate::files::composite_path(composite_name)
    ];

    format_result(cdb_request(cmd))
}

pub fn create_from_schema(composite_name: String, pk: String, url: String) -> crate::types::Result {


    let cmd = vec![
        "composite:create".to_owned(),
        crate::files::schema_path(composite_name.clone()),
        "--ceramic-url".to_owned(),
        url,
        "--did-private-key".to_owned(),
        pk,
        "--output".to_owned(),
        crate::files::composite_path(composite_name)
    ];

    format_result(cdb_request(cmd))
}

pub fn deploy(composite_name: String, pk: String, url: String) -> crate::types::Result {


    let cmd = vec![
        "composite:deploy".to_owned(),
        crate::files::composite_path(composite_name),
        "--ceramic-url".to_owned(),
        url,
        "--did-private-key".to_owned(),
        pk
        
    ];

    format_result(cdb_request(cmd)) 
}

pub fn compile(composite_name: String, pk: String, url: String) -> crate::types::Result {

    let cmd = vec![
        "composite:compile".to_owned(),
        crate::files::composite_path(composite_name.clone()),
        crate::files::runtime_path(composite_name).to_owned(),
        "--ceramic-url".to_owned(),
        url,
        "--did-private-key".to_owned(),
        pk
    ];

    let res = format_result(cdb_request(cmd));

    res
}

pub fn serve(composite_name: String, server_config: crate::types::ComposeDbConfig) -> crate::types::Connection {

    let mut data: String = "{\"port\":\"$PORT\",\"composite_name\":\"$CN\"}".to_owned();
    data = data.replace("$PORT", &server_config.readonly_port);
    data = data.replace("$CN", &composite_name);

    let endpoint = format!("{}:{}/readonly", server_config.composedb_sidecar, server_config.express_port);

    let args = vec![
        "-s".to_owned(),
        "-X".to_owned(),
        "POST".to_owned(),
        "-H".to_owned(),
        "Content-Type: application/json".to_owned(),
        "--data".to_owned(),
        data,
        endpoint.to_owned()
    ];

    format_connection(curl_request(args))
}


pub fn connect(cap: String, server_config: crate::types::ComposeDbConfig) -> crate::types::Connection {

    let endpoint = format!("{}:{}/connect", server_config.composedb_sidecar, "3000");

    let args = vec![
        "-s".to_owned(),
        "-X".to_owned(),
        "POST".to_owned(),
        "-H".to_owned(),
        "Content-Type: application/json".to_owned(),
        "--data".to_owned(),
        cap,
        endpoint.to_owned()
    ];

    format_connection(curl_request(args))
}

pub fn mutate(request: String, cap: String, connection: crate::types::Connection, server_config: crate::types::ComposeDbConfig ) -> crate::types::Result{

    let mut results : Vec<crate::types::Result> = vec!();

    // do smthng with a webtoken and cap object ??? 

    let endpoint = format!("{}:{}/graphql", server_config.composedb_sidecar, connection.port);

    let args = vec![
        "-s".to_owned(),
        "-X".to_owned(),
        "POST".to_owned(),
        "-H".to_owned(),
        "Content-Type: application/json".to_owned(),
        "--data".to_owned(),
        request,
        endpoint.to_owned()
    ];
    
    format_result(curl_request(args))
}

pub fn query(request: String, endpoint: String) -> crate::types::Result {

    let args = vec![
        String::from("-s"),
        String::from("-X"),
        String::from("POST"),
        String::from("-H"),
        String::from("Content-Type: application/json"),
        String::from("--data"),
        request,
        endpoint,
    ];
    
    format_result(curl_request(args))
}

pub fn kill(pid: String) -> crate::types::Result {

    let endpoint = "http://composedb-server:3000/kill";

    let data = "{\"pid\":\"$PK\"}";
    let d = &data.replace("$PK", &pid);

    let args = vec![
        String::from("-s"),
        String::from("-X"),
        String::from("POST"),
        String::from("-H"),
        String::from("Content-Type: application/json"),
        String::from("--data"),
        d.to_owned(),
        endpoint.to_owned()
    ];
    
    format_result(curl_request(args))
}