

FROM node:16

RUN apt-get update && apt-get install -y netcat

WORKDIR /js-ceramic

COPY ceramic-sidecar/package.json ceramic-sidecar/package-lock.json ceramic-sidecar/lerna.json ceramic-sidecar/tsconfig.json ./

RUN npm ci --ignore-scripts --production

RUN npm install -g lerna

COPY ceramic-sidecar/packages ./packages

RUN lerna bootstrap --hoist --ci -- --production

COPY ceramic-sidecar/types ./types

RUN lerna run build

WORKDIR /root/.ceramic/
COPY daemon.config-alt.json ./daemon.config.json
RUN echo "export CERAMIC_ENABLE_EXPERIMENTAL_COMPOSE_DB=true" >> .bashrc

EXPOSE 7007

WORKDIR /js-ceramic
#ENTRYPOINT ["./packages/cli/bin/ceramic.js", "daemon --network=testnet-clay --config=/root/.ceramic/daemon.config.json"]
