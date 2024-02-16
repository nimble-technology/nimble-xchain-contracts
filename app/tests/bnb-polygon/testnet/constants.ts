import {ethers} from "ethers";
const config = require("../../../../evm/config/testnet/config.json");

// rpc
export const BNB_HOST = config.testnetExtra.testLocalRpcSrc;
export const POLYGON_HOST = config.testnetExtra.testLocalRpcDest;

// forks
export const FORK_BNB_CHAIN_ID = Number(
  config.chainConfigs.Binance.chainId
);
export const FORK_POLYGON_CHAIN_ID = Number(config.chainConfigs.Polygon.chainId);

// Binance wormhole variables
export const BNB_WORMHOLE_ADDRESS = config.wormholeConfigs.Binance.wormholeCoreContractAddress;
export const BNB_WORMHOLE_CHAIN_ID = Number(
  config.wormholeConfigs.Binance.wormholeChainId
);
export const BNB_WORMHOLE_MESSAGE_FEE = ethers.BigNumber.from(
  config.wormholeConfigs.Binance.wormholeMessageFee
);
export const BNB_WORMHOLE_GUARDIAN_SET_INDEX = Number(
  config.wormholeConfigs.Binance.wormholeGuardianSet
);
export const BNB_BRIDGE_ADDRESS = config.wormholeConfigs.Binance.wormholeTokenBridgeContractAddress;

// Polygon wormhole variables
export const POLYGON_WORMHOLE_ADDRESS = config.wormholeConfigs.Polygon.wormholeCoreContractAddress;
export const POLYGON_WORMHOLE_CHAIN_ID = Number(
  config.wormholeConfigs.Polygon.wormholeChainId
);
export const POLYGON_WORMHOLE_MESSAGE_FEE = ethers.BigNumber.from(
  config.wormholeConfigs.Polygon.wormholeMessageFee
);
export const POLYGON_WORMHOLE_GUARDIAN_SET_INDEX = Number(
  config.wormholeConfigs.Polygon.wormholeGuardianSet
);
export const POLYGON_BRIDGE_ADDRESS = config.wormholeConfigs.Polygon.wormholeTokenBridgeContractAddress;

// signer
export const GUARDIAN_PRIVATE_KEY = config.testnetExtra.testGuardianPrivateKey;
export const USER_WALLET_PRIVATE_KEY = config.testnetExtra.userWalletPrivateKey;
export const RELAYER_WALLET_PRIVATE_KEY = config.testnetExtra.relayerWalletPrivateKey;

// wormhole event ABIs
export const WORMHOLE_TOPIC =
  "0x6eb224fb001ed210e379b335e35efe88672a8ce935d981a6896b27ffdf52a3b2";
export const WORMHOLE_MESSAGE_EVENT_ABI = [
  "event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)",
];

