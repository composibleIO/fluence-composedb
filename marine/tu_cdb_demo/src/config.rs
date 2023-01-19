// use crate::types::ComposeDbIndex;
use crate::types::ComposeDbDirections;
use crate::types::ComposeDbConfig;
use crate::types::ContractorDetails;
use crate::ipfs;


pub fn init(namespace: &String, n: &String, _indexes: String) -> String {

    let mut indexes: Vec<String> = vec![];

    for i in _indexes.split(" ") {
        indexes.push(i.to_string());
    }

    // potentially do other stuff to create/augment config 
    let express_port : &str = "3000";
    let ceramic_port : &str = "7007";
  
   // call composedb to get public info  & init readonly server
    let public_info = vec![]; // http_requests::init(namespace, n, &express_port.to_string());

   // store on ipfs .. cid is included in fluence record 
    let directions = ComposeDbDirections {
        namespace: namespace.to_owned(),
        n: n.to_owned(),
        express_port: express_port.to_owned(),
        ceramic_port: ceramic_port.to_owned()
    };

    let composedb = ComposeDbConfig {
        directions,
        indexes,
        public_info
    };

    let obj = ContractorDetails {
        composedb: composedb
    };

    let r = ipfs::dag_put(serde_json::to_value(obj).unwrap());

    r.unwrap()
}