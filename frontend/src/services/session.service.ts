import * as ls from "local-storage";
import { IMainController } from "../controllers/main.controller";
import { DIDSession } from "did-session";
import { base64urlToJSON } from "../factories/serialize";


export interface ISessionService {

    get: (resources:string[]) => Promise<DIDSession>
    store: (session: DIDSession) => void
    new: (resources:string[]) => Promise<DIDSession>
    owner: () => string
    serialize: (resources: string[]) => Promise<string>
}

export class SessionService implements ISessionService {

    _currentSession: DIDSession = null;

    constructor(public main: IMainController) {}

    async get(resources:string[]): Promise<DIDSession> {     
        
        let s: DIDSession = (this._currentSession != null ) ? this._currentSession : base64urlToJSON(ls.get(this.main.eth.walletAddress));
     
       return (s == null || s == undefined || !this.validate(s,resources)) ? await this.new(resources) : s;

    }

    store(session: DIDSession) {
        // this._currentSession = session;
        ls.set(this.owner(), session.serialize());
    }

    async new(resources: string[]) {
        console.log("new?")
        this._currentSession = await this.main.did.deriveDidPkh(resources);
        console.log(this);
        this.store(this._currentSession);
        return this._currentSession;
    }

    owner() {
        return this._currentSession.did.parent.split(':').pop();
    }

    validate(session: DIDSession, resources: string[]) : boolean {

        return (session.hasSession && !session.isExpired  /* && session.resources == resources */ ) ? true : false;
    }

    async serialize(resources: string[]) {

        return this.validate(this._currentSession, resources) ? this._currentSession.serialize() : (await this.new(resources)).serialize()
    
    }

}