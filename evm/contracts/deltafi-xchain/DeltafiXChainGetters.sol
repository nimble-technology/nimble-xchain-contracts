// SPDX-License-Identifier: Apache 2
pragma solidity 0.8.16;

import {IWormhole} from "../interfaces/IWormhole.sol";
import {ITokenBridge} from "../interfaces/ITokenBridge.sol";

import "./nimbleXChainSetters.sol";

contract nimbleXChainGetters is nimbleXChainSetters {
    function getOwner() public view returns (address) {
        return _state.owner;
    }

    function getWormhole() public view returns (IWormhole) {
        return IWormhole(_state.wormhole);
    }

    function getTokenBridge() public view returns (ITokenBridge) {
        return ITokenBridge(payable(_state.tokenBridge));
    }

    function getChainId() public view returns (uint16) {
        return _state.chainId;
    }

    function getWormholeFinality() public view returns (uint8) {
        return _state.wormholeFinality;
    }

    function getRegisteredEmitter(uint16 emitterChainId) public view returns (bytes32) {
        return _state.registeredEmitters[emitterChainId];
    }

    function getFeePrecision() public view returns (uint32) {
        return _state.feePrecision;
    }

    function getRelayerFeePercentage() public view returns (uint32) {
        return _state.relayerFeePercentage;
    }
}
