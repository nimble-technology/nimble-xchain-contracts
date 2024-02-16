#! /bin/bash

set -x -e

script_dir=$(dirname $0)

mkdir -p ${script_dir}/aptos/

# download wormhole repo if not exists
if [ ! -d ${script_dir}/../contracts/aptos ]; then
    git clone https://github.com/aptos-labs/aptos-core.git ${script_dir}/aptos/
    mv ${script_dir}/aptos ${script_dir}/../contracts/
    rm -rf ${script_dir}/aptos
fi

# pull aptos repo to the latest
cd ${script_dir}/../contracts/aptos
git pull

# install aptos dependencies
cd scripts
sh ./dev_setup.sh
