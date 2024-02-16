#/bin/bash
APP_PATH="$(cd "$(dirname "$0")";pwd)/.."
WORK_PATH="${APP_PATH}/.."
LIB_PATH="${WORK_PATH}/lib"
EVM_PATH="${WORK_PATH}/evm"

cd $EVM_PATH

rm -rf lib build
make build

pgrep anvil > /dev/null
if [ $? -eq 0 ]; then
    echo "anvil already running, will kill and restart."
    pkill anvil
fi

# Note: please do not add any mainnet private keys including mainnet test

TESTING_BNB_FORK_RPC=$(jq '.chainConfigs.Binance.rpc' config/testnet/config.json | tr -d '"')
TESTING_POLYGON_FORK_RPC=$(jq '.chainConfigs.Polygon.rpc' config/testnet/config.json | tr -d '"')
export TEST_USER_WALLET_PRIVATE_KEY=$(jq '.testnetExtra.userWalletPrivateKey' config/testnet/config.json | tr -d '"')
TEST_BNB_PORT=$(jq '.testnetExtra.testLocalPortSrc' config/testnet/config.json | tr -d '"')
TEST_POLYGON_PORT=$(jq '.testnetExtra.testLocalPortDest' config/testnet/config.json | tr -d '"')

## mkdir for logs dir
mkdir -p build/anvil-logs

# avalanche mainnet fork
anvil \
    -m "myth like bonus scare over problem client lizard pioneer submit female collect" \
    --port $TEST_BNB_PORT \
    --fork-url $TESTING_BNB_FORK_RPC > build/anvil-logs/anvil_bnb.log &

# polygonereum mainnet fork
anvil \
    -m "myth like bonus scare over problem client lizard pioneer submit female collect" \
    --port $TEST_POLYGON_PORT \
    --fork-url $TESTING_POLYGON_FORK_RPC > build/anvil-logs/anvil_polygon.log &

sleep 5

## anvil's rpc
BNB_RPC=$(jq '.testnetExtra.testLocalRpcSrc' config/testnet/config.json | tr -d '"')
POLYGON_RPC=$(jq '.testnetExtra.testLocalRpcDest' config/testnet/config.json | tr -d '"')

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Binance.wormholeCoreContractAddress' config/testnet/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Binance.wormholeTokenBridgeContractAddress' config/testnet/config.json | tr -d '"')

## mkdir for logs dir
mkdir -p build/deploy-logs

echo "deploying contracts to BNB fork"
forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $BNB_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_bnb_nimble_contract.log 2>&1

forge script contracts/tests/helpers/tools/deploy/deploy_testERC20.sol \
    --rpc-url $BNB_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_bnb_testERC20.log 2>&1

sleep 5

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Polygon.wormholeCoreContractAddress' config/testnet/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Polygon.wormholeTokenBridgeContractAddress' config/testnet/config.json | tr -d '"')

echo "deploying contracts to POLYGON fork"
forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $POLYGON_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_polygon_nimble_contract.log 2>&1

forge script contracts/tests/helpers/tools/deploy/deploy_testERC20.sol \
    --rpc-url $POLYGON_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_polygon_testERC20.log 2>&1

sleep 5


### move build
cp -r "$EVM_PATH/build" "$APP_PATH"
cp -r "$EVM_PATH/build" "$LIB_PATH/relayer-engine/src"

### run tests here
echo "start testing"

cd $APP_PATH

yarn reinstall
yarn start
