
// export interface Service {
//     id: string,
//     blueprint_id: string,
//     owner_id: string,
//     peer_id?: string
// }


export interface CdbPublicInfo {
    eth_address: string,
    public_encryption_key: string,
}

export interface CdbIndex {
    composite: string,
    model: string,
    name: string,
    port: string
}

export interface CdbConnection extends CdbIndex {
    user: string
    pid: number
    timestamp: number
}

export interface CdbDirections {

    ceramic_port: string,
    express_port: string,
    n: string,
    namespace: string
}

export interface CdbServerConfig {
    directions: CdbDirections,
    indexes: string[],
    public_info: CdbPublicInfo[]
}

export interface ContractorDetails {
    composedb: CdbServerConfig
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

// export interface SecretKey {
//     encrypted_key: string,
//     recipient: string,
// }

// export interface Intermediary {
//     aud: string,
//     did: string,
//     iss: string,
//     keys: SecretKey[]
// }

// export interface Capability extends Intermediary {
//     with: string,
//     do: string[],
//     expires: number,
//     signature?: string
// }
