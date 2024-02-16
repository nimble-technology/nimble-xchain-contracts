#[cfg(not(feature = "library"))]
use cw20::{BalanceResponse, TokenInfoResponse};
use cw20_base::msg::{ExecuteMsg as TokenMsg, QueryMsg as TokenQuery};
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, DepsMut, Env, MessageInfo, Response, Addr, Binary,
    CanonicalAddr, Uint128, QueryRequest, WasmQuery, CosmosMsg, WasmMsg
};
use terraswap::asset::{Asset, AssetInfo};

use cosmwasm_std::StdError;
use crate::utils::{ByteUtils, extend_address_to_32_array};
use crate::error::ContractError;
use crate::msg::{InstantiateMsg};
use crate::wormhole_msg::{
    ExecuteMsg as WormholeExecuteMsg, QueryMsg as WormholeQueryMsg
};
use crate::state::{set_state_info, get_state_info, set_register_emitter, get_register_emitter, StateInfo, PayloadInfo};



#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg
) -> Result<Response, ContractError> {

    assert!(deps.api.addr_validate(msg.wormhole.as_str()).unwrap() == msg.wormhole.as_str(), "invalid Wormhole address");
    assert!(deps.api.addr_validate(msg.token_bridge.as_str()).unwrap() == msg.token_bridge.as_str(), "invalid TokenBridge address");
    assert!(msg.chain_id > 0, "invalid chainId");
    assert!(msg.wormhole_finality > 0, "invalid wormholeFinality");
    assert!(msg.fee_precision > 0, "invalid fee precision");

    let state = StateInfo {
        owner: info.sender.clone(),
        wormhole: msg.wormhole,
        token_bridge: msg.token_bridge,
        chain_id: msg.chain_id,
        wormhole_finality: msg.wormhole_finality,
        fee_precision: msg.fee_precision,
        relayer_fee_percentage: msg.relayer_fee_percentage,
    };
    set_state_info(deps.storage).save(&state)?;

    Ok(Response::default())
}


pub fn send_token_with_payload(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    amount: u128,
    target_chain: u16,
    wormhole_fee: u128,
    target_eecipient: [u8;32],
    denom: String,
) -> () {

    let target_addr = get_register_emitter(deps.storage).load(&target_chain.to_be_bytes()).unwrap();
    let state = get_state_info(deps.storage).load().unwrap();

    let payload = PayloadInfo{
        payload_id: 1, 
        target_recipient: target_addr,
    };
    let asset = Asset{
        info: AssetInfo::NativeToken{denom}, 
        amount: Uint128::from(amount),
    };

    CosmosMsg::<()>::Wasm(WasmMsg::Execute {
        contract_addr: state.wormhole.as_str().to_owned(),
        msg: to_binary(&WormholeExecuteMsg::InitiateTransferWithPayload {
            asset: asset,
            recipient_chain: target_chain,
            recipient: Binary::from(target_addr),
            fee: Uint128::from(wormhole_fee),
            payload: Binary::from(payload.serialize()),
            nonce: 0,
        }).unwrap(),
        funds: vec![],
    });
}



pub fn custody_token(env: Env, deps: DepsMut, info: MessageInfo, token: Addr, amount: u128)  -> u128{
    let prev_balance = get_balance(&deps, token.clone());
    let amount_transfer = Uint128::from(amount);
    CosmosMsg::<()>::Wasm(WasmMsg::Execute {
        contract_addr: token.as_str().to_owned(),
        msg: to_binary(&TokenMsg::TransferFrom {
            owner: info.sender.to_string(),
            recipient: env.contract.address.to_string(),
            amount: amount_transfer,
        }).unwrap(),
        funds: vec![],
    });

    let new_balance = get_balance(&deps, token);
    new_balance - prev_balance
}


