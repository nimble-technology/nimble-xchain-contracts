import * as wh from "@certusone/wormhole-sdk";
import * as web3 from "@solana/web3.js";
import * as relayerEngine from "relayer-engine";
import {nnull, sleep} from "relayer-engine";
import {WORMHOLE_GUARDIAN_RPC, SOL_SEND_NATIVE_FEE} from "./constants";

let solanaConfig: any;
let polygonConfig: any;
let keypairRaw: any;
let payer: any;
let sequence: string;
let emitterAddress: string;
let transferSignedVAA: Uint8Array;

async function main() {
  console.log(process.argv);
  const configs = await relayerEngine.loadRelayerEngineConfig(
    "./relayer-engine-config",
    relayerEngine.Mode.BOTH,
  );


  solanaConfig = nnull(
    configs.commonEnv.supportedChains.find(
      c => c.chainId === wh.CHAIN_ID_SOLANA,
    ),
  );

  polygonConfig = nnull(
    configs.commonEnv.supportedChains.find(c => c.chainId === wh.CHAIN_ID_POLYGON),
  );

  keypairRaw = JSON.parse(nnull(configs.executorEnv?.privateKeys[1][0]));
  payer = web3.Keypair.fromSecretKey(Buffer.from(keypairRaw));

  await Sol_Send_Native_to_Polygon();
}


async function Sol_Send_Native_to_Polygon() {
  const conn = new web3.Connection(solanaConfig.nodeUrl, {
    commitment: <web3.Commitment>"confirmed",
  });

  console.log("Payer: ", payer.publicKey.toBase58());

  const tx = await wh.transferNativeSol(
    conn,
    nnull(solanaConfig.bridgeAddress),
    nnull(solanaConfig.tokenBridgeAddress),
    payer.publicKey,
    BigInt(SOL_SEND_NATIVE_FEE),
    wh.tryNativeToUint8Array(nnull(polygonConfig.bridgeAddress), wh.CHAIN_ID_POLYGON),
    polygonConfig.chainId,
  );
  tx.partialSign(payer);

  const txSig = await web3.sendAndConfirmRawTransaction(conn, tx.serialize(), {
    skipPreflight: true,
  });
  const rx = nnull(await conn.getTransaction(txSig));
  const seq = wh.parseSequenceFromLogSolana(rx);
  console.log('seq', seq)

  const {vaaBytes: signedVAA} = await wh.getSignedVAAWithRetry(
    WORMHOLE_GUARDIAN_RPC,
    "solana",
    await wh.getEmitterAddressSolana(
      nnull(solanaConfig.tokenBridgeAddress),
    ),
    seq,
  );

  console.log('signedVAA:', Buffer.from(signedVAA).toString('base64'));
  const vaa = wh.parseVaa(signedVAA)
  const payload = wh.parseTransferPayload(vaa.payload)
  console.log('vaa payload', payload)

  sequence = seq;
  transferSignedVAA = signedVAA;
  return;
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
