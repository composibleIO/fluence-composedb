ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

#NAME="DirtyDianaV"
NAME="Furious_Frank"
#PK="e0157a323cf5cbf1c8d6126cc75dfc5d206da0cff9e12ecf5941c4c981668a41"
PK="8b22ed4905242b14930490260aa21c185afd8e3e913f7f1a23caa7828c2fc8c2"

aqua run \
    --addr $RELAY \
    --input ./aqua/composedb.aqua \
    --func 'cdbMutate(name,pk,node,service_id,ceramic_url)' \
    --data '{ "name": "'$NAME'", "pk": "'$PK'", "node":"'$NODE'", "service_id": "'$SERVICE_ID'", "ceramic_url" : "'$CERAMIC_URL'"  }'\
    --timeout 60000

