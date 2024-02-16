#! /bin/bash

set -x -e

script_dir=$(dirname $0)
source ${script_dir}/env.sh

rustup install 1.67.0
rustup default 1.67.0

sudo apt-get update && sudo apt-get install -y pkg-config build-essential libudev-dev

cargo install --git https://github.com/project-serum/anchor --tag v0.26.0 avm --locked --force
avm install 0.26.0
avm use 0.26.0
