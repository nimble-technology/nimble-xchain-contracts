// SPDX-License-Identifier: Apache 2
pragma solidity 0.8.16;

contract nimbleXChainStructs {
    struct nimbleXChainMessage {
        // unique identifier for this message type
        uint8 payloadID;
        /**
         * The recipient's wallet address on the target chain, in bytes32
         * format (zero-left-padded if less than 20 bytes).
         */
        bytes32 targetRecipient;
    }
}
