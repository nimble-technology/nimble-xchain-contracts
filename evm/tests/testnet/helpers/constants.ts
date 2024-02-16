import {ethers} from "ethers";
import config from "../../../../config/testnet/config.json";

// Avalanche wormhole variables
export const AVAX_HOST = config.testnetExtra.Avalanche.testLocalRpc;
export const FORK_AVAX_CHAIN_ID = Number(config.chainConfigs.Avalanche.chainId!);

export const AVAX_WORMHOLE_ADDRESS = config.wormholeConfigs.Avalanche.wormholeCoreContractAddress!;
export const AVAX_WORMHOLE_CHAIN_ID = Number(
  config.wormholeConfigs.Avalanche.wormholeChainId!
);
export const AVAX_WORMHOLE_MESSAGE_FEE = ethers.BigNumber.from(
  config.wormholeConfigs.Avalanche.wormholeMessageFee!
);
export const AVAX_WORMHOLE_GUARDIAN_SET_INDEX = Number(
  config.wormholeConfigs.Avalanche.wormholeGuardianSet!
);
export const AVAX_BRIDGE_ADDRESS = config.wormholeConfigs.Avalanche.wormholeTokenBridgeContractAddress!;

// Ethereum wormhole variables
export const ETH_HOST = config.testnetExtra.Ethereum.testLocalRpc;
export const FORK_ETH_CHAIN_ID = Number(config.chainConfigs.Ethereum.chainId!);

export const ETH_WORMHOLE_ADDRESS = config.wormholeConfigs.Ethereum.wormholeCoreContractAddress!;
export const ETH_WORMHOLE_CHAIN_ID = Number(
  config.wormholeConfigs.Ethereum.wormholeChainId!
);
export const ETH_WORMHOLE_MESSAGE_FEE = ethers.BigNumber.from(
  config.wormholeConfigs.Ethereum.wormholeMessageFee!
);
export const ETH_WORMHOLE_GUARDIAN_SET_INDEX = Number(
  config.wormholeConfigs.Ethereum.wormholeGuardianSet!
);
export const ETH_BRIDGE_ADDRESS = config.wormholeConfigs.Ethereum.wormholeTokenBridgeContractAddress!;

// Binance variables
export const BNB_HOST = config.testnetExtra.Binance.testLocalRpc;
export const FORK_BNB_CHAIN_ID = Number(config.chainConfigs.Binance.chainId);

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

// Polygon variables
export const POLYGON_HOST = config.testnetExtra.Polygon.testLocalRpc;
export const FORK_POLYGON_CHAIN_ID = Number(config.chainConfigs.Polygon.chainId);

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
