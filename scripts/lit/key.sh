ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

ETHADDRESS="1xF816Bf1d588100b6cea06B12CCe53fA81E81246A"
ENCRYPTEDSYMMETRICKEY="zzz"
ENCRYPTEDSTRING="xxx"


aqua run \
    --addr $RELAY \
    --input ./aqua/composedb.aqua \
    --func 'cdbStoreKey(node, service_id, ethAddress, encryptedString, encryptedSymmetricKey, ceramic_url)' \
    --data '{ "node":"'$NODE'", "service_id": "'$SERVICE_ID'","ethAddress": "'$ETHADDRESS'", "encryptedString": "'$ENCRYPTEDSTRING'", "encryptedSymmetricKey": "'$ENCRYPTEDSYMMETRICKEY'", "ceramic_url" : "'$CERAMIC_URL'"  }'\
    --timeout 60000
