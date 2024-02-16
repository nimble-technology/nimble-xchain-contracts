#! /bin/bash

set -x -e

script_dir=$(dirname $0)

mkdir -p ${script_dir}/wormhole/

# download wormhole repo if not exists
if [ ! -d ${script_dir}/../contracts/wormhole ]; then
    git clone https://github.com/wormhole-foundation/wormhole.git ${script_dir}/wormhole/
    mv ${script_dir}/wormhole ${script_dir}/../contracts/
    rm -rf ${script_dir}/wormhole
fi

# pull wormhole repo to the latest
cd ${script_dir}/../contracts/wormhole
git pull

# install worm command line tool
cd clients/js
make install
