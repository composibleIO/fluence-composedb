
#FROM fluencelabs/fluence:ipfs_update-e2e_428
FROM fluencelabs/fluence:minimal_update-e2e_428_771 
WORKDIR /
RUN apt-get update -y
RUN apt-get install -y net-tools