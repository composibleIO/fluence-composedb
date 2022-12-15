ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

aqua remote deploy_service \
    --addr $RELAY \
    --on $NODE \
    --config-path ./marine/composedb_demo/configs/deploy_cfg.json \
    --service composedb_demo \
    --sk $SECRET
