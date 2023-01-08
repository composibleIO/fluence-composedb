export interface IComposeDbService {

    cli(cmd: string, args: string[]) : Promise<string>
}

export class ComposeDbService implements IComposeDbService {

    constructor() {}

    async cli(cmd: string, args: string[]) : Promise<string> {

        return new Promise(function(resolve, reject){ 
        
            // start child process to call binary
            const spawn = require('child-process-promise').spawn;

            // replace KEY placeholder with DIDSECRET from .env file 
            let i = args.indexOf("KEY");
            if(i > -1) {
                args[i] = process.env.DIDSECRET
            } 
    
            console.log(args);
        
            const promise = spawn(cmd, args);
            const childProcess = promise.childProcess;
        
            childProcess.stdout.on('data', function (data: any) {
                console.log('[serve] stdout: ', data.toString());
            });
        
            childProcess.stderr.on('data', function (data: any) {
                console.log('[serve] stderr: ', data.toString());
                resolve(data.toString())
            });
        })
    }
}