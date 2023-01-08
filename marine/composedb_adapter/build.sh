#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

cd ./src
cargo update --aggressive
marine build --release

cd ..

mkdir -p artifacts
rm -f artifacts/*.wasm

cp ./target/wasm32-wasi/release/composedb_adapter.wasm artifacts/composedb_adapter.wasm