pub fn fetch_local_addr_from_transfer_msg(deps: DepsMut, payload: &[u8]) -> Addr {
    let sourcre_addr: [u8; 32] = payload.get_const_bytes::<32>(33);
    let token_chain: u16 = payload.get_u16(65);
    let state = get_state_info(deps.storage).load().unwrap();
    if token_chain > state.chain_id {
        let res: String = deps.querier.query(&QueryRequest::Wasm(WasmQuery::Smart {
            contract_addr: state.wormhole.as_str().to_string(),
            msg: to_binary(&WormholeQueryMsg::WrappedRegistry {
                chain: token_chain,
                address: Binary::from(sourcre_addr),
            }).unwrap(),
        })).unwrap();
        Addr::unchecked(res)
    }
    else {
        bytes32_to_address(deps, sourcre_addr)
    }
}

pub fn calculate_relayer_fee(deps: DepsMut, amount: u128) -> u128 {
    let state = get_state_info(deps.storage).load().unwrap();
    
    let relayer_amount: Uint128 = Uint128::new(amount);
    relayer_amount.multiply_ratio(state.relayer_fee_percentage, state.fee_precision).u128()
}

pub fn address_to_bytes32(deps: DepsMut, address: Addr) -> [u8; 32] {
    extend_address_to_32_array(&(deps.api.addr_canonicalize(address.as_str()).unwrap()))
}


pub fn bytes32_to_address(deps: DepsMut, address: [u8; 32]) -> Addr {
    deps.api.addr_humanize(&CanonicalAddr::from(&address[0..])).unwrap()
}

pub fn get_balance(deps: &DepsMut, addr: Addr) -> u128 {
    let request = QueryRequest::Wasm(WasmQuery::Smart {
        contract_addr: addr.as_str().to_string(),
        msg: to_binary(&TokenQuery::Balance {
            address: addr.as_str().to_string(),
        }).unwrap(),
    });
    let token_info: BalanceResponse = deps.querier.query(&request).unwrap();
    token_info.balance.u128()
}

pub fn get_decimals(deps: DepsMut, addr: Addr) -> u8 {
    let request = QueryRequest::Wasm(WasmQuery::Smart {
        contract_addr: addr.as_str().to_string(),
        msg: to_binary(&TokenQuery::TokenInfo {}).unwrap(),
    });
    let token_info: TokenInfoResponse = deps.querier.query(&request).unwrap();
    token_info.decimals
}

pub fn normalize_amount(amount: u128, decimals: u8) ->  u128{
    let mut denom = 1 as u128;
    if decimals > 8 {
        denom = u128::pow(10, (decimals - 8) as u32 );
    }
    amount/denom
}


pub fn register_emitter(
    info: MessageInfo, 
    deps: DepsMut, 
    emitte_chain_id: u16, 
    emitter_address: [u8; 32],
) -> () {
    let readonly_state_info = get_state_info(deps.storage).load().unwrap();
    let zero_addr: [u8; 32] = [0; 32];
    assert!(is_owner(readonly_state_info.owner, info), "not the owner, permission denied");
    assert!(emitte_chain_id != 0 && emitte_chain_id != readonly_state_info.chain_id, "emitterChainId cannot equal 0 or this chainId");
    assert!(emitter_address != zero_addr, "emitterAddress cannot equal 0");

    set_register_emitter(deps.storage).save(&emitte_chain_id.to_be_bytes(), &emitter_address).ok();
}

pub fn update_relayer_fee(
    info: MessageInfo,
    deps: DepsMut, 
    updated_percentage: u32, 
    updated_precision: u32
) -> () {
    let readonly_state_info = get_state_info(deps.storage).load().unwrap();
    assert!(is_owner(readonly_state_info.owner, info), "not the owner, permission denied");
    assert!(updated_precision > 0,  "precision must be > 0");
    assert!(updated_percentage < updated_precision, "relayer fee percentage must be < precision");

    set_state_info(deps.storage).update(|mut state| -> Result<_, ContractError> {
        state.relayer_fee_percentage = updated_percentage;
        state.fee_precision =  updated_precision;
        Ok(state)
    } ).ok();
}

fn is_owner(owner_addr: Addr, info: MessageInfo) -> bool {
    owner_addr == info.sender.clone()
}
