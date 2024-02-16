import {
    ChainId,
    getEmitterAddressEth,
    getSignedVAAWithRetry,
    parseSequenceFromLogEth,
    tryNativeToHexString,
} from "@certusone/wormhole-sdk";
import {
    INJECTIVE_BRIDGE_ADDRESS,
    INJECTIVE_CHAIN_ID,
    INJECTIVE_ENDPOINT,
    INJECTIVE_WORMHOLE_ADDRESS,
    USER_WALLET_PRIVATE_KEY,
    WORMHOLE_RPC_HOSTS,
} from "../../../constants/constants";
import {TextDecoder} from "util";
import {WORMHOLE_CHAINS} from "@injectivelabs/bridge-ts";
import {getGrpcTransport} from "@injectivelabs/sdk-ts";
import {ChainName, coalesceChainId,} from '@injectivelabs/wormhole-sdk'
import {ethers, providers, Wallet} from "ethers";
import {makeContract} from "./io";
import {nimbleRelay, RelayerInfo} from "./relay";

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
    // injective provider & wallet
    const injectiveProvider = new providers.JsonRpcProvider(INJECTIVE_ENDPOINT);
    const injectiveWallet = new Wallet(USER_WALLET_PRIVATE_KEY, injectiveProvider);
    const injectiveRelayerWallet = new Wallet(USER_WALLET_PRIVATE_KEY, injectiveProvider);

    // nimbleXChain contracts
    // TODO: change to injective own contracts
    const injectivenimbleXChain = nimbleXChain__factory.connect(
        readnimbleXChainContractAddress(INJECTIVE_CHAIN_ID),
        injectiveWallet
    );

    const injective: Info = {
        provider: injectiveProvider,
        wallet: injectiveWallet,
        relayerWallet: injectiveRelayerWallet,
        wormholeAddress: INJECTIVE_WORMHOLE_ADDRESS,
        bridgeAddress: INJECTIVE_BRIDGE_ADDRESS,
        nimbleXChain: injectivenimbleXChain,
        chainId: INJECTIVE_CHAIN_ID,
    }

    const info: { [key: string]: Info } = {
        "Injective": injective,
    };

    return info;
}

export const localBuffer = getInfo();

export async function transferToken(srcChainName: string,
                                    srcTokenAddress: string,
                                    targetChainName: ChainName,
                                    transferAmount: number,
                                    targetWalletAddress: string) {
    const decoder = new TextDecoder('utf-8');
    let decodedVAA = null;
    const srcBridgeAddress = localBuffer[srcChainName].bridgeAddress;
    const srcnimbleXChain = localBuffer[srcChainName].nimbleXChain;
    const srcWallet = localBuffer[srcChainName].wallet;
    const srcWormholeAddress = localBuffer[srcChainName].wormholeAddress;
    const targetChainId = coalesceChainId(targetChainName);
    const targetnimbleXChain = localBuffer[targetChainName].nimbleXChain;
    const targetRelayerWallet = localBuffer[targetChainName].relayerWallet;

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
            "0x" + tryNativeToHexString(targetWalletAddress, targetChainId)
        )
        .then(async (tx: ethers.ContractTransaction) => {
            const receipt = await tx.wait();
            return receipt;
        })
        .catch((msg) => {
            console.log(msg);
            return null;
        });
    if (!sendReceipt) {
        console.log("sendTokensWithPayload failed");
        return null;
    }

    const sequence = parseSequenceFromLogEth(sendReceipt!, srcWormholeAddress);
    const emitterAddress = getEmitterAddressEth(srcBridgeAddress);

    const {vaaBytes} = await getSignedVAAWithRetry(
        WORMHOLE_RPC_HOSTS,
        WORMHOLE_CHAINS.injective,
        emitterAddress,
        sequence,
        {
            transport: getGrpcTransport(),
        }
    );
    console.log("signed vaa: ", vaaBytes);

    const relayerInfo: RelayerInfo = {targetnimbleXChain, targetRelayerWallet, vaaBytes};
    const redeemReceipt = await nimbleRelay(relayerInfo);
    if (!redeemReceipt) {
        console.log("redeemTransferWithPayload failed");
        return null;
    }

    decodedVAA = decoder.decode(vaaBytes);
    return {decodedVAA, redeemReceipt};

}
