import * as ls from "local-storage";
import { IMainController } from "../controllers/main.controller";
import { DIDSession } from "did-session";
import { base64urlToJSON } from "../factories/serialize";
import { toChecksumAddress } from "ethereumjs-util";

export interface ISessionService {

    has: (resources:string[]) => void
    store: (session: DIDSession) => void
    new: (resources:string[]) => Promise<DIDSession>
    owner: () => string
    serialize: (resources: string[]) => Promise<string>
}

export class SessionService implements ISessionService {

    _currentSession: DIDSession = null;

    constructor(public main: IMainController) {}

    async has(resources:string[]) {     
        
        if (this._currentSession == null && ls.get('TU_Profile') != undefined) {
           
            this._currentSession = base64urlToJSON(ls.get('TU_Profile'));
            console.log(this._currentSession);
        } 
     
        if (this._currentSession == null || 
            this._currentSession == undefined || 
            !this.validate(this._currentSession,resources)
            ) {   
            
            await this.new(resources) 
        }

        this.main.ui.afterUpdateProfile(this.owner());
    }

    store(session: DIDSession) {
        ls.set('TU_Profile', session.serialize());
    }

    async new(resources: string[]) {
        console.log("new session")
        this._currentSession = await this.main.did.deriveDidPkh(resources);
        this.store(this._currentSession);
        return this._currentSession;
    }

    owner() {
        return toChecksumAddress(this._currentSession.did.parent.split(':').pop());
    }

    validate(session: DIDSession, resources: string[]) : boolean {
        return (session.hasSession && !session.isExpired  /* && session.resources == resources */ ) ? true : false;
    }

    async serialize(resources: string[]) {
        return this.validate(this._currentSession, resources) ? this._currentSession.serialize() : (await this.new(resources)).serialize()
    }
}