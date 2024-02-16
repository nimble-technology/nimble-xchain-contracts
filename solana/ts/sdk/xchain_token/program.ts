import { Connection, PublicKeyInitData, PublicKey } from "@solana/web3.js";
import { Program, Provider } from "@project-serum/anchor";

import { XchainToken } from "../../../target/types/xchain_token";

import IDL from "../../../target/idl/xchain_token.json";

export function createXChainTokenProgramInterface(
  connection: Connection,
  programId: PublicKeyInitData,
  payer?: PublicKeyInitData
): Program<XchainToken> {
  const provider: Provider = {
    connection,
    publicKey: payer == undefined ? undefined : new PublicKey(payer),
  };
  return new Program<XchainToken>(
    IDL as any,
    new PublicKey(programId),
    provider
  );
}
