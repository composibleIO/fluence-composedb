import { PublicInfo } from "./interface"


export interface IConfigService {

        get() : PublicInfo
}

export class ConfigService implements IConfigService {

    constructor() {}


    // get props from .env to help fluence service to build the contractor details object 
    // key is used by frontend app to encrypt intermediary's did secret. Keyservice can decyrpt with privat ekey from e.nv file
    get() : PublicInfo {

        const d =  {
            eth_address: process.env.PROVIDER_ADDRESS,
            public_encryption_key: process.env.PROVIDER_ENCRYPTION_KEY,
        }

        return d;
    }


}

