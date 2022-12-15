ENV="/home/joera/Documents/transport-union/fluence_composedb/scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

NODE="12D3KooWDv2PTX9enMVrFiwjASMVFAuxmscuSDQZZdbusATy24k4"
SERVICE_ID="47804c9e-d705-4142-bccd-b51bf94a0f47"
CERAMIC_URL="http://ceramic-sidecar:7007"
PORT="5501"
NAME="litkeystore"

aqua run \
    --addr /dns4/net01.fluence.dev/tcp/19990/wss/p2p/12D3KooWMhVpgfQxBLkQkJed8VFNvgN4iE6MD7xCybb1ZYWW2Gtz \
    --input ../../aqua/composedb.aqua \
    --func 'cdbCreate(node,service_id, composite_name, ceramic_url)' \
    --data '{ "node":"'$NODE'", "service_id": "'$SERVICE_ID'", "composite_name": "'$NAME'", "ceramic_url" : "'$CERAMIC_URL'" }'\
    --timeout 60000