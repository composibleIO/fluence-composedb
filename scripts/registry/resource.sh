ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua run \
    --addr $RELAY \
    --input ./aqua/registry.aqua \
    --func 'create_resource(name)' \
    --data '{ "name": "'$RESOURCE_NAME'"}'\
    --timeout 60000

