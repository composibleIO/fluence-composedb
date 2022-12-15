#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

cd ./src
cargo update --aggressive
marine build --release

cd ..

mkdir -p artifacts
rm -f artifacts/*.wasm

cp ./target/wasm32-wasi/release/composedb_adapter.wasm artifacts/composedb_adapter.wasm

#cp facade/target/wasm32-wasi/release/facade.wasm artifacts/
# curl -X POST -F file=@artifacts/facade.wasm "http://143.176.14.172:5001/api/v0/add"



# aqua remote deploy_service \
#     --addr /dns4/kras-01.fluence.dev/tcp/19001/wss/p2p/12D3KooWKnEqMfYo9zvfHmqTLpLdiHXPe4SVqUWcWHDJdFGrSmcA \
#     --config-path ./configs/service_config.json \
#     --service personalization-service \
#     --sk FfIzrfIaega2Rftl8KutcGS/3AE+dmar7dL/vtYpAgA=

# aqua remote deploy_service \
#     --addr /ip4/143.176.14.172/tcp/9990/wss/p2p/12D3KooWKnEqMfYo9zvfHmqTLpLdiHXPe4SVqUWcWHDJdFGrSmcA \
#     --config-path ./configs/service_config.json \
#     --service personalization-service \
#     --sk FfIzrfIaega2Rftl8KutcGS/3AE+dmar7dL/vtYpAgA=
