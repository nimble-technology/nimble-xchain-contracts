import {BigNumber, ethers, providers, Wallet} from "ethers";
import {
  // chain ids
  ChainId,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_BSC,
  CHAIN_ID_POLYGON,
  CHAIN_ID_AVAX,
  CHAIN_ID_OPTIMISM,
  // utils
  tryNativeToHexString,
  parseSequenceFromLogEth,
  getEmitterAddressEth,
  getSignedVAAWithRetry,
} from "@certusone/wormhole-sdk";
import {
  // rpc hosts
  WORMHOLE_RPC_HOSTS,
  // keys
  USER_WALLET_PRIVATE_KEY,
  RELAYER_WALLET_PRIVATE_KEY,
  // endpoints
  ARBITRUM_ENDPOINT,
  AVAX_ENDPOINT,
  BNB_ENDPOINT,
  OPTIMISM_ENDPOINT,
  POLYGON_ENDPOINT,
  // wormhole addresses
  ARBITRUM_WORMHOLE_ADDRESS,
  AVAX_WORMHOLE_ADDRESS,
  BNB_WORMHOLE_ADDRESS,
  OPTIMISM_WORMHOLE_ADDRESS,
  POLYGON_WORMHOLE_ADDRESS,
  // bridge addresses
  ARBITRUM_BRIDGE_ADDRESS,
  AVAX_BRIDGE_ADDRESS,
  BNB_BRIDGE_ADDRESS,
  OPTIMISM_BRIDGE_ADDRESS,
  POLYGON_BRIDGE_ADDRESS,
  // chain ids
  ARBITRUM_CHAIN_ID,
  AVAX_CHAIN_ID,
  BNB_CHAIN_ID,
  OPTIMISM_CHAIN_ID,
  POLYGON_CHAIN_ID,
} from "../../../constants/constants";
import {
  readnimbleXChainContractAddress,
} from "../../tests/helpers/utils";
import {makeContract} from "../../tests/helpers/io";
import {
  nimbleXChain,
  nimbleXChain__factory,
} from "../../build/src/ethers-contracts";
import {NodeHttpTransport} from "@improbable-eng/grpc-web-node-http-transport";
import {RelayerInfo} from "./relayer/utils";
import {nimbleRelay} from "./relayer/relay";
import {TextDecoder} from "util";

// get ERC20 Token ABI
export const erc20_abi_path = `${__dirname}/../../../constants/ERC20.ABI.json`;

interface Info {
  provider: ethers.providers.JsonRpcProvider;
  wallet: ethers.Wallet;
  relayerWallet: ethers.Wallet,
  wormholeAddress: string,
  bridgeAddress: string,
  nimbleXChain: nimbleXChain,
  chainId: ChainId,
}

