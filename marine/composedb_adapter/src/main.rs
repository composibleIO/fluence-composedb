/*
 * Copyright 2021 Fluence Labs Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

use marine_rs_sdk::{marine, module_manifest, WasmLoggerBuilder, MountedBinaryResult};


module_manifest!();

// mounted_binaries are available to import like this:
#[marine]
#[link(wasm_import_module = "curl_adapter")]
extern "C" {
    pub fn curl_request(args: Vec<String>) -> MountedBinaryResult;
}

pub fn main() {
    WasmLoggerBuilder::new().build().ok();
}

fn create_jsondata_for_curl(cmd: Vec<String>) -> String {

    let data: String = "{\"cli\":\"composedb\",\"cmd\":[$A]}".to_owned();
    let mut s: String = "".to_owned();

    for mut c in cmd {

        c = c.replace("-",r"-");
        s.push_str("\"");
        s.push_str(&c);
        s.push_str("\"");
        s.push_str(",");
    }

    s.pop();

    data.replace("$A",&s)
}

#[marine]
pub fn cdb_request(endpoint: String, cmd: Vec<String>) -> MountedBinaryResult {     
   
    let data = create_jsondata_for_curl(cmd);

    let args = vec![
        "-s".to_owned(),
        "-X".to_owned(),
        "POST".to_owned(),
        "-H".to_owned(),
        "Content-Type: application/json".to_owned(),
        "--data".to_owned(),
        data.to_owned(),
        endpoint
    ];

    curl_request(args)
}
