#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail


## cd ../facade
cargo update --aggressive
marine build --release
## cd ..

mkdir -p artifacts
rm -f artifacts/*.wasm

cp target/wasm32-wasi/release/ipfs_adapter.wasm artifacts/ipfs_adapter.wasm
