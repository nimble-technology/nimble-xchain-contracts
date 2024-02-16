#! /bin/bash

set -x -e

script_dir=$(dirname $0)
source ${script_dir}/env.sh

# download foundry
sh -c "$(curl -L https://foundry.paradigm.xyz)"

# install libusb
brew install libusb

# install foundry
foundryup
