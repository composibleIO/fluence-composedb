ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua run \
    --addr $RELAY \
    --input ./aqua/composedb.aqua \
    --func 'cdbServeKeystore(node,service_id, composite_name, port, ceramic_url)' \
    --data '{ "node":"'$NODE'", "service_id": "'$SERVICE_ID'", "ceramic_url" : "'$CERAMIC_URL'" }'\
    --timeout 60000