use anchor_lang::{AnchorDeserialize, AnchorSerialize};
use std::io;
use wormhole_anchor_sdk::token_bridge;

const PAYLOAD_ID_nimble: u8 = 1;

#[derive(Clone, Copy)]
/// Expected message types for this program. Only valid payloads are:
/// * `Payload`: Payload ID == 1.
///
/// Payload IDs are encoded as u8.
pub enum XChainMessage {
    Payload { recipient: [u8; 32] },
}

impl AnchorSerialize for XChainMessage {
    fn serialize<W: io::Write>(&self, writer: &mut W) -> io::Result<()> {
        match self {
            XChainMessage::Payload { recipient } => {
                PAYLOAD_ID_nimble.serialize(writer)?;
                recipient.serialize(writer)
            }
        }
    }
}

impl AnchorDeserialize for XChainMessage {
    fn deserialize(buf: &mut &[u8]) -> io::Result<Self> {
        match buf[0] {
            PAYLOAD_ID_nimble => Ok(XChainMessage::Payload {
                recipient: <[u8; 32]>::deserialize(&mut &buf[1..33])?,
            }),
            _ => Err(io::Error::new(
                io::ErrorKind::InvalidInput,
                "invalid payload ID",
            )),
        }
    }
}

pub type PostedXChainMessage = token_bridge::PostedTransferWith<XChainMessage>;

#[cfg(test)]
pub mod test {
    use super::*;
    use anchor_lang::prelude::{Pubkey, Result};
    use std::mem::size_of;

    #[test]
    fn test_message_alive() -> Result<()> {
        let recipient = Pubkey::new_unique().to_bytes();
        let msg = XChainMessage::Payload { recipient };

        // Serialize program ID above.
        let mut encoded = Vec::new();
        msg.serialize(&mut encoded)?;

        assert_eq!(encoded.len(), size_of::<[u8; 32]>() + size_of::<u8>());

        // Verify Payload ID.
        assert_eq!(encoded[0], PAYLOAD_ID_nimble);

        // Verify Program ID.
        let mut encoded_recipient = [0u8; 32];
        encoded_recipient.copy_from_slice(&encoded[1..33]);
        assert_eq!(encoded_recipient, recipient);

        // Now deserialize the encoded message.
        let XChainMessage::Payload {
            recipient: decoded_recipient,
        } = XChainMessage::deserialize(&mut encoded.as_slice())?;
        assert_eq!(decoded_recipient, recipient);

        Ok(())
    }
}
