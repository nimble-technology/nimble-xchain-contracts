// SPDX-License-Identifier: Apache 2
pragma solidity 0.8.16;

import "./nimbleXChainGetters.sol";

contract nimbleXChainGovernance is nimbleXChainGetters {
    event TrackingRelayerFee(
        string message,
        uint32 fromFeePrecision,
        uint32 fromFeePercentage,
        uint32 toFeePrecision,
        uint32 toFeePercentage
    );

    /**
     * @notice Registers foreign emitters (nimbleXChain contracts) with this contract
     * @dev Only the deployer (owner) can invoke this method
     * @param emitterChainId Wormhole chainId of the contract being registered.
     * See https://book.wormhole.com/reference/contracts.html for more information.
     * @param emitterAddress 32-byte address of the contract being registered. For EVM
     * contracts the first 12 bytes should be zeros.
     */
    function registerEmitter(
        uint16 emitterChainId,
        bytes32 emitterAddress
    ) public onlyOwner {
        // sanity check the emitterChainId and emitterAddress input values
        require(
            emitterChainId != 0 && emitterChainId != getChainId(),
            "emitterChainId cannot equal 0 or this chainId"
        );
        require(
            emitterAddress != bytes32(0),
            "emitterAddress cannot equal bytes32(0)"
        );

        // update the registeredEmitters state variable
        setEmitter(emitterChainId, emitterAddress);
    }

    /**
     * @notice Updates the relayer fee percentage and precision
     * @dev Only the deployer (owner) can invoke this method
     * @param updatedPercentage The percentage of each transfer that is
     * rewarded to the relayer.
     * @param updatedPrecision The precision of the relayer fee
     */
    function updateRelayerFee(
        uint32 updatedPercentage,
        uint32 updatedPrecision
    ) public onlyOwner {
        require(updatedPrecision > 0, "precision must be > 0");
        require(
            updatedPercentage < updatedPrecision,
            "relayer fee percentage must be < precision"
        );

        uint32 fromFeePrecision = getFeePrecision();
        uint32 fromFeePercentage = getRelayerFeePercentage();
        uint32 toFeePrecision = updatedPrecision;
        uint32 toFeePercentage = updatedPercentage;

        setRelayerFeePercentage(updatedPercentage);
        setFeePrecision(updatedPrecision);

        emit TrackingRelayerFee("Update Relayer Fee", fromFeePrecision, fromFeePercentage, toFeePrecision, toFeePercentage);
    }

    modifier onlyOwner() {
        require(getOwner() == msg.sender, "caller not the owner");
        _;
    }
}
