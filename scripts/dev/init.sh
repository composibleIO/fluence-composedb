ENV="./scripts/.env$1"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

## can i use aqua to get external address? 

# CID=$(aqua run \
#     --addr $RELAY \
#     --input ./aqua/ipfs.aqua \
#     --func 'extIpfsAddress(peer_id)' \
#     --data '{ "peer_id":"'$NODE'"}')

# IFS='/'
# read -a strarr <<< "${CID}"

# ## can i loop through folder? 
# IPFSOUTPUT=$(curl -X POST -F file=@indexes/index-tu-profile.json "http://${strarr[2]}:${strarr[4]}/api/v0/dag/put?pin=true")

aqua run \
    --addr $RELAY \
    --input ./aqua/composedb.aqua \
    --func 'cdbInit(resource_id, peer_id, service_id, namespace, n, indexes, pk)' \
    --data '{ "resource_id":"'$RESOURCE_ID'","peer_id":"'$NODE'","service_id":"'$SERVICE_ID'","namespace":"'$NAMESPACE'","n":"'$N'","indexes":"'$INDEXES'","pk":"'$DIDKEY'"}' \
    --timeout 120000

