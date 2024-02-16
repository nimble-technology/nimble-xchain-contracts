#/bin/bash

pgrep anvil > /dev/null
if [ $? -eq 0 ]; then
    echo "anvil already running"
    exit 1;
fi

# Note: please do not add any mainnet private keys including mainnet test

TESTING_AVAX_FORK_RPC=$(jq '.chainConfigs.Avalanche.rpc' ../config/testnet/config.json | tr -d '"') 
TESTING_ETH_FORK_RPC=$(jq '.chainConfigs.Ethereum.rpc' ../config/testnet/config.json | tr -d '"')
TESTING_BNB_FORK_RPC=$(jq '.chainConfigs.Binance.rpc' ../config/testnet/config.json | tr -d '"') 
TESTING_POLYGON_FORK_RPC=$(jq '.chainConfigs.Polygon.rpc' ../config/testnet/config.json | tr -d '"')
export TEST_USER_WALLET_PRIVATE_KEY=$(jq '.testnetExtra.userWalletPrivateKey' ../config/testnet/config.json | tr -d '"')
TEST_AVAX_PORT=$(jq '.testnetExtra.Avalanche.testLocalPort' ../config/testnet/config.json | tr -d '"')
TEST_ETH_PORT=$(jq '.testnetExtra.Ethereum.testLocalPort' ../config/testnet/config.json | tr -d '"')
TEST_BNB_PORT=$(jq '.testnetExtra.Binance.testLocalPort' ../config/testnet/config.json | tr -d '"')
TEST_POLYGON_PORT=$(jq '.testnetExtra.Polygon.testLocalPort' ../config/testnet/config.json | tr -d '"')

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

# binance mainnet fork
anvil \
    -m "myth like bonus scare over problem client lizard pioneer submit female collect" \
    --port $TEST_BNB_PORT \
    --fork-url $TESTING_BNB_FORK_RPC > build/anvil-logs/anvil_bnb.log &

# polygon mainnet fork
anvil \
    -m "myth like bonus scare over problem client lizard pioneer submit female collect" \
    --port $TEST_POLYGON_PORT \
    --fork-url $TESTING_POLYGON_FORK_RPC > build/anvil-logs/anvil_polygon.log &

sleep 5

## anvil's rpc
AVAX_RPC=$(jq '.testnetExtra.Avalanche.testLocalRpc' ../config/testnet/config.json | tr -d '"')
ETH_RPC=$(jq '.testnetExtra.Ethereum.testLocalRpc' ../config/testnet/config.json | tr -d '"')
BNB_RPC=$(jq '.testnetExtra.Binance.testLocalRpc' ../config/testnet/config.json | tr -d '"')
POLYGON_RPC=$(jq '.testnetExtra.Polygon.testLocalRpc' ../config/testnet/config.json | tr -d '"')

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Avalanche.wormholeCoreContractAddress' ../config/testnet/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Avalanche.wormholeTokenBridgeContractAddress' ../config/testnet/config.json | tr -d '"')

## mkdir for logs dir
mkdir -p build/deploy-logs

echo "deploying contracts to Avalanche fork"
FOUNDRY_PROFILE=testnet forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $AVAX_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_avax_nimble_contract.log 2>&1

FOUNDRY_PROFILE=testnet forge script contracts/tests/helpers/tools/deploy/deploy_testERC20.sol \
    --rpc-url $AVAX_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_avax_testERC20.log 2>&1

sleep 5

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Ethereum.wormholeCoreContractAddress' ../config/testnet/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Ethereum.wormholeTokenBridgeContractAddress' ../config/testnet/config.json | tr -d '"')

echo "deploying contracts to Ethereum fork"
FOUNDRY_PROFILE=testnet forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $ETH_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_eth_nimble_contract.log 2>&1

FOUNDRY_PROFILE=testnet forge script contracts/tests/helpers/tools/deploy/deploy_testERC20.sol \
    --rpc-url $ETH_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_eth_testERC20.log 2>&1

sleep 5

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Binance.wormholeCoreContractAddress' ../config/testnet/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Binance.wormholeTokenBridgeContractAddress' ../config/testnet/config.json | tr -d '"')

## mkdir for logs dir
mkdir -p build/deploy-logs

echo "deploying contracts to BNB fork"
FOUNDRY_PROFILE=testnet forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $BNB_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_bnb_nimble_contract.log 2>&1

FOUNDRY_PROFILE=testnet forge script contracts/tests/helpers/tools/deploy/deploy_testERC20.sol \
    --rpc-url $BNB_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_bnb_testERC20.log 2>&1

sleep 5

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Polygon.wormholeCoreContractAddress' ../config/testnet/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Polygon.wormholeTokenBridgeContractAddress' ../config/testnet/config.json | tr -d '"')

echo "deploying contracts to POLYGON fork"
FOUNDRY_PROFILE=testnet forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $POLYGON_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_polygon_nimble_contract.log 2>&1

FOUNDRY_PROFILE=testnet forge script contracts/tests/helpers/tools/deploy/deploy_testERC20.sol \
    --rpc-url $POLYGON_RPC \
    --private-key $TEST_USER_WALLET_PRIVATE_KEY \
    --broadcast --slow > build/deploy-logs/deploy_polygon_testERC20.log 2>&1

sleep 5

## run tests here
npx ts-mocha -t 10000000 tests/testnet/scripts/test_transfer.ts

# nuke
pkill anvil
