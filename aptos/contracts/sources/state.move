module nimble_xchain::state{
    #[test_only]
    friend nimble_xchain::state_test;

    // resource
    struct NimbleState has key, drop {
        // owner of this contract
        owner: address,

        // address of the Wormhole contract on this chain
        wormhole: address,

        // address of the Wormhole Token_bridge contract on this chain
        token_bridge: address,

        // Wormhole chain ID of this contract
        chain_id: u64,

        // The number of block confirmations needed before the wormhole network
        // will attest a message.
        wormhole_finality: u8,

        // precision of relayer fee percentage
        fee_precision: u64,

        // relayer fee in percentage terms
        relayer_fee_percentage: u64,
    }
    
    //create state struct type
    public(friend) fun create(
        owner: address,
        wormhole: address,
        token_bridge: address,
        chain_id: u64,
        wormhole_finality: u8,
        fee_precision: u64,
        relayer_fee_percentage: u64,
    ): NimbleState {
        NimbleState{
            owner,
            wormhole,
            token_bridge,
            chain_id,
            wormhole_finality,
            fee_precision,
            relayer_fee_percentage,
        }
    }

    // getters
    public fun get_owner(state: &NimbleState): address{
        state.owner
    }

    public fun get_wormhole(state: &NimbleState): address {
       state.wormhole
    }

    public fun get_token_bridge(state: &NimbleState): address {
        state.token_bridge
    }

    public fun get_chain_id(state: &NimbleState): u64 {
        state.chain_id
    }

    public fun get_wormhole_finality(state: &NimbleState): u8 {
        state.wormhole_finality
    }

    public fun get_fee_precision(state: &NimbleState): u64 {
        state.fee_precision
    }

    public fun get_relayer_fee_percentage(state: &NimbleState): u64{
        state.relayer_fee_percentage
    }

    // setters
    public fun set_owner(state: NimbleState, owner:address): NimbleState{
        state.owner = owner;
        state
    }

    public fun set_wormhole(state: NimbleState, wormhole: address): NimbleState{
        state.wormhole = wormhole;
        state
    }

    public fun set_token_bridge(state: NimbleState, token_bridge: address): NimbleState{
        state.token_bridge = token_bridge;
        state
    }

    public fun set_chain_id(state: NimbleState, chain_id: u64): NimbleState{
        state.chain_id = chain_id;
        state
    }

    public fun set_wormhole_finality(state: NimbleState, wormhole_finality: u8): NimbleState{
        state.wormhole_finality = wormhole_finality;
        state
    }

    public fun set_fee_precision(state: NimbleState, fee_precision: u64): NimbleState{
        state.fee_precision = fee_precision;
        state
    }

    public fun set_relayer_fee_percentage(state: NimbleState, relayer_fee_percentage: u64): NimbleState{
        state.relayer_fee_percentage = relayer_fee_percentage;
        state
    }
}

#[test_only]
module nimble_xchain::state_test{
    use nimble_xchain::state;

    // ERROR NUMBER
    const EN_GET_OWNER:u64= 1;
    const EN_GET_WORMHOLE:u64 = 2;
    const EN_GET_TOKEN_BRIDGE:u64 = 3;
    const EN_GET_CHAIN_ID:u64 = 4;
    const EN_GET_WORMHOLE_FINALITY:u64 = 5;
    const EN_GET_FEE_PRECISION:u64 = 6;
    const EN_GET_RELAYER_FEE_PERCENTAGE:u64 = 7;
    const EN_SET_OWNER:u64= 8;
    const EN_SET_WORMHOLE:u64 = 9;
    const EN_SET_TOKEN_BRIDGE:u64 = 10;
    const EN_SET_CHAIN_ID:u64 = 11;
    const EN_SET_WORMHOLE_FINALITY:u64 = 12;
    const EN_SET_FEE_PRECISION:u64 = 13;
    const EN_SET_RELAYER_FEE_PERCENTAGE:u64 = 14;

