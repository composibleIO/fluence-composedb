#!/bin/sh

set -o errexit -o nounset -o pipefail

cd ./marine/composedb_demo/src/
cargo update --aggressive
marine build --release

cd ../
mkdir -p artifacts
rm artifacts/* || true


cp ./target/wasm32-wasi/release/composedb_demo.wasm artifacts/facade.wasm
cp ../composedb_adapter/artifacts/composedb_adapter.wasm artifacts/ 
cp ../curl_adapter/artifacts/curl_adapter.wasm artifacts/ 
# cp ../local_storage/artifacts/local_storage.wasm artifacts/ 
# cp ../local_storage/artifacts/ipfs_adapter.wasm artifacts/ 