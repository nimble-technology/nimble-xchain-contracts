// SPDX-License-Identifier: Apache 2

pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import {TestERC20} from "../../contracts/token/TestERC20.sol";

contract ContractScript is Script {
    TestERC20 testErc20;

    function deployTestERC20() public {
        // deploy the ERC20 token
        testErc20 = new TestERC20(
            vm.addr(uint256(vm.envBytes32("TEST_USER_WALLET_PRIVATE_KEY"))),
            10, // token decimals
            1e10 // supply
        );
    }

    function run() public {
        // begin sending transactions
        vm.startBroadcast();

        // nimbleXChain.sol
        deployTestERC20();

        // finished
        vm.stopBroadcast();
    }
}
