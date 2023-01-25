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

        let session_ref = index.name + '-' + this.main.eth.walletAddress;
        
        if (this._currentSession == null && ls.get(session_ref) != undefined) {
           
            this._currentSession = await DIDSession.fromSession(ls.get(session_ref));
            // console.log(this._currentSession);
        } 
     
        if (this._currentSession == null || 
            this._currentSession == undefined || 
            !this.validate(this._currentSession,index.resources())
            ) {   
            
            await this.new(index) 
        }

        return this.owner();

    }

    store(index: IIndexService, session: DIDSession) {
        ls.set(index.name + '-' + this.owner(), session.serialize());
    }

    async new(index: IIndexService) {
        console.log("new session")
        this._currentSession = await this.main.did.deriveDidPkh(index.resources());
        this.store(index, this._currentSession);
        return this._currentSession;
    }

    owner() {
        return toChecksumAddress(this._currentSession.did.parent.split(':').pop());
    }

    validate(session: DIDSession, resources: string[]) : boolean {
        return (session.hasSession && !session.isExpired  /* && session.resources == resources */ ) ? true : false;
    }

    async serialize(index: IIndexService) {
        return this.validate(this._currentSession, index.resources()) ? this._currentSession.serialize() : (await this.new(index)).serialize()
    }
}