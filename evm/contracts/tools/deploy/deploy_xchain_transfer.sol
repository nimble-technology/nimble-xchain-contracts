// SPDX-License-Identifier: Apache 2

pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console.sol";

import {IWormhole} from "../../../contracts/interfaces/IWormhole.sol";
import {nimbleXChain} from "../../../contracts/nimble-xchain/nimbleXChain.sol";

contract ContractScript is Script {
    IWormhole wormhole;
    nimbleXChain nimbleXChain;

    function setUp() public {
        wormhole = IWormhole(vm.envAddress("WORMHOLE_CORE_CONTRACT_ADDRESS"));
    }

    function deploynimbleXChain() public {
        // deploy the HelloWorld contract
        nimbleXChain = new nimbleXChain(
            address(wormhole),
            vm.envAddress("WORMHOLE_TOKEN_BRIDGE_CONTRACT_ADDRESS"),
            wormhole.chainId(),
            1, // wormholeFinality
            1e6, // feePrecision
            10000 // relayerFee (percentage terms)
        );
    }

    function run() public {
        // begin sending transactions
        vm.startBroadcast();

        // nimbleXChain.sol
        deploynimbleXChain();

        // finished
        vm.stopBroadcast();
    }
}
