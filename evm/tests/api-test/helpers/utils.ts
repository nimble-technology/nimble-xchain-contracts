import {ethers, Wallet} from "ethers";
import {
  tryNativeToHexString,
} from "@certusone/wormhole-sdk";
import {makeContract} from "../../helpers/io";
import {localBuffer, erc20_abi_path, getOverride} from "../../../ts/api/xchain";

export async function mockApprove(srcChainName: string, userPrivateKey: string, srcTokenAddress: string, transferAmount: number) {
  const provider = localBuffer[srcChainName].provider;
  const wallet = new Wallet(userPrivateKey, provider);

  const tokenContract = await makeContract(wallet, srcTokenAddress, erc20_abi_path);
  const srcnimbleXChain = localBuffer[srcChainName].nimbleXChain;

  const transferAmountN = ethers.utils.parseUnits(
    transferAmount.toString(),
    await tokenContract.decimals()
  );

  // increase allowance
  {
    const receipt = await tokenContract
      .approve(srcnimbleXChain.address, transferAmountN, await getOverride(srcChainName))
      .then((tx: ethers.ContractTransaction) => tx.wait())
      .catch((msg: any) => {
        // should not happen
        console.log(msg);
        return null;
      });
    if(!receipt) {
      console.log("approve failed");
      return null;
    }
  }
}

export async function mockRegister(srcChainName: string, targetChainName: string) {
  const srcnimbleXChain = localBuffer[srcChainName].nimbleXChain;
  const targetnimbleXChain = localBuffer[targetChainName].nimbleXChain;
  const srcChainId = localBuffer[srcChainName].chainId;
  const targetChainId = localBuffer[targetChainName].chainId;
  // src
  {
    const targetContractAddressHex =
      "0x" + tryNativeToHexString(targetnimbleXChain.address, targetChainId);

    // register the emitter
    const receipt = await srcnimbleXChain
      .registerEmitter(targetChainId, targetContractAddressHex, await getOverride(srcChainName))
      .then((tx: ethers.ContractTransaction) => tx.wait())
      .catch((msg: any) => {
        // should not happen
        console.log(msg);
        return null;
      });
    if(!receipt) {
      console.log(`register on ${srcChainName} failed`);
      return null;
    }
  }

  // target
  {
    const targetContractAddressHex =
      "0x" + tryNativeToHexString(srcnimbleXChain.address, srcChainId);

    const receipt = await targetnimbleXChain
      .registerEmitter(srcChainId, targetContractAddressHex, await getOverride(targetChainName))
      .then((tx: ethers.ContractTransaction) => tx.wait())
      .catch((msg: any) => {
        // should not happen
        console.log(msg);
        return null;
      });
    if(!receipt) {
      console.log(`register on ${targetChainName} failed`);
      return null;
    }
  }
}