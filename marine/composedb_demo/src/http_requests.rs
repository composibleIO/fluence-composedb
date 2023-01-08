use marine_rs_sdk::marine;
use marine_rs_sdk::MountedBinaryResult;

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

    let mut composite = v["composite"].to_string();
    composite = composite.replace("\"","");

    let mut model = v["model"].to_string();
    model = model.replace("\"","");

    let mut name = v["name"].to_string();
    name = name.replace("\"","");

    let mut user = v["user"].to_string();
    user = user.replace("\"","");

    let mut port = v["port"].to_string();
    port = port.replace("\"","");

    let mut pid = v["pid"].as_u64().unwrap();
    // pid = pid.replace("\"","");

    let mut timestamp = v["timestamp"].as_u64().unwrap();
    // timestamp = timestamp.replace("\"","");

    crate::types::Connection {

        composite,
        model,
        name,
        pid,
        port,
        timestamp,
        user,
    }
}

fn format_public_info(res: MountedBinaryResult) -> crate::types::ComposeDbPublicInfo {

    let stdout = String::from_utf8(res.stdout).unwrap();
    let stderr = String::from_utf8(res.stderr).unwrap();

    let v: serde_json::Value = serde_json::from_str(&stdout).unwrap();

    crate::types::ComposeDbPublicInfo {
        eth_address: v["eth_address"].to_string().replace("\"",""),
        public_encryption_key: v["public_encryption_key"].to_string().replace("\"",""),
    }
}

pub fn init(namespace: &String, n: &String, express_port: &String) -> crate::types::ComposeDbPublicInfo {

    let endpoint = format!("http://{}{}_composedb:{}/init", namespace, n, express_port);

    let args = vec![
        "-s".to_owned(),
        "-X".to_owned(),
        "POST".to_owned(),
        "-H".to_owned(),
        "Content-Type: application/json".to_owned(),
        "--data".to_owned(),
        "{}".to_owned(),
        endpoint.to_owned()
    ];

    format_public_info(crate::curl::curl_request(args))
}

pub fn serve(index: crate::types::ComposeDbIndex, composedb_url: String) -> crate::types::Connection {

    let mut data: String = "{\"port\":\"$PORT\",\"composite_name\":\"$CN\"}".to_owned();
    data = data.replace("$PORT", &index.port); 
    data = data.replace("$CN", &index.composite);

    let endpoint = format!("{}/connect", composedb_url);

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

    format_connection(crate::curl::curl_request(args))
}

// use this one for both 
pub fn connect(index: crate::types::ComposeDbIndex, cap: String, composedb_url: String) -> crate::types::Connection {

    let endpoint = format!("{}/connect", composedb_url);

    let i = serde_json::to_string(&index).unwrap();

    let data = format!("{{ \"index\": {}, \"cap\":{}}}", i, cap);

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

    format_connection(crate::curl::curl_request(args))
}

pub fn mutate(request: String, query_url: String ) -> crate::types::Result{

    let args = vec![
        "-s".to_owned(),
        "-X".to_owned(),
        "POST".to_owned(),
        "-H".to_owned(),
        "Content-Type: application/json".to_owned(),
        "--data".to_owned(),
        request,
        query_url
    ];
    
    format_result(crate::curl::curl_request(args))
}

pub fn query(request: String,  query_url: String) -> crate::types::Result {

    let args = vec![
        String::from("-s"),
        String::from("-X"),
        String::from("POST"),
        String::from("-H"),
        String::from("Content-Type: application/json"),
        String::from("--data"),
        request,
        query_url,
    ];
    
    format_result(crate::curl::curl_request(args))
}
