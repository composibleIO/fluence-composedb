#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { compositeCompile,compositeDefinition  } from './commands/composite.js';
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
    'compile',
    'compile composite to runtime ...',
     (yargs) => {
      return yargs
      .option('c', {
        alias: 'ceramicUrl',
        type: 'string',
        describe: 'the URL for ceramic node'
      })
      .option('n', {
        alias: 'compositeName',
        type: 'string',
        describe: 'the name of the composite to be used in filenames'
      })
    },
    async (argv) => { 
        let res = await compositeCompile(String(argv.ceramicUrl), String(argv.compositeName)) 
        console.log(res);
    }
  )
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
        describe: 'serialized string of graphql schema'
      })
      .option('k', {
        alias: 'key',
        type: 'string',
        describe: 'sprivate key to operate index'
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
        describe: 'serialized version of runtime definition'
      })
      .option('q', {
        alias: 'query',
        type: 'string',
        describe: 'serialized version of graphql query'
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
          
          res.content = await graphqlQuery(String(argv.ceramicUrl),String(argv.definition),String(argv.query));
          res.success = true;
        }
        catch(err: any) {
          console.log("error");
          res.error = JSON.stringify(err)
        }
        
        console.log(JSON.stringify(res));
    }
  )
  .command(
    'mutate',
    'Alternative ComposeDB client',
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
        describe: 'serialized version of grpahql definition'
      })
      .option('q', {
        alias: 'query',
        type: 'string',
        describe: 'serialized version of graphql query'
      })
      .option('s', {
        alias: 'session',
        type: 'string',
        describe: 'serialized did session'
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
            
            res.content = await graphqlMutate(String(argv.ceramicUrl),String(argv.session),String(argv.name),String(argv.definition));

            // check if content actually contains a usefull response 
            // for example an incorrect query seems to pass here 
            res.success = true;
          }
          catch(err: any) {
            console.log("error");
            res.error = JSON.stringify(err)
          }
          
          console.log(JSON.stringify(res));
    }
  )
  .command(
    'resources',
    'fetch array of resources indexed by client',
     (yargs) => {
      return yargs.option('c', {
        alias: 'ceramicUrl',
        type: 'string',
        describe: 'the URL for ceramic node'
      })
    },
    async (argv) => { 
        let res = await resources(String(argv.ceramicUrl)) 
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