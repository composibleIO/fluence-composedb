import { IMainController } from "../controllers/main.controller";
import LitJsSdk from 'lit-js-sdk'

export interface ILitService {

    init: () => void
    decrypt: (encryptedString: string, encryptedSymmetricKey: string) => Promise<string>
    encrypt: (message: string) => Promise<{ encryptedString: any; encryptedSymmetricKey: any; }>
    
}

export class LitService {

    client: any

    constructor(
        public main : IMainController
    ) { }

    async init() {
        this.client = new LitJsSdk.LitNodeClient()
        await this.client.connect()
    }

    async decrypt(encryptedString: string, encryptedSymmetricKey: string) {

        if(this.client == undefined) {
            await this.init();
        }

        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'ethereum' });

        const symmetricKey = await this.client.getEncryptionKey({
            accessControlConditions : this.accessControlDefinition(),
            toDecrypt: encryptedSymmetricKey,
            chain: "ethereum",
            authSig,
          });

        const decryptedString = await LitJsSdk.decryptString(
        encryptedString,
        symmetricKey
        );

        return decryptedString 
    }


    async encrypt(message: string ) {

        if(this.client == undefined) {
            await this.init();
        }

        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'ethereum' })

        const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(message)

        const encryptedSymmetricKey = await this.client.saveEncryptionKey({
            accessControlConditions : this.accessControlDefinition(),
            symmetricKey,
            authSig,
            chain : "ethereum"
        });

        return {
            encryptedString, // = blob
            encryptedSymmetricKey : LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
        }

    }

    accessControlDefinition() {

        return [
            {
              contractAddress: '',
              standardContractType: '',
              chain: 'ethereum',
              method: '',
              parameters: [
                ':userAddress',
              ],
              returnValueTest: {
                comparator: '=',
                value: this.main.eth.walletAddress
              }
            }
          ]
    }

    resourceId() {

        return {
            baseUrl: 'localhost:3000',
            path: '',
            orgId: "",
            role: "fluence_operator",
            extraData: this.main.eth.walletAddress
        }
    }
}