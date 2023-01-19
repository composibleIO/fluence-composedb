ENV="./scripts/.env$1"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua run \
    --addr $RELAY \
    --input ./aqua/composedb.aqua \
    --func 'cdbQuery(node, service_id, contractor_cid, definition, query)' \
    --data '{ "node":"'$NODE'","service_id":"'$SERVICE_ID'","contractor_cid":"'$CID'","definition":"'$DEF'","query":"'$QUERY'"}'\
    --timeout 60000