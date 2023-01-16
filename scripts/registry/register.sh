ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua run \
    --addr $RELAY \
    --input ./aqua/registry.aqua \
    --func 'registerExternalService(resource_id, name, peer_id, service_id)' \
    --data '{ "resource_id":"'$RESOURCE_ID'", "name" : "'$CID'", "peer_id":"'$NODE'","service_id":"'$SERVICE_ID'"}' \
    --timeout 60000

