
// export interface Service {
//     id: string,
//     blueprint_id: string,
//     owner_id: string,
//     peer_id?: string
// }


export interface CdbServerConfig {

    ceramic_sidecar: String
    composedb_sidecar: String
    express_port: String
    ceramic_port: String
    readonly_port: String
}

export interface Middleware {
    [key: string] : CdbServerConfig
}

export interface ContractorDetails {
    eth_address: string,
    public_encryption_key: string,
    middleware: Middleware
}

interface ContractorMetadata {
    issued_by: string,
    issuer_signature: any,
    key_id: string,
    peer_id: string,
    relay_id: string[],
    service_id: string[],
    solution: any[],
    timestamp_issued: number,
    value: string
}

export interface Contractor {
    signature: any,
    timestamp_created: number,
    metadata: ContractorMetadata,
    details: ContractorDetails
}

export interface CeramicResult {
    stderr: string,
    stdout: string,
}


// export interface WalletKeyRelation {
//     walletAddress: string,
//     didKey: string
// }

export interface Secrets {
    [key: string] : any
}

export interface Capability {
    iss: string,
    aud: string,
    with: string,
    do: string[],
    keys: Secrets
}

export interface ComposeDBConnection {

    aud: string, // full cap ? 
    pid: string,
    port: string
}