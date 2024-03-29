// SPDX-License-Identifier: Apache 2

pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import {WormUSD} from "../../contracts/token/WormUSD.sol";

contract ContractScript is Script {
    WormUSD wormUsd;

    function deployWormUSD() public {
        // deploy the ERC20 token
        wormUsd = new WormUSD(
            vm.addr(uint256(vm.envBytes32("TEST_USER_WALLET_PRIVATE_KEY"))),
            6, // token decimals
            1e9 // supply
        );
    }

    function run() public {
        // begin sending transactions
        vm.startBroadcast();

        // nimbleXChain.sol
        deployWormUSD();

        // finished
        vm.stopBroadcast();
    }
}
