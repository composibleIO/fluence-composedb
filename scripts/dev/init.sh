ENV="./scripts/.env$1"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua run \
    --addr $RELAY \
    --input ./aqua/composedb.aqua \
    --func 'cdbInit(resource_id, peer_id, service_id, namespace, n, indexes)' \
    --data '{ "resource_id":"'$RESOURCE_ID'","peer_id":"'$NODE'","service_id":"'$SERVICE_ID'","namespace":"'$NAMESPACE'","n":"'$N'","indexes":"'$INDEXES'"}' \
    --timeout 120000

