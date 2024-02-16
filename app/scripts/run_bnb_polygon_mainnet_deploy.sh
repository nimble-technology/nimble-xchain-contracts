#/bin/bash
APP_PATH="$(cd "$(dirname "$0")";pwd)/.."
WORK_PATH="${APP_PATH}/.."
LIB_PATH="${WORK_PATH}/lib"
EVM_PATH="${WORK_PATH}/evm"

cd $EVM_PATH

make bnb-polygon-mainnet-deploy

### move build
cp -r "$EVM_PATH/build" "$APP_PATH"
cp -r "$EVM_PATH/build" "$LIB_PATH/relayer-engine/src"

### run tests here
echo "start testing"

cd $APP_PATH

yarn reinstall
yarn start
