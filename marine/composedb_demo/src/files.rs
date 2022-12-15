

pub fn composite_path(composite_name: String) -> String{

    let mut file : String = "/opt/composites/$NAME.json".to_owned();
    file.replace("$NAME", &composite_name)
}

pub fn runtime_path(composite_name: String) -> String{

    let mut file : String = "/opt/composites/$NAME--runtime.json".to_owned();
    file.replace("$NAME", &composite_name)
}

pub fn schema_path(composite_name: String) -> String{

    let mut file : String = "/opt/composites/$NAME.graphql".to_owned();
    file.replace("$NAME", &composite_name)
}