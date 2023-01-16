FROM node:15-alpine

WORKDIR /opt
RUN mkdir composites

WORKDIR /opt/composedb
COPY composedb/package.json ./
RUN npm i 
RUN npm -g add @composedb/cli@0.3.1 nodemon
COPY composedb/* ./

CMD ["nodemon","index.js"]
