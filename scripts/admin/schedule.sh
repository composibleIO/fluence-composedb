ENV="./scripts/.env$1"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua script add \
    --addr $RELAY \
    --sk $SECRET \
    --input ./aqua/composedb.aqua \
    --func 'cdbConfirmAvailability(peer_id, cid, service_id)' \
    --data '{ "peer_id":"'$NODE'","cid":"'$CID'","service_id":"'$SERVICE_ID'"}' \
    --interval 86400   # 24 hours 
