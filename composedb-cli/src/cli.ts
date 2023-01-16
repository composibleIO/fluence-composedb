#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { compositeCompile,compositeDefinition,compositeDeploy } from './commands/composite.js';
import { graphqlMutate, graphqlQuery } from './commands/graphql.js';
import { resources } from './commands/index.js';


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
    'deploy',
    'tell node to index a composite',
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
        let res = await compositeDeploy(String(argv.ceramicUrl), String(argv.compositeName)) 
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
        describe: 'serialized version of grpahql definition'
      })
    },
    async (argv) => { 
        let res = await graphqlQuery(String(argv.ceramicUrl),String(argv.definition)) 
        console.log(res);
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
      .option('n', {
        alias: 'name',
        type: 'string',
        describe: 'name'
      })
      .option('s', {
        alias: 'session',
        type: 'string',
        describe: 'serialized did session'
      })
      .option('d', {
        alias: 'definition',
        type: 'string',
        describe: 'serialized version of grpahql definition'
      })
    },
    async (argv) => { 
        let res = await graphqlMutate(String(argv.ceramicUrl),String(argv.session),String(argv.name),String(argv.definition));
        console.log(res);
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