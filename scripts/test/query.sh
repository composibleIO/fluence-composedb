ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua run \
    --addr $RELAY \
    --input ./aqua/composedb.aqua \
    --func 'cdbQuery(node,service_id, port)' \
    --data '{ "node":"'$NODE'", "service_id": "'$SERVICE_ID'", "port": "'$1'" }'\
    --timeout 60000