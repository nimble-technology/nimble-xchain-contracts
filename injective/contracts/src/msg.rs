use schemars::JsonSchema;
use cosmwasm_std::Addr;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
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
