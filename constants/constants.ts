import config from "../config/mainnet-test/config.json";
import main_config from "../config/mainnet_config.json";
import exp from "constants";

// wormhole rpc hosts
export const WORMHOLE_RPC_HOSTS = config.mainnetExtra.wormholeRpcHost;

// real on-chain tokens
export const ARBITRUM_USDC_ADDRESS = config.tokenConfigs.Arbitrum.USDC.address;
export const AVALANCHE_USDC_ADDRESS = config.tokenConfigs.Avalanche.USDC.address;
export const BNB_USDC_ADDRESS = config.tokenConfigs.Binance.USDC.address;
export const INJECTIVE_USDC_ADDRESS = config.tokenConfigs.Injective.USDC.address;
export const OPTIMISM_USDC_ADDRESS = config.tokenConfigs.Optimism.USDC.address;
export const POLYGON_USDC_ADDRESS = config.tokenConfigs.Polygon.USDC.address;

// private keys
export const USER_WALLET_PRIVATE_KEY = main_config.userWalletPrivateKey;
export const RELAYER_WALLET_PRIVATE_KEY = main_config.relayerWalletPrivateKey;

// endpoints
export const ARBITRUM_ENDPOINT = main_config.endPoints.Arbitrum;
export const AVAX_ENDPOINT = main_config.endPoints.Avalanche;
export const BNB_ENDPOINT = main_config.endPoints.Binance;
export const ETHEREUM_ENDPOINT = main_config.endPoints.Ethereum;
export const INJECTIVE_ENDPOINT = main_config.endPoints.Injective;
export const OPTIMISM_ENDPOINT = main_config.endPoints.Optimism;
export const POLYGON_ENDPOINT = main_config.endPoints.Polygon;

// wormhole core contract addresses
export const ARBITRUM_WORMHOLE_ADDRESS = config.wormholeConfigs.Arbitrum.wormholeCoreContractAddress;
export const AVAX_WORMHOLE_ADDRESS = config.wormholeConfigs.Avalanche.wormholeCoreContractAddress;
export const BNB_WORMHOLE_ADDRESS = config.wormholeConfigs.Binance.wormholeCoreContractAddress;
export const INJECTIVE_WORMHOLE_ADDRESS = config.wormholeConfigs.Injective.wormholeCoreContractAddress;
export const OPTIMISM_WORMHOLE_ADDRESS = config.wormholeConfigs.Optimism.wormholeCoreContractAddress;
export const POLYGON_WORMHOLE_ADDRESS = config.wormholeConfigs.Polygon.wormholeCoreContractAddress;

// wormhole token bridge addresses
export const ARBITRUM_BRIDGE_ADDRESS = config.wormholeConfigs.Arbitrum.wormholeTokenBridgeContractAddress;
export const AVAX_BRIDGE_ADDRESS = config.wormholeConfigs.Avalanche.wormholeTokenBridgeContractAddress;
export const BNB_BRIDGE_ADDRESS = config.wormholeConfigs.Binance.wormholeTokenBridgeContractAddress;
export const INJECTIVE_BRIDGE_ADDRESS = config.wormholeConfigs.Injective.wormholeTokenBridgeContractAddress;
export const OPTIMISM_BRIDGE_ADDRESS = config.wormholeConfigs.Optimism.wormholeTokenBridgeContractAddress;
export const POLYGON_BRIDGE_ADDRESS = config.wormholeConfigs.Polygon.wormholeTokenBridgeContractAddress;

// chain ids
export const ARBITRUM_CHAIN_ID = config.chainConfigs.Arbitrum.chainId;
export const AVAX_CHAIN_ID = config.chainConfigs.Avalanche.chainId;
export const BNB_CHAIN_ID = config.chainConfigs.Binance.chainId;
export const INJECTIVE_CHAIN_ID = config.chainConfigs.Injective.chainId;
export const OPTIMISM_CHAIN_ID = config.chainConfigs.Optimism.chainId;
export const POLYGON_CHAIN_ID = config.chainConfigs.Polygon.chainId;

// fees
export const RELAYER_FEE_PRECISION = Number(main_config.relayerFeePrecision);
export const RELAYER_FEE_PERCENTAGE = Number(main_config.relayerFeePercentage);
