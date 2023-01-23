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

    // potentially do other stuff to create/augment config 
    let express_port : &str = "3000";
    let ceramic_port : &str = "7007";

    let ceramic_url: String;

    if namespace == "localhost" {
        ceramic_url = String::from("http://0.0.0.0:7007")
    } else {
        ceramic_url = format!("http://{}{}_ceramic:{}", namespace, n, ceramic_port);
    }

    let mut indexes: Vec<ComposeDbIndex> = vec![];

    for cid in _indexes.split(" ") {
        let index: ComposeDbIndex = serde_json::from_str(&ipfs::dag_get(&cid.to_owned()).unwrap()).unwrap();
        indexes.push(index.clone());

        let args = vec![
            "index".to_owned(),
            "-c".to_owned(),
            ceramic_url.to_owned(),
            "-d".to_owned(),
            index.composite_definition.to_owned(),
            "-k".to_owned(),
            pk.to_owned() 
        ];

        tu_cdb_request(args);
    }

 
  
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