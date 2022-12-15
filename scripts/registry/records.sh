ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua run \
    --addr $RELAY \
    --input ./aqua/registry.aqua \
    --func 'getMyRecords(resource_id,consistency_level)' \
    --data '{ "resource_id":"'$RESOURCE_ID'", "consistency_level": 1}'\
    --timeout 60000