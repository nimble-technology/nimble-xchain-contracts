import {ethers} from "ethers";
import mainnet_config from "../../../../config/mainnet_config.json";
import config from "../../../../config/mainnet-test/config.json";

export const USER_WALLET_PRIVATE_KEY = mainnet_config.userWalletPrivateKey;
export const RELAYER_WALLET_PRIVATE_KEY = mainnet_config.relayerWalletPrivateKey;
export const BNB_ENDPOINT = mainnet_config.endPoints.Binance;
export const ETHEREUM_ENDPOINT = mainnet_config.endPoints.Ethereum;
export const POLYGON_ENDPOINT = mainnet_config.endPoints.Polygon;
export const RELAYER_FEE_PRECISION = Number(mainnet_config.relayerFeePrecision);
export const RELAYER_FEE_PERCENTAGE = Number(mainnet_config.relayerFeePercentage);

export const BNB_CHAIN_ID = Number(config.chainConfigs.Binance.chainId!);
export const POLYGON_CHAIN_ID = Number(config.chainConfigs.Polygon.chainId!);
