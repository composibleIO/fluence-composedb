import { ethers } from 'ethers';
import { IMainController } from '../controllers/main.controller';
import { bufferToHex }  from 'ethereumjs-util';
import { encrypt } from '@metamask/eth-sig-util';


const domain = window.location.host;
const origin = window.location.origin;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const jsonRpc = new ethers.providers.JsonRpcProvider(window.ethereum);
const signer = provider.getSigner();

const contactAddress = "0xa8b51F331635E3772B7711E0bA68C3B9c4CF2EFC";

export interface IEthereumService {

    chain: string,
    walletAddress: string,
    connectWallet: () => Promise<string>,
    // signInWithEthereum: () => void,
    getEncryptionPublicKey: (address: string) => Promise<string>,
    encrypt: (string: string, receiverAddress: string) => Promise<string>
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
            },250);
        });
    }

    get chain() {

        return this._chain;
    }

    async connectWallet() : Promise<string> {

        await provider.send('eth_requestAccounts', [])
            .catch(() => console.log('user rejected request'));

        this.walletAddress  = ethers.utils.getAddress(await signer.getAddress());

        return this.walletAddress;
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
}