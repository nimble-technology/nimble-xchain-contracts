use cosmwasm_std::{Addr};

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

/// Represent the external view of a token address.
/// This is the value that goes into the VAA.
///
/// When given an external 32 byte address, there are 3 options:
/// I. This is a token native to this chain
///     a. it's a token managed by the Bank cosmos module
///     (e.g. the staking denom "uluna" on Terra)
///     b. it's a CW20 token
/// II. This is a token address from another chain
///
/// Thus, interpreting an external token id requires knowing whether the token
/// in question originates from this chain, or another chain. This information
/// will always be available from the context.
///
/// I. //////////////////////////////////////////////////////////////////////////
///
/// In the first case (native tokens), the layout of is the following:
///
///  | 1 byte |                          31 bytes                               |
///  +--------+-----------------------------------------------------------------+
///  | MARKER |                           HASH                                  |
///  +--------+-----------------------------------------------------------------+
///
/// The left-most byte (MARKER) tells us whether it's a Bank token (1), or a CW20 (0).
/// Since denom names can be arbitarily long, and CW20 addresses are 32 byes, we
/// cannot directly encode them into the remaining 31 bytes. Instead, we hash
/// the data (either the denom or the CW20 address), and put the last 31 bytes
/// of the hash into the address (HASH). In particular, this choice reduces the
/// space of the hash function by 8 bits, but assuming the hash is resistant to
/// differential attacks, we consider giving up on these 8 bits safe.
///
/// In order to be able to recover the denom and the contract address later, we
/// store a mapping from these 32 bytes (MARKER+HASH) to denoms and CW20
/// addresses (c.f. [`native_cw20_hashes`] & [`bank_token_hashes`] in state.rs)
///
/// II. /////////////////////////////////////////////////////////////////////////
///
/// In the second case (foreign tokens), the whole 32 bytes correspond to the
/// external token address. In this case, the corresponding token will be a
/// wrapped asset, whose address is stored in storage as a mapping (c.f.
/// [`wrapped_asset`] in state.rs)
///
///    (chain_id, external_id) => wrapped_asset_address
///
/// For internal consumption of these addresses, we first convert them to
/// [`TokenId`] (see below).
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[repr(transparent)]
pub struct ExternalTokenId {
    bytes: [u8; 32],
}

/// Internal view of an address. This type is similar to [`AssetInfo`], but more
/// granular. We do differentiate between bank tokens and CW20 tokens, but in
/// the latter case, we further differentiate between native CW20s and wrapped
/// CW20s (see [`ContractId`]).
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub enum TokenId {
    Bank { denom: String },
    Contract(ContractId),
}

/// A contract id is either a native cw20 address, or a foreign token. The
/// reason we represent the foreign address here instead of storing the wrapped
/// CW20 contract's address directly is that the wrapped asset might not be
/// deployed yet.
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub enum ContractId {
    NativeCW20 {
        contract_address: Addr,
    },
    /// A wrapped token might not exist yet.
    ForeignToken {
        chain_id: u16,
        foreign_address: [u8; 32],
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[repr(transparent)]
pub struct WrappedCW20 {
    pub human_address: Addr,
}
