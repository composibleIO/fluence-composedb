// export const command: string = 'greet <name>';
// export const desc: string = 'Greet <name> with Hello';
export const builder = (yargs) => yargs
    .positional('ceramic', { type: 'string', demandOption: true });
export const handler = (argv) => {
    const { ceramic } = argv;
    // let ceramic_client = new CeramicService(ceramic);
    process.stdout.write("ok");
    process.exit(0);
};
