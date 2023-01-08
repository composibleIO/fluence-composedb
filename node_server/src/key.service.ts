import { Capability, SecretKey } from "./interface";
import { decrypt, recoverPersonalSignature } from '@metamask/eth-sig-util';
import { toBuffer, toChecksumAddress }  from 'ethereumjs-util';

import * as dotenv from 'dotenv'
dotenv.config()


export interface IKeyService  {

    decrypt(cap: Capability) : string
    validate(cap: Capability) : boolean
}

export class KeyService implements IKeyService {

    constructor() {}

    decrypt(cap: Capability) : string {

        const encryptedData = JSON.parse(
          new TextDecoder().decode(
            toBuffer(
              cap.keys.find( (k: SecretKey) => k.recipient == process.env.PROVIDER_ADDRESS).encrypted_key
            )
          )
        );
  
        return decrypt({
          encryptedData,
          privateKey: process.env.PROVIDER_KEY
        });
    }

    validate(cap: Capability): boolean {

      if (cap === null) {
        return true;
      }

      let data = JSON.stringify({
        aud: cap.aud,
        did: cap.did,
        iss: cap.iss,
        with: cap.with,
        do: cap.do,
        expires: cap.expires,
        keys: cap.keys
      });
  
      const recovered: any = recoverPersonalSignature({
          data,
          signature: cap.signature
      });
    
      return (toChecksumAddress(recovered) === toChecksumAddress(cap.iss)) ? true : false
      
    }
}