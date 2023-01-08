export interface PublicInfo {
    eth_address: string,
    public_encryption_key: string,
}

export interface Index {
    composite: string,
    model: string,
    name: string,
    port: string
}

export interface Connection extends Index {
    user: string
    pid: number
    timestamp: number
}

export interface SecretKey {
    encrypted_key: string,
    recipient: string,
}

export interface Capability {
    aud: string,
    did: string,
    iss: string,
    with: string,
    do: string[],
    expires: number,
    keys: SecretKey[],
    signature?: string
}



