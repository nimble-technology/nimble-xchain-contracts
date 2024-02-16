const config = require("../../config/testnet/config.json");
export const NODE_URL_BSC = config.relayerUnitTest.nodeUrlBsc;
export const NODE_URL_GOERLI = config.relayerUnitTest.nodeUrlGoerli;

export const SENDER_PRIVATE_KEY = config.relayerUnitTest.senderPrivateKey;

export const BSC_CORE_BRIDGE_ADDRESS = config.relayerUnitTest.bscCoreBridgeAddress;
export const GOERLI_CORE_BRIDGE_ADDRESS = config.relayerUnitTest.goerliCoreBridgeAddress;

export const BSC_TOKEN_BRIDGE_ADDRESS = config.relayerUnitTest.bscTokenBridgeAddress;
export const GOERLI_TOKEN_BRIDGE_ADDRESS = config.relayerUnitTest.goerliTokenBridgeAddress
export const KARURA_TOKEN_BRIDGE_ADDRESS = config.relayerUnitTest.karuraTokenBridgeAddress

export const BSC_USDT_ADDRESS = config.relayerUnitTest.bscUSDTAddress;
export const GOERLI_USDC_ADDRESS = config.relayerUnitTest.goerliUSDCAddress;
export const NOT_SUPPORTED_ADDRESS = config.relayerUnitTest.notSupportedAddress;

const RELAYER_URL = config.relayerUrl;

export const RELAY_URL = `${RELAYER_URL}/relay`;
export const SHOULD_RELAY_URL = `${RELAYER_URL}/shouldRelay`;
export const nimble_RELAY_URL = `${RELAYER_URL}/nimbleRelay`;

export const WORMHOLE_GUARDIAN_RPC = config.relayerUnitTest.wormholeGuardianRPC
