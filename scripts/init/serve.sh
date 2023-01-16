ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

MODEL_ID="kjzl6hvfrbw6c7keo17n66rxyo21nqqaa9lh491jz16od43nokz7ksfcvzi6bwc"  #"kjzl6hvfrbw6ca7nidsnrv78x7r4xt0xki71nvwe4j5a3s9wgou8yu3aj8cz38e"
PORT="5501"

aqua run \
    --addr $RELAY \
    --input ./aqua/composedb.aqua \
    --func 'cdbServe(node,service_id, model_id)' \
    --data '{ "node":"'$NODE'", "service_id": "'$SERVICE_ID'", "model_id": "'$MODEL_ID'"}'\
    --timeout 60000

