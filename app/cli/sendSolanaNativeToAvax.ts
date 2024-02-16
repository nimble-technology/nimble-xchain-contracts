import * as wh from "@certusone/wormhole-sdk";
import * as web3 from "@solana/web3.js";
import * as relayerEngine from "relayer-engine";
import {nnull, sleep} from "relayer-engine";
import {SOL_SEND_NATIVE_FEE, WORMHOLE_GUARDIAN_RPC} from "./constants"

async function main() {
  console.log(process.argv);
  const configs = await relayerEngine.loadRelayerEngineConfig(
    "./relayer-engine-config",
    relayerEngine.Mode.BOTH,
  );

  const solanaConfig = nnull(
    configs.commonEnv.supportedChains.find(
      c => c.chainId === wh.CHAIN_ID_SOLANA,
    ),
  );
  const avaxConfig = nnull(
    configs.commonEnv.supportedChains.find(c => c.chainId === wh.CHAIN_ID_AVAX),
  );

  const keypairRaw = JSON.parse(nnull(configs.executorEnv?.privateKeys[1][0]));
  const payer = web3.Keypair.fromSecretKey(Buffer.from(keypairRaw));

  const conn = new web3.Connection(solanaConfig.nodeUrl, {
    commitment: <web3.Commitment>"confirmed",
  });

  console.log("Payer: " + payer.publicKey.toBase58());

  conn
    .requestAirdrop(payer.publicKey, 2_000_000_000)
    .catch(e => console.error(e));

  const tx = await wh.transferNativeSol(
    conn,
    nnull(solanaConfig.bridgeAddress),
    nnull(solanaConfig.tokenBridgeAddress),
    payer.publicKey,
    BigInt(SOL_SEND_NATIVE_FEE),
    wh.tryNativeToUint8Array(nnull(avaxConfig.bridgeAddress), 6),
    avaxConfig.chainId,
  );
  tx.partialSign(payer);

  const txSig = await web3.sendAndConfirmRawTransaction(conn, tx.serialize(), {
    skipPreflight: true,
  });
  console.log(txSig);
  const rx = nnull(await conn.getTransaction(txSig));
  const seq = wh.parseSequenceFromLogSolana(rx);
  console.log(seq);


  try {
    const vaa = await wh.getSignedVAAWithRetry(
      WORMHOLE_GUARDIAN_RPC,
      "solana",
      await wh.getEmitterAddressSolana(nnull(solanaConfig.tokenBridgeAddress)),
      seq,
    );
    console.log(vaa);
  } catch (e) {
    console.error(e);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
