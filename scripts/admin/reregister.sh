ENV="./scripts/.env$1"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua run \
    --addr $RELAY \
    --input ./aqua/composedb.aqua \
    --func 'cdbReregister(peer_id, service_id, cid)' \
    --data '{ "peer_id":"'$NODE'","service_id":"'$SERVICE_ID'","cid":"'$CID'"}' \
    --timeout 30000