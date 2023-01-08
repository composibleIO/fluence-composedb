export interface ILinuxService {

    kill(pid: string) : void
}

export class LinuxService implements ILinuxService {

    constructor() {}

    // to kill a process / connection from outside. Not used ... 
    // perhaps check connections that hev niot been used for x hours ... 
    kill(pid: string) {

        const spawn = require('child-process-promise').spawn;
        const promise = spawn('kill', [pid]);
        const childProcess = promise.childProcess;

        childProcess.stdout.on('data', function (data: any) {
            console.log('[kill] stdout: ', data.toString());
        });
        childProcess.stderr.on('data', function (data: any) {
            console.log('[kill] stderr: ', data.toString());
        });

        promise.then(function () {
            console.log('[kill] done!');
        })
        .catch(function (err: any) {
            console.error('[kill] ERROR: ', err);
        });
    }
}