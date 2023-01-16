"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = void 0;
const ceramic_service_1 = require("../services/ceramic.service");
// export const command: string = 'greet <name>';
// export const desc: string = 'Greet <name> with Hello';
const builder = (yargs) => yargs
    .positional('ceramic', { type: 'string', demandOption: true });
exports.builder = builder;
const handler = (argv) => {
    const { ceramic } = argv;
    let ceramic_client = new ceramic_service_1.CeramicService(ceramic);
    process.stdout.write("ok");
    process.exit(0);
};
exports.handler = handler;
