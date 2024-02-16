import {ethers, Overrides} from "ethers";
import {nimbleXChain} from "../../../build/src/ethers-contracts";


export interface RelayerInfo {
  targetnimbleXChain: nimbleXChain,
  targetRelayerWallet: ethers.Wallet,
  vaaBytes: Uint8Array;
  override: Overrides;
}
