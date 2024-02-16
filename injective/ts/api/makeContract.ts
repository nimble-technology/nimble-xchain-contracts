import {Erc20Contract} from "@injectivelabs/contracts";
import {EthereumChainId} from "@injectivelabs/ts-types";
import Web3 from "web3";
import {INJECTIVE_ENDPOINT} from "../../../constants/constants";

export function makeContract(
    ethereumChainId: EthereumChainId,
    address: string,
): Erc20Contract {
    const web3 = new Web3(new Web3.providers.HttpProvider(INJECTIVE_ENDPOINT));
    return new Erc20Contract({ethereumChainId, web3, address});

}