#! /bin/bash

set -x -e

script_dir=$(dirname $0)
source ${script_dir}/env.sh

# keep the version consistent with wormhole near impl: https://github.com/wormhole-foundation/wormhole/blob/main/near/setup-rust.sh
rustup install 1.60.0
rustup default 1.60.0
rustup update

sudo apt-get update && sudo apt-get install -y pkg-config build-essential libudev-dev

# Add the wasm toolchain
rustup target add wasm32-unknown-unknown
