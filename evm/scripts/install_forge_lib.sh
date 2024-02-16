#! /bin/bash

set -x -e

script_dir=$(dirname $0)

rm -rf ${script_dir}/../lib
forge install foundry-rs/forge-std --no-git --no-commit
