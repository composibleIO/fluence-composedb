ENV="./scripts/.env"
if [ ! -f '$ENV' ]
then
  export $(cat $ENV | xargs)
fi

OWNER="12D3KooWE3aKW2p2gMhEPdq8uJvhXtLRrUQ76z4APmtGePqooCS2"

# aqua run \
#     --addr /dns4/net01.fluence.dev/tcp/19990/wss/p2p/12D3KooWMhVpgfQxBLkQkJed8VFNvgN4iE6MD7xCybb1ZYWW2Gtz \
#     --input ./aqua/maintenance.aqua \
#     --func 'list_services(node)' \
#     --data '{ "node":"'$NODE'", "owner_id":"'$OWNER'"}'\
#     --timeout 600000

aqua run \
    --addr /dns4/net01.fluence.dev/tcp/19990/wss/p2p/12D3KooWMhVpgfQxBLkQkJed8VFNvgN4iE6MD7xCybb1ZYWW2Gtz \
    --input ./aqua/maintenance.aqua \
    --func 'clear_services(owner_id, node)' \
    --data '{ "owner_id":"'$OWNER'","node":"'$NODE'"}'\
    --timeout 600000