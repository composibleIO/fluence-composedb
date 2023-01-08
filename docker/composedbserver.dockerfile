FROM node:15-alpine

WORKDIR /opt
RUN mkdir composites

WORKDIR /opt/composedb-server
COPY composedb-server/package.json ./
RUN npm i 
RUN npm -g add @composedb/cli@0.3.1 nodemon
COPY composedb-server/* ./

CMD ["nodemon","index.js"]
