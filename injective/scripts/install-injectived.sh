#! /bin/bash

set -x -e

script_dir=$(dirname $0)
source ${script_dir}/env.sh

# keep the version consistent with wormhole near impl: https://github.com/wormhole-foundation/wormhole/blob/main/near/setup-rust.sh
rustup install 1.64.0
rustup default 1.64.0
rustup update

sudo apt-get update && sudo apt-get install -y pkg-config build-essential libudev-dev

# Install injective tools
wget https://github.com/InjectiveLabs/injective-chain-releases/releases/download/v0.4.19-1652947015/linux-amd64.zip ${script_dir}/
unzip ${script_dir}/linux-amd64.zip
sudo mv injectived peggo injective-exchange /usr/local/bin
chmod +x /usr/local/bin/injectived /usr/local/bin/peggo /usr/local/bin/injective-exchange
sudo mv libwasmvm.x86_64.so /usr/local/lib

# Add the wasm toolchain
rustup target add wasm32-unknown-unknown

# install cargo generate
cargo install cargo-generate --features vendored-openssl
cargo install cargo-run-script
