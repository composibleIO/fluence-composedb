// use crate::types::ComposeDbIndex;
use crate::types::ComposeDbDirections;
use crate::types::ComposeDbConfig;
use crate::types::ContractorDetails;
use crate::types::ComposeDbIndex;
use crate::ipfs;
use crate::composedb::tu_cdb_request;



pub fn init(namespace: &String, n: &String, _indexes: String, pk: &String) -> String {

    // this could be a separate service 
    // result should be a cid representing object for index with contractor details

    // hardware owner advertises option for index operators to add indexes ... 

    let express_port : &str = "3000";
    let ceramic_port : &str = "7007";

    let ceramic_url: String;

    if namespace == "localhost" {
        ceramic_url = String::from("http://0.0.0.0:7007")
    } else {
        ceramic_url = format!("http://{}{}_ceramic:{}", namespace, n, ceramic_port);
    }
 
    // optionally include things likewallet address, public encryption key 
    let public_info = vec![]; 

   // store on ipfs .. cid is included in fluence record 
    let directions = ComposeDbDirections {
        namespace: namespace.to_owned(),
        n: n.to_owned(),
        express_port: express_port.to_owned(),
        ceramic_port: ceramic_port.to_owned()
    };

    let composedb = ComposeDBHardwareConfig {
        directions,
        public_info
    };

    let obj = ContractorDetails {
        composedb: composedb
    };

    let r = ipfs::dag_put(serde_json::to_value(obj).unwrap());

    r.unwrap()
}