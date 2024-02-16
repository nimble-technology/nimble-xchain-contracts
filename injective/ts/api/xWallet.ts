import {WalletStrategy} from '@injectivelabs/wallet-ts'
import {ChainId, EthereumChainId} from "@injectivelabs/ts-types";
import {ETHEREUM_ENDPOINT} from "../../../constants/constants";

export function getAddress() {
    const walletStrategy = new WalletStrategy({
        chainId: ChainId.Mainnet,
        ethereumOptions: {
            ethereumChainId: EthereumChainId.Mainnet,
            rpcUrl: ETHEREUM_ENDPOINT,
            wsRpcUrl: "wss://empty-light-dust.quiknode.pro/ebd6400050ca2a15bc0d5b110a1310cb6655f03f/",
        }
    });
    return walletStrategy.getAddresses();

}

