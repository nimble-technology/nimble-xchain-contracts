import {
  Connection,
  PublicKey,
  PublicKeyInitData,
  TransactionInstruction,
} from "@solana/web3.js";
import { createXChainTokenProgramInterface } from "../program";
import { deriveRedeemerConfigKey } from "../accounts";

export async function createUpdateRelayerFeeInstruction(
  connection: Connection,
  programId: PublicKeyInitData,
  payer: PublicKeyInitData,
  relayerFee: number,
  relayerFeePrecision: number
): Promise<TransactionInstruction> {
  const program = createXChainTokenProgramInterface(connection, programId);

  return program.methods
    .updateRelayerFee(relayerFee, relayerFeePrecision)
    .accounts({
      owner: new PublicKey(payer),
      config: deriveRedeemerConfigKey(programId),
    })
    .instruction();
}
