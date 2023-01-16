ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua run \
    --addr $RELAY \
    --input ./aqua/init.aqua \
    --func 'test(indexes)' \
    --data '{"indexes":'$INDEXES'}' \
    --timeout 60000