function getInfo() {
  // arbitrum provider & wallet
  const arbitrumProvider = new providers.JsonRpcProvider(ARBITRUM_ENDPOINT);
  const arbitrumWallet = new Wallet(USER_WALLET_PRIVATE_KEY, arbitrumProvider);
  const arbitrumRelayerWallet = new Wallet(RELAYER_WALLET_PRIVATE_KEY, arbitrumProvider);

  // avax provider & wallet
  const avaxProvider = new providers.JsonRpcProvider(AVAX_ENDPOINT);
  const avaxWallet = new Wallet(USER_WALLET_PRIVATE_KEY, avaxProvider);
  const avaxRelayerWallet = new Wallet(RELAYER_WALLET_PRIVATE_KEY, avaxProvider);

  // bnb provider & wallet
  const bnbProvider = new providers.JsonRpcProvider(BNB_ENDPOINT);
  const bnbWallet = new Wallet(USER_WALLET_PRIVATE_KEY, bnbProvider);
  const bnbRelayerWallet = new Wallet(RELAYER_WALLET_PRIVATE_KEY, bnbProvider);

  // optimism provider & wallet
  const optimismProvider = new providers.JsonRpcProvider(OPTIMISM_ENDPOINT);
  const optimismWallet = new Wallet(USER_WALLET_PRIVATE_KEY, optimismProvider);
  const optimismRelayerWallet = new Wallet(RELAYER_WALLET_PRIVATE_KEY, optimismProvider);

  // polygon provider & wallet
  const polygonProvider = new providers.JsonRpcProvider(POLYGON_ENDPOINT);
  const polygonWallet = new Wallet(USER_WALLET_PRIVATE_KEY, polygonProvider);
  const polygonRelayerWallet = new Wallet(RELAYER_WALLET_PRIVATE_KEY, polygonProvider);

  // nimbleXChain contracts
  const arbitrumnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(ARBITRUM_CHAIN_ID),
    arbitrumWallet
  );
  
  const avaxnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(AVAX_CHAIN_ID),
    avaxWallet
  );

  const bnbnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(BNB_CHAIN_ID),
    bnbWallet
  );

  const optimismnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(OPTIMISM_CHAIN_ID),
    optimismWallet
  );

  const polygonnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(POLYGON_CHAIN_ID),
    polygonWallet
  );

  const arbitrum: Info = {
    provider: arbitrumProvider,
    wallet: arbitrumWallet,
    relayerWallet: arbitrumRelayerWallet,
    wormholeAddress: ARBITRUM_WORMHOLE_ADDRESS,
    bridgeAddress: ARBITRUM_BRIDGE_ADDRESS,
    nimbleXChain: arbitrumnimbleXChain,
    chainId: CHAIN_ID_ARBITRUM,
  }

  const avalanche: Info = {
    provider: avaxProvider,
    wallet: avaxWallet,
    relayerWallet: avaxRelayerWallet,
    wormholeAddress: AVAX_WORMHOLE_ADDRESS,
    bridgeAddress: AVAX_BRIDGE_ADDRESS,
    nimbleXChain: avaxnimbleXChain,
    chainId: CHAIN_ID_AVAX,
  };

  const binance: Info = {
    provider: bnbProvider,
    wallet: bnbWallet,
    relayerWallet: bnbRelayerWallet,
    wormholeAddress: BNB_WORMHOLE_ADDRESS,
    bridgeAddress: BNB_BRIDGE_ADDRESS,
    nimbleXChain: bnbnimbleXChain,
    chainId: CHAIN_ID_BSC,
  };

  const optimism: Info = {
    provider: optimismProvider,
    wallet: optimismWallet,
    relayerWallet: optimismRelayerWallet,
    wormholeAddress: OPTIMISM_WORMHOLE_ADDRESS,
    bridgeAddress: OPTIMISM_BRIDGE_ADDRESS,
    nimbleXChain: optimismnimbleXChain,
    chainId: CHAIN_ID_OPTIMISM,
  };

  const polygon: Info = {
    provider: polygonProvider,
    wallet: polygonWallet,
    relayerWallet: polygonRelayerWallet,
    wormholeAddress: POLYGON_WORMHOLE_ADDRESS,
    bridgeAddress: POLYGON_BRIDGE_ADDRESS,
    nimbleXChain: polygonnimbleXChain,
    chainId: CHAIN_ID_POLYGON,
  };

  const info : {[key: string]: Info} = {
    "Arbitrum": arbitrum,
    "Avalanche": avalanche,
    "Binance": binance,
    "Optimism": optimism,
    "Polygon": polygon,
  };

  return info;
}

export const localBuffer = getInfo();

export async function getRelayerFee(chainName: string, transferAmount: number) {
  const nimbleXChain = localBuffer[chainName].nimbleXChain;
  const feePrecision = await nimbleXChain.getFeePrecision();
  const relayerFeePercentage = await nimbleXChain.getRelayerFeePercentage(await getOverride(chainName));
  const relayerFee: number = transferAmount * relayerFeePercentage / feePrecision;
  return relayerFee;
}

