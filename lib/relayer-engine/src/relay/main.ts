import {
  ChainId,
  hexToUint8Array,
} from "@certusone/wormhole-sdk";
import {RelayerEnvironment, validateEnvironment} from "../configureEnv";
import {
  VERSION
} from "./constants";
import {relayEVM, shouldRelay, _parseVaa, shouldRelayVaa} from "./utils";
import {ethers} from "ethers";
import {
  nimbleXChain__factory,
} from "../build/src/ethers-contracts"

const env: RelayerEnvironment = validateEnvironment();

const getChainConfigInfo = (chainId: ChainId) => {
  return env.supportedChains.find((x) => x.chainId === chainId);
};

const validateRequest = async (request: any, response: any) => {
  const chainId = request.body?.targetChain;
  const chainConfigInfo = getChainConfigInfo(chainId);

  if (!chainConfigInfo) {
    return response.status(400).json({error: "Unsupported chainId", chainId});
  }

  const signedVAA = request.body?.signedVAA;
  if (!signedVAA) {
    return response.status(400).json({error: "signedVAA is required"});
  }

  // parse & validate VAA, make sure we want to relay this request
  const vaaInfo = await _parseVaa(hexToUint8Array(signedVAA));
  const vaaInfoString = JSON.stringify(vaaInfo, (key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
  console.log(`parsed VAA info: ${vaaInfoString}`);

  const {shouldRelay: _shouldRelay, msg} = shouldRelayVaa(vaaInfo);
  if (!_shouldRelay) {
    return response.status(400).json({
      error: msg,
      vaaInfo: {
        ...vaaInfo,
        amount: vaaInfo.amount.toString(),
      },
    });
  }

  return {chainConfigInfo, chainId, signedVAA};
};

export const nimbleRelay = async (request: any, response: any): Promise<void> => {
  const destNodeURL = request.body?.destNodeURL;
  if (!destNodeURL) {
    return response.status(400).json({error: "Destination Node URL is required"});
  }

  var userWalletPrivateKey = request.body?.userWalletPrivateKey;
  if (!userWalletPrivateKey) {
    return response.status(400).json({error: "User Wallet Private Key is required"});
  }

  const relayerWalletPrivateKey = request.body?.relayerWalletPrivateKey;
  if (!relayerWalletPrivateKey) {
    return response.status(400).json({error: "Relayer Wallet Private Key iis required"});
  }

  const nimbleContractAddress = request.body?.nimbleContractAddress;
  if (!nimbleContractAddress) {
    return response.status(400).json({error: "nimble ContractAddress is required"});
  }

  const signedVAA = request.body?.signedVAA;
  if (!signedVAA) {
    return response.status(400).json({error: "signedVAA is required"});
  }

  var override = request.body?.override;
  if (!override) {
    override = {};
  }

  // dest wallet
  const destProvider = new ethers.providers.StaticJsonRpcProvider(destNodeURL);
  const destUserWallet = new ethers.Wallet(userWalletPrivateKey, destProvider);
  const destRelayerWallet = new ethers.Wallet(relayerWalletPrivateKey, destProvider);

  // nimbleXChain contract
  const destnimbleXChain = nimbleXChain__factory.connect(
    nimbleContractAddress,
    destUserWallet
  );

  try {
    const receipt = await destnimbleXChain
      .connect(destRelayerWallet)
      .redeemTransferWithPayload(hexToUint8Array(signedVAA), override)
      .then(async (tx: ethers.ContractTransaction) => {
        const receipt = await tx.wait();
        return receipt;
      })
      .catch((msg) => {
        // should not happen
        console.log(msg);
        return null;
      });
    console.log(`nimble Relay Succeed 🎉🎉:txHash: ${receipt!.transactionHash}`);
    console.log(receipt)
    response.status(200).json(receipt);
  } catch (e) {
    console.log(`nimble Relay Failed ❌`);
    console.error(e);
    return response.status(500).json({error: e, msg: "Unable to relay this request."});
  }
};

export const relay = async (request: any, response: any): Promise<void> => {
  const {
    chainConfigInfo,
    chainId,
    signedVAA,
  } = await validateRequest(request, response);

  if (!chainConfigInfo) return;

  const relayInfo = JSON.stringify({chainId, signedVAA});
  console.log(`relaying: ${relayInfo}`);

  try {
    const receipt = await relayEVM(chainConfigInfo, signedVAA);

    console.log(`Relay Succeed 🎉🎉: ${relayInfo}, txHash: ${receipt.transactionHash}`);
    response.status(200).json(receipt);
  } catch (e) {
    console.log(`Relay Failed ❌: ${relayInfo}`);
    console.error(e);
    return response.status(500).json({error: e, msg: "Unable to relay this request."});
  }
};

export const checkShouldRelay = (request: any, response: any): void => {
  const res = shouldRelay(request.query);

  console.log(`checkShouldRelay: ${JSON.stringify({...request.query, ...res})}`);
  response.status(200).json(res);
};

export const getVersion = (request: any, response: any): void => response.status(200).end(VERSION);
