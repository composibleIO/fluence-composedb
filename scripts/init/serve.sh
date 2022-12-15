

# 76621114-3654-4476-a0eb-354cfd267270
NODE="12D3KooWDv2PTX9enMVrFiwjASMVFAuxmscuSDQZZdbusATy24k4"
SERVICE_ID="0eb72504-c1a1-4f1d-8dfa-b1981a98a0a8"
CERAMIC_URL="http://ceramic-sidecar:7007"
COMPOSEDB_URL="http://localhost:5001"
MODEL_ID="kjzl6hvfrbw6c7keo17n66rxyo21nqqaa9lh491jz16od43nokz7ksfcvzi6bwc"  #"kjzl6hvfrbw6ca7nidsnrv78x7r4xt0xki71nvwe4j5a3s9wgou8yu3aj8cz38e"
PORT="5501"

aqua run \
    --addr /dns4/net01.fluence.dev/tcp/19990/wss/p2p/12D3KooWMhVpgfQxBLkQkJed8VFNvgN4iE6MD7xCybb1ZYWW2Gtz \
    --input ./aqua/composedb.aqua \
    --func 'cdbServe(node,service_id, model_id, port, ceramic_url)' \
    --data '{ "node":"'$NODE'", "service_id": "'$SERVICE_ID'", "model_id": "'$MODEL_ID'", "port": "'$PORT'","ceramic_url" : "'$CERAMIC_URL'" }'\
    --timeout 60000