    //test getters 
    #[test]
    public fun test_get_owner(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_owner(&state) == @0x1, EN_GET_OWNER);
    }

    #[test]
    #[expected_failure(abort_code = 1, location=nimble_xchain::state_test)]
    public fun test_get_owner_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_owner(&state) == @0x2, EN_GET_OWNER);
    }

    #[test]
    public fun test_get_wormhole(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_wormhole(&state) == @0x1, EN_GET_WORMHOLE);
    }

    #[test]
    #[expected_failure(abort_code = 2, location=nimble_xchain::state_test)]
    public fun test_get_wormhole_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_wormhole(&state) == @0x2, EN_GET_WORMHOLE);
    }

    #[test]
    public fun test_get_token_bridge(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_token_bridge(&state) == @0x1, EN_GET_TOKEN_BRIDGE);
    }

    #[test]
    #[expected_failure(abort_code = 3, location=nimble_xchain::state_test)]
    public fun test_get_token_bridge_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_token_bridge(&state) == @0x2, EN_GET_TOKEN_BRIDGE);
    }

    #[test]
    public fun test_get_chain_id(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_chain_id(&state) == 0, EN_GET_CHAIN_ID);
    }

    #[test]
    #[expected_failure(abort_code = 4, location=nimble_xchain::state_test)]
    public fun test_get_chain_id_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_chain_id(&state) == 1, EN_GET_CHAIN_ID);
    }

    #[test]
    public fun test_get_wormhole_finality(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_wormhole_finality(&state) == 0, EN_GET_WORMHOLE_FINALITY);
    }

    #[test]
    #[expected_failure(abort_code = 5, location=nimble_xchain::state_test)]
    public fun test_get_wormhole_finality_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_wormhole_finality(&state) == 1, EN_GET_WORMHOLE_FINALITY);
    }

    #[test]
    public fun test_get_fee_precision(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_fee_precision(&state) == 0, EN_GET_FEE_PRECISION);
    }

    #[test]
    #[expected_failure(abort_code = 6, location=nimble_xchain::state_test)]
    public fun test_get_fee_precision_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_fee_precision(&state) == 1, EN_GET_FEE_PRECISION);
    }

    #[test]
    public fun test_get_relayer_fee_percentage(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_relayer_fee_percentage(&state) == 0, EN_GET_RELAYER_FEE_PERCENTAGE);
    }

    #[test]
    #[expected_failure(abort_code = 7, location=nimble_xchain::state_test)]
    public fun test_get_relayer_fee_percentage_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        assert!(state::get_relayer_fee_percentage(&state) == 1, EN_GET_RELAYER_FEE_PERCENTAGE);
    }

    // test setters
    #[test]
    public fun test_set_owner(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_owner(state, @0x2);
        assert!(state::get_owner(&state) == @0x2, EN_SET_OWNER);
    }

    #[test]
    #[expected_failure(abort_code = 8, location=nimble_xchain::state_test)]
    public fun test_set_owner_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_owner(state, @0x2);
        assert!(state::get_owner(&state) == @0x3, EN_SET_OWNER);
    }

    #[test]
    public fun test_set_wormhole(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_wormhole(state, @0x2);
        assert!(state::get_wormhole(&state) == @0x2, EN_SET_WORMHOLE);
    }

    #[test]
    #[expected_failure(abort_code = 9, location=nimble_xchain::state_test)]
    public fun test_set_wormhole_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_wormhole(state, @0x2);
        assert!(state::get_wormhole(&state) == @0x3, EN_SET_WORMHOLE);
    }

    #[test]
    public fun test_set_token_bridge(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_token_bridge(state, @0x2);
        assert!(state::get_token_bridge(&state) == @0x2, EN_SET_TOKEN_BRIDGE);
    }

    #[test]
    #[expected_failure(abort_code = 10, location=nimble_xchain::state_test)]
    public fun test_set_token_bridge_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_token_bridge(state, @0x2);
        assert!(state::get_token_bridge(&state) == @0x3, EN_SET_TOKEN_BRIDGE);
    }

    #[test]
    public fun test_set_chain_id(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_chain_id(state, 1);
        assert!(state::get_chain_id(&state) == 1, EN_SET_CHAIN_ID);
    }

    #[test]
    #[expected_failure(abort_code = 11, location=nimble_xchain::state_test)]
    public fun test_set_chain_id_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_chain_id(state, 1);
        assert!(state::get_chain_id(&state) == 2, EN_SET_CHAIN_ID);
    }

    #[test]
    public fun test_set_wormhole_finality(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_wormhole_finality(state, 1);
        assert!(state::get_wormhole_finality(&state) == 1, EN_SET_WORMHOLE_FINALITY);
    }

    #[test]
    #[expected_failure(abort_code = 12, location=nimble_xchain::state_test)]
    public fun test_set_wormhole_finality_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_wormhole_finality(state, 1);
        assert!(state::get_wormhole_finality(&state) == 2, EN_SET_WORMHOLE_FINALITY);
    }

    #[test]
    public fun test_set_fee_precision(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_fee_precision(state, 1);
        assert!(state::get_fee_precision(&state) == 1, EN_SET_FEE_PRECISION);
    }

    #[test]
    #[expected_failure(abort_code = 13, location=nimble_xchain::state_test)]
    public fun test_set_fee_precision_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_fee_precision(state, 1);
        assert!(state::get_fee_precision(&state) == 2, EN_SET_FEE_PRECISION);
    }

    #[test]
    public fun test_set_relayer_fee_percentage(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_relayer_fee_percentage(state, 1);
        assert!(state::get_relayer_fee_percentage(&state) == 1, EN_SET_RELAYER_FEE_PERCENTAGE);
    }

    #[test]
    #[expected_failure(abort_code = 14, location=nimble_xchain::state_test)]
    public fun test_set_relayer_fee_percentage_failure(){
        let state = state::create(@0x1,@0x1,@0x1,0,0,0,0);
        state = state::set_relayer_fee_percentage(state, 1);
        assert!(state::get_relayer_fee_percentage(&state) == 2, EN_SET_RELAYER_FEE_PERCENTAGE);
    }
}
