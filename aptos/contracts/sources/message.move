module nimble_xchain::message{
    #[test_only]
    friend nimble_xchain::message_test;

    // resource
    struct NimbleMessage has key, drop {
        // id of the current payload
        payload_id: u8,

        // address of the target recipient
        target_recipient: address,
    }

    //create message struct type
    public(friend) fun create(
        payload_id: u8,
        target_recipient: address,
    ): NimbleMessage {
        NimbleMessage{
            payload_id,
            target_recipient,
        }
    }

    // getters
    public fun get_payload_id(msg: &NimbleMessage): u8{
        msg.payload_id
    }

    public fun get_target_recipient(msg: &NimbleMessage): address{
        msg.target_recipient
    }

    // setters
    public fun set_payload_id(msg: NimbleMessage, payload_id:u8): NimbleMessage {
       msg.payload_id = payload_id;
       msg
    }

    public fun set_target_recipient(msg: NimbleMessage, target_recipient: address): NimbleMessage{
        msg.target_recipient = target_recipient;
        msg
    }
}

#[test_only]
module nimble_xchain::message_test{
    use nimble_xchain::message;

    // ERROR NUMBER
    const EN_GET_PAYLOAD_ID:u64 = 1;
    const EN_GET_TARGET_RECIPIENT:u64 = 2;
    const EN_SET_PAYLOAD_ID:u64 = 3;
    const EN_SET_TARGET_RECIPIENT:u64 = 4;

    // test getters
    #[test]
    public fun test_get_payload_id(){
        let msg = message::create(0, @0x1);
        assert!(message::get_payload_id(&msg) == 0, EN_GET_PAYLOAD_ID);
    }

    #[test]
    #[expected_failure(abort_code = 1, location=nimble_xchain::message_test)]
    public fun test_get_payload_id_failure(){
        let msg = message::create(0, @0x1);
        assert!(message::get_payload_id(&msg) == 1, EN_GET_PAYLOAD_ID);
    }

    #[test]
    public fun test_get_target_recipient(){
        let msg = message::create(0, @0x1);
        assert!(message::get_target_recipient(&msg) == @0x1, EN_GET_TARGET_RECIPIENT);
    }

    #[test]
    #[expected_failure(abort_code = 2, location=nimble_xchain::message_test)]
    public fun test_get_target_recipient_failure(){
        let msg = message::create(0, @0x1);
        assert!(message::get_target_recipient(&msg) == @0x2, EN_GET_TARGET_RECIPIENT);
    }

    // test setters
    #[test]
    public fun test_set_payload_id(){
        let msg = message::create(0, @0x1);
        msg = message::set_payload_id(msg, 1);
        assert!(message::get_payload_id(&msg) == 1, EN_SET_PAYLOAD_ID);
    }

    #[test]
    #[expected_failure(abort_code = 3, location=nimble_xchain::message_test)]
    public fun test_set_payload_id_failure(){
        let msg = message::create(0, @0x1);
        msg = message::set_payload_id(msg, 1);
        assert!(message::get_payload_id(&msg) == 2, EN_SET_PAYLOAD_ID);
    }

    #[test]
    public fun test_set_target_recipient(){
        let msg = message::create(0, @0x1);
        msg = message::set_target_recipient(msg, @0x2);
        assert!(message::get_target_recipient(&msg) == @0x2, EN_SET_TARGET_RECIPIENT);
    }

    #[test]
    #[expected_failure(abort_code = 4, location=nimble_xchain::message_test)]
    public fun test_set_target_recipient_failure(){
        let msg = message::create(0, @0x1);
        msg = message::set_target_recipient(msg, @0x2);
        assert!(message::get_target_recipient(&msg) == @0x3, EN_SET_TARGET_RECIPIENT);
    }
}