export async function getOverride(chainName: string) {
  let override: ethers.Overrides = {};
  if(chainName == "Polygon" || chainName == "Avalanche") {
    const provider = localBuffer[chainName].provider;
    const baseFee = BigNumber.from((await provider.getBlock(-1)).baseFeePerGas!);
    const maxFee = baseFee.mul(2);
    const maxPriorityFee = BigNumber.from(ethers.utils.parseUnits("31", "gwei"));

    override = {maxFeePerGas: maxFee.toNumber(), maxPriorityFeePerGas: maxPriorityFee.toNumber()};
  }
  return override;
}

export async function transferToken(srcChainName: string, srcTokenAddress: string, targetChainName: string, transferAmount: number, targetWalletAddress: string) {
  const srcWallet = localBuffer[srcChainName].wallet;
  const srcnimbleXChain = localBuffer[srcChainName].nimbleXChain;
  const targetnimbleXChain = localBuffer[targetChainName].nimbleXChain;
  const srcChainId = localBuffer[srcChainName].chainId;
  const targetChainId = localBuffer[targetChainName].chainId;
  const srcWormholeAddress = localBuffer[srcChainName].wormholeAddress;
  const srcBridgeAddress = localBuffer[srcChainName].bridgeAddress;
  const targetRelayerWallet = localBuffer[targetChainName].relayerWallet;
  const decoder = new TextDecoder('utf-8');
  let decodedVAA = null;
  
  const tokenContract = await makeContract(srcWallet, srcTokenAddress, erc20_abi_path);

  const transferAmountN = ethers.utils.parseUnits(
    transferAmount.toString(),
    await tokenContract.decimals()
  );

  const sendReceipt = await srcnimbleXChain
    .sendTokensWithPayload(
      srcTokenAddress,
      transferAmountN,
      targetChainId,
      0,
      "0x" + tryNativeToHexString(targetWalletAddress, targetChainId),
      await getOverride(srcChainName)
    )
    .then(async (tx: ethers.ContractTransaction) => {
      const receipt = await tx.wait();
      return receipt;
    })
    .catch((msg) => {
      console.log(msg);
      return null;
    });
  if(!sendReceipt) {
    console.log("sendTokensWithPayload failed");
    return null;
  }

  const sequence = parseSequenceFromLogEth(sendReceipt!, srcWormholeAddress);
  const emitterAddress = getEmitterAddressEth(srcBridgeAddress);

  const { vaaBytes } = await getSignedVAAWithRetry(
    WORMHOLE_RPC_HOSTS,
    srcChainId,
    emitterAddress,
    sequence,
    {
      transport: NodeHttpTransport(),
    }
  );
  console.log("signed vaa: ", vaaBytes);

  const override = await getOverride(targetChainName);
  const relayerInfo: RelayerInfo = {targetnimbleXChain, targetRelayerWallet, vaaBytes, override};
  const redeemReceipt = await nimbleRelay(relayerInfo);
  if(!redeemReceipt) {
    console.log("redeemTransferWithPayload failed");
    return null;
  }

  decodedVAA = decoder.decode(vaaBytes);
  return {decodedVAA, redeemReceipt};
}

export async function redeemToken(srcChainName: string, srcTokenAddress: string, targetChainName: string, transferAmount: number, targetWalletAddress: string, decodedVAA: string) {
  const targetnimbleXChain = localBuffer[targetChainName].nimbleXChain;
  const targetRelayerWallet = localBuffer[targetChainName].relayerWallet;
  const encoder = new TextEncoder();

  const vaaBytes = encoder.encode(decodedVAA);

  const override = await getOverride(targetChainName);
  const relayerInfo: RelayerInfo = {targetnimbleXChain, targetRelayerWallet, vaaBytes, override};
  const redeemReceipt = await nimbleRelay(relayerInfo);
  if(!redeemReceipt) {
    console.log("redeemTransferWithPayload failed");
    return null;
  }
  return redeemReceipt;
}
