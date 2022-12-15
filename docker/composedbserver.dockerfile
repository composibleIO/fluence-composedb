FROM node:15-alpine

WORKDIR /opt
RUN mkdir composites

WORKDIR /opt/composedb-server
COPY composedb-server/package.json package.json
RUN npm i 
RUN npm -g add @composedb/cli@0.3.1 nodemon

COPY composedb-server/index.js index.js

# use to start read only server ? 
#ENTRYPOINT ["composedb"]
CMD ["nodemon","index.js"]
