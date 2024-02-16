import {
  hexToUint8Array,
  redeemOnEth,
  parseTransferPayload,
  hexToNativeString, parseVaa, toChainId, solana, isChain,
} from "@certusone/wormhole-sdk";
import { importCoreWasm } from "@certusone/wormhole-sdk-wasm";
import { ContractReceipt, ethers } from "ethers";
import { ChainConfigInfo } from "../configureEnv";
import {
  RELAYER_SUPPORTED_ADDRESSES_AND_THRESHOLDS,
} from "./constants";
import { numberToChainID } from "../utils/utils";

interface VaaInfo {
  amount: bigint;
  originAddress: string;
  originChain: number;
  targetAddress: string;
  targetChain: number;
}

interface ShouldRelayResult {
  shouldRelay: boolean;
  msg: string;
}

export const _parseVaa = async (bytes: Uint8Array): Promise<VaaInfo> => {
  const { parse_vaa } = await importCoreWasm();
  const parsedVaa = parse_vaa(bytes);
  const buffered = Buffer.from(new Uint8Array(parsedVaa.payload));
  return parseTransferPayload(buffered);
};

export function getRelayerSupportedAddressAndThreshold() {
  return RELAYER_SUPPORTED_ADDRESSES_AND_THRESHOLDS;
}

export const shouldRelayVaa = (vaaInfo: VaaInfo): ShouldRelayResult => {
  const {
    amount,
    targetChain,
    originChain,
    originAddress,
  } = vaaInfo;
  const originChainID = numberToChainID(originChain)!;
  const originAsset = hexToNativeString(originAddress, originChainID)!;

  const res = shouldRelay({ targetChain, originAsset, amount });

  const info = JSON.stringify({ targetChain, originAsset, amount, res }, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
  console.log(`check should relay VAA: ${info}`);

  return res;
};

export const shouldRelay = ({
                              targetChain,
                              originAsset,
                              amount: _amount,
                            }: {
  targetChain: number;
  originAsset: string;
  amount: bigint;
}): ShouldRelayResult => {
  const _noRelay = (msg: string): ShouldRelayResult => ({ shouldRelay: false, msg });

  if (!targetChain) return _noRelay("missing targetChain");
  if (!originAsset) return _noRelay("missing originAsset");
  if (!_amount) return _noRelay("missing transfer amount");

  let amount: bigint;
  try {
    amount = BigInt(_amount);
  } catch (e) {
    return _noRelay(`failed to parse amount: ${_amount}`);
  }
  const supported = RELAYER_SUPPORTED_ADDRESSES_AND_THRESHOLDS[targetChain];
  if (!supported) return _noRelay("target chain not supported");
  const minTransfer = supported[originAsset.toLowerCase()];
  if (!minTransfer) return _noRelay("token not supported");
  if (amount < BigInt(minTransfer)) return _noRelay(`transfer amount too small, expect at least ${minTransfer}`);

  return { shouldRelay: true, msg: "" };
};

export const relayEVM = async (
  chainConfigInfo: ChainConfigInfo,
  signedVAA: string,
): Promise<ContractReceipt> => {
  const provider = new ethers.providers.WebSocketProvider(chainConfigInfo.substrateNodeUrl);

  const signer = new ethers.Wallet(chainConfigInfo.walletPrivateKey, provider);

  const receipt = await redeemOnEth(
    chainConfigInfo.tokenBridgeAddress,
    signer,
    hexToUint8Array(signedVAA),
  );


  return receipt;
};
