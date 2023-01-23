#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { compositeDefinition, createFromSchema  } from './commands/composite.js';
import { graphqlMutate, graphqlQuery } from './commands/graphql.js';
import { resources, startIndex } from './commands/index.js';

interface Result {
  content: string,
  count: number,
  success: boolean,
  error: string
}


yargs(hideBin(process.argv))
  // Use the commands directory to scaffold.
  .command(
    'index',
    'tell node to index a composite',
     (yargs) => {
      return yargs
      .option('c', {
        alias: 'ceramicUrl',
        type: 'string',
        describe: 'the URL for ceramic node'
      })
      .option('d', {
        alias: 'definition',
        type: 'string',
        describe: 'composite definition serialized in base64'
      })
      .option('k', {
        alias: 'key',
        type: 'string',
        describe: 'private key to operate index'
      })
    },
    async (argv) => { 
        let res = await startIndex(String(argv.ceramicUrl), String(argv.definition),String(argv.key), ) 
        console.log(res);
    }
  )
  .command(
    'query',
    'fetch records',
     (yargs) => {
      return yargs
      .option('c', {
        alias: 'ceramicUrl',
        type: 'string',
        describe: 'add or update records'
      })
      .option('d', {
        alias: 'definition',
        type: 'string',
        describe: 'runtime definition serialized in base64'
      })
      .option('q', {
        alias: 'query',
        type: 'string',
        describe: 'graphql query serialized in base64'
      })
    },
    async (argv) => { 

      let output: any;

      let res: Result =  {
        content: "",
        count: 0,
        error: "",
        success: false,
      }

        try {
          
          output = await graphqlQuery(String(argv.ceramicUrl),String(argv.definition),String(argv.query));
          // console.log(output);
          if(output.errors && output.errors.length > 0) {
            res.error = JSON.stringify(output.errors);
            res.success = false;
          } else {
            let firstNode: any  = Object.values(output.data)[0];
            let firstEdge: any = Object.values(firstNode)[0];
            res.content = JSON.stringify(output.data);
            res.count = firstEdge.length;
            res.success = true;
          }
          
        }
        catch(err: any) {
          res.error = "cli errored"
        }
        
        process.stdout.write(JSON.stringify(res));
    }
  )
  .command(
    'mutate',
    'add or update records',
     (yargs) => {
      return yargs
      .option('c', {
        alias: 'ceramicUrl',
        demandOption : true,
        type: 'string',
        describe: 'the URL for ceramic node'
      })
      .option('d', {
        alias: 'definition',
        demandOption : true,
        type: 'string',
        describe: 'runtime definition serialized in base64'
      })
      .option('q', {
        alias: 'query',
        demandOption : true,
        type: 'string',
        describe: 'graphql query serialized in base64'
      })
      .option('s', {
        alias: 'session',
        demandOption : true,
        type: 'string',
        describe: 'did session serialized in base64'
      })
    },
    async (argv) => { 

      let res: Result =  {
        content: "",
        count: 0,
        error: "",
        success: false,
      }

      try {        
        res.content = await graphqlMutate(String(argv.ceramicUrl),String(argv.session),String(argv.query),String(argv.definition));
        res.success = true;
      }
      catch(err: any) {
        res.error = JSON.stringify(err);
      }

      process.stdout.write(JSON.stringify(res));
    }
  )
  .command(
    'resources',
    'fetch array of resources indexed by client',
     (yargs) => {
      return yargs
      .option('c', {
        alias: 'ceramicUrl',
        demandOption : true,
        type: 'string',
        describe: 'the URL for ceramic node'
      })
      .option('d', {
        alias: 'definition',
        demandOption : true,
        type: 'string',
        describe: 'runtime definition serialized in base64'
      })
    },
    async (argv) => { 
        let res = await resources(String(argv.ceramicUrl),String(argv.definition)) 
        console.log(res);
    }
  )
  .command(
    'createFromSchema',
    'creates a runtime defintion from a graphql schema',
     (yargs) => {
      return yargs
      .option('c', {
        alias: 'ceramicUrl',
        demandOption : true,
        type: 'string',
        describe: 'the URL for ceramic node'
      })
      .option('p', {
        alias: 'path',
        demandOption : true,
        type: 'string',
        describe: 'path to graphql schema'
      })
      .option('k', {
        alias: 'privateKey',
        demandOption : true,
        type: 'string',
        describe: 'private key'
      })
    },
    async (argv) => { 

        let s = argv.serialized === undefined || !argv.serialized ? false: true

        let res = await createFromSchema(String(argv.ceramicUrl),String(argv.path),String(argv.privateKey)) 
        console.log(res);
    }
  )
  .command(
    'definition',
    'fetch definition',
     (yargs) => {
      return yargs
      .option('c', {
        alias: 'ceramicUrl',
        type: 'string',
        describe: 'the URL for ceramic node'
      })
      .boolean('serialized')
    },
    async (argv) => { 

        let s = argv.serialized === undefined || !argv.serialized ? false: true

        let res = await compositeDefinition(String(argv.ceramicUrl),"tu-profile", s) 
        console.log(res);
    }
  )
  // Enable strict mode.
  .strict()
  // Useful aliases.
  .alias({ h: 'help' })
  .argv;