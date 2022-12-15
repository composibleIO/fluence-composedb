ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua run \
    --addr $RELAY \
    --input ./aqua/registry.aqua \
    --func 'stopProvideExternalService(resource_id, peer_id)' \
    --data '{ "resource_id":"'$RESOURCE_ID'","peer_id":"'$NODE'"}'\
    --timeout 60000