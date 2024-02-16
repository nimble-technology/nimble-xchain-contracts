# deploy smart contracts

# Note: please do not add any mainnet private keys including mainnet test

## set RPC
ARBITRUM_RPC=$(jq '.endPoints.Arbitrum' ../config/mainnet_config.json | tr -d '"')
AVAX_RPC=$(jq '.endPoints.Avalanche' ../config/mainnet_config.json | tr -d '"')
BNB_RPC=$(jq '.endPoints.Binance' ../config/mainnet_config.json | tr -d '"')
OPTIMISM_RPC=$(jq '.endPoints.Optimism' ../config/mainnet_config.json | tr -d '"')
POLYGON_RPC=$(jq '.endPoints.Polygon' ../config/mainnet_config.json | tr -d '"')

export DEPLOYMENT_PRIVATE_KEY=$(jq '.userWalletPrivateKey' ../config/mainnet_config.json | tr -d '"')

## mkdir for logs dir
mkdir -p mainnet-deploy/deploy-logs

echo "------deploying contracts to Arbitrum------"

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Arbitrum.wormholeCoreContractAddress' ../config/mainnet-test/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Arbitrum.wormholeTokenBridgeContractAddress' ../config/mainnet-test/config.json | tr -d '"')

## deploy
FOUNDRY_PROFILE=mainnet forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $ARBITRUM_RPC \
    --private-key $DEPLOYMENT_PRIVATE_KEY \
    --broadcast --slow > mainnet-deploy/deploy-logs/deploy_arbitrum_nimble_contract.log 2>&1

sleep 5

echo "------deploying contracts to AVAX------"

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Avalanche.wormholeCoreContractAddress' ../config/mainnet-test/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Avalanche.wormholeTokenBridgeContractAddress' ../config/mainnet-test/config.json | tr -d '"')

## deploy
FOUNDRY_PROFILE=mainnet forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $AVAX_RPC \
    --private-key $DEPLOYMENT_PRIVATE_KEY \
    --broadcast --slow > mainnet-deploy/deploy-logs/deploy_avax_nimble_contract.log 2>&1

sleep 5

echo "------deploying contracts to BNB------"

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Binance.wormholeCoreContractAddress' ../config/mainnet-test/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Binance.wormholeTokenBridgeContractAddress' ../config/mainnet-test/config.json | tr -d '"')

## deploy
FOUNDRY_PROFILE=mainnet forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $BNB_RPC \
    --private-key $DEPLOYMENT_PRIVATE_KEY \
    --broadcast --slow > mainnet-deploy/deploy-logs/deploy_bnb_nimble_contract.log 2>&1

sleep 5

echo "------deploying contracts to Optimism------"

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Optimism.wormholeCoreContractAddress' ../config/mainnet-test/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Optimism.wormholeTokenBridgeContractAddress' ../config/mainnet-test/config.json | tr -d '"')

## deploy
FOUNDRY_PROFILE=mainnet forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $OPTIMISM_RPC \
    --private-key $DEPLOYMENT_PRIVATE_KEY \
    --broadcast --slow > mainnet-deploy/deploy-logs/deploy_optimism_nimble_contract.log 2>&1

sleep 5

echo "------deploying contracts to POLYGON------"

## override environment variables based on deployment network
export WORMHOLE_CORE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Polygon.wormholeCoreContractAddress' ../config/mainnet-test/config.json | tr -d '"')
export WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS=$(jq '.wormholeConfigs.Polygon.wormholeTokenBridgeContractAddress' ../config/mainnet-test/config.json | tr -d '"')

## deploy
FOUNDRY_PROFILE=mainnet forge script contracts/tools/deploy/deploy_xchain_transfer.sol \
    --rpc-url $POLYGON_RPC \
    --private-key $DEPLOYMENT_PRIVATE_KEY \
    --broadcast --slow > mainnet-deploy/deploy-logs/deploy_polygon_nimble_contract.log 2>&1
