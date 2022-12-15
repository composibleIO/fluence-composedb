import { FluencePeer, KeyPair } from "@fluencelabs/fluence";
import { testNet } from "@fluencelabs/fluence-network-environment";
import { CeramicResult } from "../interfaces/interfaces";
import { IMainController } from "../controllers/main.controller";

import { 
    
} from '../_aqua/export';

// getResourceFromRelay, getResourceProvidersFromRelay

interface PeerObject {
    multiaddr: string,
    peerId: string
}

export interface IFluenceService {

    _localPeer: KeyPair;
    localPeer: KeyPair;
    _relayPeer: PeerObject;
    localPeerId: string;
    relayPeerId: string;
    status: any;
    connectToRandomRelayPeer: () => Promise<boolean>;
    connection: FluencePeer;
    makeKeyPair: (sk: string) => Promise<KeyPair>;
    connectToRelay: () => Promise<boolean>;
  
}

export class FluenceService implements IFluenceService {

    _localPeer: KeyPair;
    _localPeerId: string;
    _relayPeer: PeerObject;
    connection: FluencePeer;

    constructor(
        private main: IMainController
    ) {
        
        
    }

    async makeKeyPair(sk: string) : Promise<KeyPair> {
        const uint8array = new TextEncoder().encode(sk).slice(0,32);
        return await KeyPair.fromEd25519SK(uint8array);
    }

    set localPeer(keyPair: any) {
        this._localPeer = keyPair
    } 

    get localPeerId() : any {

        return this._localPeerId; //this._localPeer != undefined ? this._localPeer.toB58String() : false;
    }
    

    async connectToRandomRelayPeer() : Promise<boolean> {

        this._relayPeer = testNet[Math.floor(Math.random() * 10)];
        let succes  = await this.connectToRelay()
        return succes;
    }


    get relayPeerId() : string {
        return this._relayPeer ? this._relayPeer.peerId : "";
    }

    async connectToRelay() : Promise<boolean> {

        this.connection = new FluencePeer();
        await this.connection.start({
            // KeyPair: this._localPeer,
            connectTo: this._relayPeer
        }); 

        this._localPeerId = this.connection.getStatus().peerId;

        // console.log(this._localPeerId);

      //  this.main.exploration.addPeer({ peerId : this.relayPeerId, public: true, addresses : [], kademlia_neighbors: [], tested_connections: [] },this.localPeerId)

        return true; 
    }

    get status() {
        return this.connection ? this.connection.getStatus() : {}
    }

} 