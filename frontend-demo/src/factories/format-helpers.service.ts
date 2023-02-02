


export function shortenPeerId(id:string) : string {
    return ".." + id.substr(id.length - 12)
}

export function shortenEthAddress(id:string) : string {
    return ".." + id.substr(id.length - 16)
}

export function shortenDid(id:string) : string {
    return ".." + id.substr(id.length - 16)
}
