use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Storage, StdResult};
use cosmwasm_storage::{
    bucket, bucket_read, Bucket, ReadonlyBucket,
    singleton, singleton_read, Singleton, ReadonlySingleton
};

use crate::utils::ByteUtils;

static STATE_KEY: &[u8] = b"state";
static REGISTER_EMIT_KEY: &[u8] = b"registeredEmitters";

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct StateInfo {
    // owner of this contract
    pub owner: Addr,

    // address of the Wormhole contract on this chain
    pub wormhole: Addr,

    // address of the Wormhole TokenBridge contract on this chain
    pub token_bridge: Addr,
    
    // Wormhole chain ID of this contract
    pub chain_id: u16,
    
    // The number of block confirmations needed before the wormhole network
    // will attest a message.
    pub wormhole_finality: u8,

    // precision of relayer fee percentage
    pub fee_precision: u32,

    // relayer fee in percentage terms
    pub relayer_fee_percentage: u32,
}

pub fn set_state_info(storage: &mut dyn Storage) -> Singleton<StateInfo> {
    singleton(storage, STATE_KEY)
}

pub fn get_state_info(storage: &dyn Storage) -> ReadonlySingleton<StateInfo> {
    singleton_read(storage, STATE_KEY)
}

pub fn set_register_emitter(storage: &mut dyn Storage) -> Bucket<[u8; 32]> {
    bucket(storage, REGISTER_EMIT_KEY)
}

pub fn get_register_emitter(storage: &dyn Storage) -> ReadonlyBucket<[u8; 32]> {
    bucket_read(storage, REGISTER_EMIT_KEY)
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PayloadInfo {
    // unique identifier for this message type
    pub payload_id: u8,
    /**
    * The recipient's wallet address on the target chain, in bytes32
    * format (zero-left-padded if less than 20 bytes).
    */
    pub target_recipient: [u8; 32],
}


impl PayloadInfo {
    pub fn deserialize(data: &Vec<u8>) -> StdResult<Self> {
        let data = data.as_slice();
        let payload_id = data.get_u8(0);
        let target_recipient = data.get_const_bytes::<32>(1);

        Ok(PayloadInfo {
            payload_id,
            target_recipient,
        })
    }
    pub fn serialize(&self) -> Vec<u8> {
        [
            self.payload_id.to_be_bytes().to_vec(),
            self.target_recipient.to_vec(),
        ]
        .concat()
    }
}
