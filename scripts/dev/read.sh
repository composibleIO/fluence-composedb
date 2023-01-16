ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua run \
    --addr $RELAY \
    --input ./aqua/init.aqua \
    --func 'read(peer_id, service_id, cid)' \
    --data '{ "peer_id":"'$NODE'","service_id":"'$SERVICE_ID'","cid":"'$CID'"}' \
    --timeout 60000

