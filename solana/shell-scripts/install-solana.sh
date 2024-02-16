#! /bin/bash

set -x -e

script_dir=$(dirname $0)
source ${script_dir}/env.sh

sh -c "$(curl -sSfL https://release.solana.com/v1.14.14/install)"
