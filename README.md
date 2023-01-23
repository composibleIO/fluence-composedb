
# Fluence+ComposeDB

The Transport Union explores distributed backend applications that are governed by collective decision making, seeking innovations by combining functionalities of various decentralized protocols. 

This is a proof of concept demo to show:

1. decentralized access to ComposeDB resource providers,
2. authentication with DID-session,


## Fluence

[Fluence](https://fluence.dev/docs/learn/overview) is an open, permisisonless peer-to-peer compute protocol facilitating decentralized serverless compute such as FaaS. Fluence provides [Aqua](https://fluence.dev/docs/aqua-book/introduction), an open-source, peer-to-peer Web3-native choreography and composition language to create distributed workflows, similar to [AWS Stepfunctions](https://aws.amazon.com/step-functions/). Moreover, Aqua can be used to program the network and easily integrate with peers' [sidecars](https://learn.microsoft.com/en-us/azure/architecture/patterns/sidecar). That is, Fluence peers can operate or pair with nodes from other protocols, such as IPFS, Ethereum or Ceramic, and developers can than use Aqua, in conjunction with distributed, FaaS connectors, to create seamless, Web3-native integration across protocols and networks. Hence, the Fluence protocol allows developers to deploy dApps to *decentralized serverless* as opposed to, say, the browser.

## ComposeDB

[ComposeDB](https://composedb.js.org/) is a decentralised database build on top of Ceramic/IPFS with a graphql interface. Normally, dApps have their own ComposeDB instance running on a server with a single endpoint. 

## Approach

This branch contains an alternative command line interface for ComposeDB tailored to work with Fluence services. I have used the default frontend libraries made by the Composedb team. 


[DEMO HERE!](https://fluence-composedb.transport-union.dev/)


## globals

    nvm use 16
    npm -g i @fluencelabs/aqua@0.7.7-363 @fluencelabs/registry@0.7.0 @fluencelabs/trust-graph@3.0.4 
    npm -g i typescript@4.9.3

## install 

    docker-compose -f docker/docker-compose.yaml up -d 


## deploy the marine service 

    1/ sh scripts/dev/build.sh
    2/ sh scripts/dev/deploy.sh
    3/ copy returned service_id into scripts/.env file
    4/ sh scripts/dev/init.sh


## serve frontend on localhost:3000

    cd frontend/ 
    npm i
    npm run serve

## changes to aqua 

    cd frontend
    npm run compile-aqua
    
    
