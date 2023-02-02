import * as ls from "local-storage";
import { IMainController } from "../controllers/main.controller";
import { DIDSession } from "did-session";
import { base64urlToJSON } from "../factories/serialize";
import { toChecksumAddress } from "ethereumjs-util";
import { IIndexService } from "./index.service";

export interface ISessionService {

    has: (index:IIndexService) => Promise<string>
    store: (index: IIndexService, session: DIDSession) => void
    new: (index:IIndexService) => Promise<DIDSession>
    owner: () => string
    serialize: (index:IIndexService) => Promise<string>
}

export class SessionService implements ISessionService {

    _currentSession: DIDSession = null;

    constructor(public main: IMainController) {}

    async has(index: IIndexService) : Promise<string> {   

        if(this._currentSession != null && this.main.eth.walletAddress != this.owner()) {
            console.log('reset session');
            this._currentSession = null;
        }

        let session_ref = index.name + '-' + this.main.eth.walletAddress;
        console.log(session_ref);
        
        if (this._currentSession == null && ls.get(session_ref) != undefined) {
           
            this._currentSession = await DIDSession.fromSession(ls.get(session_ref));
            console.log('restored session from local storage');
        } 

        if (this._currentSession == null || 
            this._currentSession == undefined || 
            !this.validate(this._currentSession,index.resources())
            ) {   
            
            await this.new(index);
            console.log("new session has been created");
            console.log(this._currentSession.did)
            console.log(this.owner());
        }

        console.log(this.main.eth.walletAddress + 'has a session for' + this.owner());

        return this.owner();

    }

    store(index: IIndexService, session: DIDSession) {
        ls.set(index.name + '-' + this.owner(), session.serialize());
    }

    async new(index: IIndexService) {
    
        this._currentSession = await this.main.did.deriveDidPkh(index.resources());
        this.store(index, this._currentSession);
        return this._currentSession;
    }

    owner() {

        if(this._currentSession && this._currentSession.did && this._currentSession.did.parent) {

            return toChecksumAddress(this._currentSession.did.parent.split(':').pop());

        } else {
            return "";
        }
    }

    validate(session: DIDSession, resources: string[]) : boolean {
        let valid = (session.hasSession && !session.isExpired  /* && session.resources == resources */ ) ? true : false;
        console.log("session is " + valid);
        return valid;
    }

    async serialize(index: IIndexService) {
        return this.validate(this._currentSession, index.resources()) ? this._currentSession.serialize() : (await this.new(index)).serialize()
    }
}