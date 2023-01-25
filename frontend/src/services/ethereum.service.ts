import { ethers } from 'ethers';
import { IMainController } from '../controllers/main.controller';
import { bufferToHex }  from 'ethereumjs-util';
import { encrypt, recoverPersonalSignature } from '@metamask/eth-sig-util';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'

const domain = window.location.host;
const origin = window.location.origin;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const jsonRpc = new ethers.providers.JsonRpcProvider(window.ethereum);
const signer = provider.getSigner();

export interface IEthereumService {

    chain: string,
    walletAddress: string,
    connectWallet: () => Promise<string>,
    sign: (msg: string) => Promise<string>
    getEncryptionPublicKey: (address: string) => Promise<string>,
    encrypt: (string: string, receiverAddress: string) => Promise<string>
    decrypt: (string: string, receiverAddress: string) => Promise<string>
    getWebAuth: () => Promise<any>
}

export class EthereumService implements IEthereumService {

    walletAddress: string;
    _chain = 'ethereum';

    constructor(public main: IMainController) {

        this.init();
    }

    init() {

        window.ethereum.on('accountsChanged', (accounts: string[]) => {
            console.log("accountsChanged")
            this.walletAddress = ethers.utils.getAddress(accounts[0]);
            setTimeout( () => {
                this.main.ethAddressSwitch();
            },100);
        });

        // this.connectWallet();
    }

    get chain() {

        return this._chain;
    }

    async connectWallet() : Promise<string> {


        // alert for no metamask ....

        await provider.send('eth_requestAccounts', [])
            .catch(() => alert('user rejected request'));

        this.walletAddress  = ethers.utils.getAddress(await signer.getAddress());

        return this.walletAddress;
    }

    async sign(msg: string) : Promise<string> {

        const from = this.walletAddress;
        const params = [msg, from];
        const method = 'personal_sign';

        return await window.ethereum.request({
            method,
            params
        });
    }

    async encrypt(content: string, encryptionPublicKey: string): Promise<string> {

        const encryptedMessage = bufferToHex(
            Buffer.from(
                JSON.stringify(
                    encrypt({
                        publicKey: encryptionPublicKey,
                        data: content,
                        version: 'x25519-xsalsa20-poly1305',
                    })
                )
                ,'utf8'
            )
          );

        return encryptedMessage;
    }


    async decrypt(encrypted_content: string, receiverAddress: string) : Promise<string>  {
        
        return await provider.send("eth_decrypt", [encrypted_content, receiverAddress]);
    };
      
    async getEncryptionPublicKey(address: string) : Promise<string> {

        return new Promise((resolve,reject) => {

            provider
                .send('eth_getEncryptionPublicKey',[address])
                .then((result: string) => {
                    alert("please approve so that brave wallet does not crash");
                    resolve(result);
                })
                .catch((error: any) => {
                    if (error.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                        console.log("We can't encrypt anything without the key.");
                    } else {
                        console.error(error);
                    }

                    resolve(error.code.toString());
                });
        })
    }

    async getWebAuth() {

        // provider differs from ethers provider used above .... 
        const ethProvider = window.ethereum;
        const addresses = await ethProvider.enable();
        const accountId = await getAccountId(ethProvider, addresses[0]);
        return await EthereumWebAuth.getAuthMethod(ethProvider, accountId);
    }
}

