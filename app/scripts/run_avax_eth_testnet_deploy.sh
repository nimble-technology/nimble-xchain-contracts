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

TESTING_AVAX_FORK_RPC=$(jq '.chainConfigs.Avalanche.rpc' config/testnet/config.json | tr -d '"')
TESTING_ETH_FORK_RPC=$(jq '.chainConfigs.Ethereum.rpc' config/testnet/config.json | tr -d '"')
export TEST_USER_WALLET_PRIVATE_KEY=$(jq '.testnetExtra.userWalletPrivateKey' config/testnet/config.json | tr -d '"')
TEST_AVAX_PORT=$(jq '.testnetExtra.testLocalPortSrc' config/testnet/config.json | tr -d '"')
TEST_ETH_PORT=$(jq '.testnetExtra.testLocalPortDest' config/testnet/config.json | tr -d '"')

## mkdir for logs dir
mkdir -p build/anvil-logs

# avalanche mainnet fork
anvil \
    -m "myth like bonus scare over problem client lizard pioneer submit female collect" \
    --port $TEST_AVAX_PORT \
    --fork-url $TESTING_AVAX_FORK_RPC > build/anvil-logs/anvil_avax.log &

# ethereum mainnet fork
anvil \
    -m "myth like bonus scare over problem client lizard pioneer submit female collect" \
    --port $TEST_ETH_PORT \
    --fork-url $TESTING_ETH_FORK_RPC > build/anvil-logs/anvil_eth.log &

sleep 5

## anvil's rpc
AVAX_RPC=$(jq '.testnetExtra.testLocalRpcSrc' config/testnet/config.json | tr -d '"')
ETH_RPC=$(jq '.testnetExtra.testLocalRpcDest' config/testnet/config.json | tr -d '"')

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Avalanche.wormholeCoreContractAddress' config/testnet/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Avalanche.wormholeTokenBridgeContractAddress' config/testnet/config.json | tr -d '"')

## mkdir for logs dir
mkdir -p build/deploy-logs

echo "deploying contracts to Avalanche fork"
forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $AVAX_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_avax_nimble_contract.log 2>&1

forge script contracts/tests/helpers/tools/deploy/deploy_wormUSD.sol \
    --rpc-url $AVAX_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_avax_wormUSD.log 2>&1

sleep 5

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Ethereum.wormholeCoreContractAddress' config/testnet/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Ethereum.wormholeTokenBridgeContractAddress' config/testnet/config.json | tr -d '"')

echo "deploying contracts to Ethereum fork"
forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $ETH_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_eth_nimble_contract.log 2>&1

forge script contracts/tests/helpers/tools/deploy/deploy_wormUSD.sol \
    --rpc-url $ETH_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_eth_wormUSD.log 2>&1

sleep 5

### move build
cp -r "$EVM_PATH/build" "$APP_PATH"
cp -r "$EVM_PATH/build" "$LIB_PATH/relayer-engine/src"

### run tests here
echo "start testing"

cd $APP_PATH

yarn reinstall
yarn start
