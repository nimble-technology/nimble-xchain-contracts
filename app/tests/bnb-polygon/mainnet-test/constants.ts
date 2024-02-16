const config = require("../../../../evm/config/mainnet-test/config.json")
const main_config = require("../../../../evm/config/mainnet_config.json");

// real on-chain tokens
export const BNB_USDC_ADDRESS = config.tokenConfigs.Binance.USDC.address;
export const POLYGON_USDC_ADDRESS = config.tokenConfigs.Polygon.USDC.address;
export const USER_WALLET_PRIVATE_KEY = main_config.userWalletPrivateKey;
export const RELAYER_WALLET_PRIVATE_KEY = main_config.relayerWalletPrivateKey;
export const BNB_ENDPOINT = main_config.endPoints.Binance;
export const POLYGON_ENDPOINT = main_config.endPoints.Polygon;
export const BNB_WORMHOLE_ADDRESS = config.wormholeConfigs.Binance.wormholeCoreContractAddress;
export const POLYGON_WORMHOLE_ADDRESS = config.wormholeConfigs.Polygon.wormholeCoreContractAddress;
export const BNB_BRIDGE_ADDRESS = config.wormholeConfigs.Binance.wormholeTokenBridgeContractAddress;
export const POLYGON_BRIDGE_ADDRESS = config.wormholeConfigs.Polygon.wormholeTokenBridgeContractAddress;
export const BNB_CHAIN_ID = config.chainConfigs.Binance.chainId;
export const POLYGON_CHAIN_ID = config.chainConfigs.Polygon.chainId;
export const WORMHOLE_RPC_HOSTS = config.mainnetExtra.wormholeRpcHost;
