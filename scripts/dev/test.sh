ENV="./scripts/.env$1"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

# RELAY="/dns4/net01.fluence.dev/tcp/19990/wss/p2p/12D3KooWMhVpgfQxBLkQkJed8VFNvgN4iE6MD7xCybb1ZYWW2Gtz"
# NODE="12D3KooWPRHMvF76oFWeAVVQZDc39z9DMTvfAAnatZhu48HYW6ux"

aqua run \
    --addr $RELAY \
    --input ./aqua/test.aqua \
    --func 'canConnect(peer_id)' \
    --data '{"peer_id":"'$NODE'"}' \
    --timeout 60000

