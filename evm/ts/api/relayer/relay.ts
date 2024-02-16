import {RelayerInfo} from "./utils";
import {ethers} from "ethers";
import {retryAsync} from "ts-retry";

export const nimbleRelay = async (relayerInfo: RelayerInfo): Promise<any> => {
  const {
    targetnimbleXChain,
    targetRelayerWallet,
    vaaBytes,
    override
  } = relayerInfo;

  // nimbleXChain contract

  const result = await retryAsync(
    async() => {
      const redeemReceipt = await targetnimbleXChain
        .connect(targetRelayerWallet) // change signer
        .redeemTransferWithPayload(vaaBytes, override)
        .then(async (tx: ethers.ContractTransaction) => {
          const receipt = await tx.wait();
          return receipt;
        })
        .catch((msg) => {
          console.log(msg);
          return null;
        });
      if(redeemReceipt) return redeemReceipt;
    },
    { delay: 3000, maxTry: 20, until: (redeemReceipt) => {return redeemReceipt != null}}
  );
  return result;
};
