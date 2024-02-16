// SPDX-License-Identifier: Apache 2
pragma solidity 0.8.16;

import "../libraries/BytesLib.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./nimbleXChainStructs.sol";

contract nimbleXChainMessages is nimbleXChainStructs {
    using BytesLib for bytes;

    /**
     * @notice Encodes the nimbleXChainMessage struct into bytes
     * @param parsedMessage nimbleXChainMessage struct
     * @return encodedMessage nimbleXChainMessage struct encoded into bytes
     */
    function encodePayload(
        nimbleXChainMessage memory parsedMessage
    ) public pure returns (bytes memory encodedMessage) {
        encodedMessage = abi.encodePacked(
            parsedMessage.payloadID, // payloadID = 1
            parsedMessage.targetRecipient
        );
    }

    /**
     * @notice Decodes bytes into nimbleXChainMessage struct
     * @dev reverts if:
     * - the message payloadID is not 1
     * - the encodedMessage length is incorrect
     * @param encodedMessage encoded nimbleXChain message
     * @return parsedMessage nimbleXChainMessage struct
     */
    function decodePayload(
        bytes memory encodedMessage
    ) public pure returns (nimbleXChainMessage memory parsedMessage) {
        uint256 index = 0;
        bool flag;
        uint256 value;

        // parse payloadId
        parsedMessage.payloadID = encodedMessage.toUint8(index);
        require(parsedMessage.payloadID == 1, "invalid payloadID");
        (flag, value) = SafeMath.tryAdd(index, 1);
        require(flag == true, "Add failed");
        index = value;

        // target wallet recipient
        parsedMessage.targetRecipient = encodedMessage.toBytes32(index);
        (flag, value) = SafeMath.tryAdd(index, 32);
        require(flag == true, "Add failed");
        index = value;

        // confirm that the payload was the expected size
        require(index == encodedMessage.length, "invalid payload length");
    }
}
