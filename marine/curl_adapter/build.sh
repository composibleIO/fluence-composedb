#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail


## cd ../facade
cargo update --aggressive
marine build --release
## cd ..

mkdir -p artifacts
rm -f artifacts/*.wasm

cp target/wasm32-wasi/release/curl_adapter.wasm artifacts/curl_adapter.wasm
# curl -X POST -F file=@artifacts/curl_adapter.wasm "http://64.227.70.116:5001/api/v0/add"
# ## curl -X POST -F file=@artifacts/elasticsearch_adapter.wasm "http://62.195.116.80:5001/api/v0/add"
