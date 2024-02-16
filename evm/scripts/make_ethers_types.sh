#!/bin/bash

SRC=$(dirname $0)/../build/out
DST=$(dirname $0)/../build/src/ethers-contracts

typechain --target=ethers-v5 --out-dir=$DST $SRC/*/*.json
