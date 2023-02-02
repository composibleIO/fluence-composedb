#!/bin/sh

set -o errexit -o nounset -o pipefail

cd ./marine/tu_cdb_demo/src/
cargo update --aggressive
marine build --release

cd ../
mkdir -p artifacts
rm artifacts/* || true


cp ./target/wasm32-wasi/release/tu_cdb_demo.wasm artifacts/tu_cdb_demo.wasm
cp ../composedb_adapter/artifacts/composedb_adapter.wasm artifacts/ 
cp ../curl_adapter/artifacts/curl_adapter.wasm artifacts/ 
