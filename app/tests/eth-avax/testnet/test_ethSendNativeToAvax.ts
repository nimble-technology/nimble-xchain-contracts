import {expect} from "chai";
import {ethers} from "ethers";
import {MockGuardians} from "@certusone/wormhole-sdk/lib/cjs/mock";
import {
  CHAIN_ID_ETH,
  CHAIN_ID_AVAX,
  tryNativeToHexString, uint8ArrayToHex,
} from "@certusone/wormhole-sdk";
import {
  AVAX_HOST,
  AVAX_WORMHOLE_ADDRESS,
  AVAX_BRIDGE_ADDRESS,
  AVAX_WORMHOLE_GUARDIAN_SET_INDEX,
  FORK_AVAX_CHAIN_ID,
  ETH_HOST,
  ETH_WORMHOLE_ADDRESS,
  ETH_BRIDGE_ADDRESS,
  FORK_ETH_CHAIN_ID,
  USER_WALLET_PRIVATE_KEY,
  RELAYER_WALLET_PRIVATE_KEY,
  GUARDIAN_PRIVATE_KEY,
} from "./constants";
import {
  formatWormholeMessageFromReceipt,
  readWormUSDContractAddress,
  readnimbleXChainContractAddress,
  tokenBridgeDenormalizeAmount,
  tokenBridgeNormalizeAmount,
} from "../../helpers/utils";
import {
  nimbleXChain__factory,
  ITokenBridge__factory,
  IWormhole__factory,
} from "../../../build/src/ethers-contracts";
import {makeContract} from "../../helpers/io";
import {IWETH__factory} from "@certusone/wormhole-sdk/lib/cjs/ethers-contracts";
import axios from "axios";
import {nimble_RELAY_URL} from "../../relay/constants";

describe("AVAX ETH Transfer Test", () => {
  // avax wallet
  const avaxProvider = new ethers.providers.StaticJsonRpcProvider(AVAX_HOST);
  const avaxWallet = new ethers.Wallet(USER_WALLET_PRIVATE_KEY, avaxProvider);
  const avaxRelayerWallet = new ethers.Wallet(
    RELAYER_WALLET_PRIVATE_KEY,
    avaxProvider,
  );

  // eth wallet
  const ethProvider = new ethers.providers.StaticJsonRpcProvider(ETH_HOST);
  const ethWallet = new ethers.Wallet(USER_WALLET_PRIVATE_KEY, ethProvider);
  const ethRelayerWallet = new ethers.Wallet(
    RELAYER_WALLET_PRIVATE_KEY,
    ethProvider,
  );

  // wormhole contract
  const avaxWormhole = IWormhole__factory.connect(
    AVAX_WORMHOLE_ADDRESS,
    avaxWallet,
  );
  const ethWormhole = IWormhole__factory.connect(
    ETH_WORMHOLE_ADDRESS,
    ethWallet,
  );

  // token bridge contract
  const avaxBridge = ITokenBridge__factory.connect(
    AVAX_BRIDGE_ADDRESS,
    avaxWallet,
  );
  const ethBridge = ITokenBridge__factory.connect(
    ETH_BRIDGE_ADDRESS,
    ethWallet,
  );

  // WormUSD ERC20 contract
  const wormUsdAbi = `${__dirname}/../../../build/out/WormUSD.sol/WormUSD.json`;
  const avaxWormUsd = makeContract(
    avaxWallet,
    readWormUSDContractAddress(FORK_AVAX_CHAIN_ID),
    wormUsdAbi,
  );
  const ethWormUsd = makeContract(
    ethWallet,
    readWormUSDContractAddress(FORK_ETH_CHAIN_ID),
    wormUsdAbi,
  );

  // nimbleXChain contract
  const avaxnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(FORK_AVAX_CHAIN_ID),
    avaxWallet,
  );
  const ethnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(FORK_ETH_CHAIN_ID),
    ethWallet,
  );

  describe("Test Contract Deployment and Emitter Registration", () => {
    it("Verify AVAX Contract Deployment", async () => {
      // confirm chainId
      const deployedChainId = await avaxnimbleXChain.chainId();
      expect(deployedChainId).to.equal(CHAIN_ID_AVAX);
    });

    it("Verify ETH Contract Deployment", async () => {
      // confirm chainId
      const deployedChainId = await ethnimbleXChain.chainId();
      expect(deployedChainId).to.equal(CHAIN_ID_ETH);
    });

    it("Should Register nimbleXChain Contract Emitter on AVAX", async () => {
      // Convert the target contract address to bytes32, since other
      // non-evm blockchains (e.g. Solana) have 32 byte wallet addresses.
      const targetContractAddressHex =
        "0x" + tryNativeToHexString(ethnimbleXChain.address, CHAIN_ID_ETH);

      // register the emitter
      const receipt = await avaxnimbleXChain
        .registerEmitter(CHAIN_ID_ETH, targetContractAddressHex)
        .then((tx: ethers.ContractTransaction) => tx.wait())
        .catch((msg: any) => {
          // should not happen
          console.log(msg);
          return null;
        });
      expect(receipt).is.not.null;

      // query the contract and confirm that the emitter is set in storage
      const emitterInContractState = await avaxnimbleXChain.getRegisteredEmitter(
        CHAIN_ID_ETH,
      );
      expect(emitterInContractState).to.equal(targetContractAddressHex);
    });

    it("Should Register nimbleXChain Contract Emitter on ETH", async () => {
      // Convert the target contract address to bytes32, since other
      // non-evm blockchains (e.g. Solana) have 32 byte wallet addresses.
      const targetContractAddressHex =
        "0x" + tryNativeToHexString(avaxnimbleXChain.address, CHAIN_ID_AVAX);

      // register the emitter
      const receipt = await ethnimbleXChain
        .registerEmitter(CHAIN_ID_AVAX, targetContractAddressHex)
        .then((tx: ethers.ContractTransaction) => tx.wait())
        .catch((msg: any) => {
          // should not happen
          console.log(msg);
          return null;
        });
      expect(receipt).is.not.null;

      // query the contract and confirm that the emitter is set in storage
      const emitterInContractState = await ethnimbleXChain.getRegisteredEmitter(
        CHAIN_ID_AVAX,
      );
      expect(emitterInContractState).to.equal(targetContractAddressHex);
    });
  });

  describe("Test nimbleXChain Interface", () => {
    // simulated guardian that signs wormhole messages
    const guardians = new MockGuardians(AVAX_WORMHOLE_GUARDIAN_SET_INDEX, [
      GUARDIAN_PRIVATE_KEY,
    ]);

    let localVariables: any = {};

    it("Should Wrap and Transfer ETH From ETH to AVAX", async () => {
      // define the transfer amount
      localVariables.transferAmountFromEth = ethers.utils.parseEther("69.420");

      // instantiate WETH contract factory
      localVariables.wethAddress = await ethBridge.WETH();
      const weth = IWETH__factory.connect(
        localVariables.wethAddress,
        ethWallet,
      );

      // wrap ETH using the wormhole SDK's WETH factory
      {
        const receipt = await weth
          .deposit({value: localVariables.transferAmountFromEth})
          .then((tx: ethers.ContractTransaction) => tx.wait())
          .catch((msg: any) => {
            // should not happen
            console.log(msg);
            return null;
          });
        expect(receipt).is.not.null;
      }

      // increase allowance
      {
        const receipt = await weth
          .approve(ethnimbleXChain.address, localVariables.transferAmountFromEth)
          .then((tx: ethers.ContractTransaction) => tx.wait())
          .catch((msg: any) => {
            // should not happen
            console.log(msg);
            return null;
          });
        expect(receipt).is.not.null;
      }

      // grab token balance before performing the transfer
      const balanceBefore = await weth.balanceOf(ethWallet.address);

      // call sendTokensWithPayload
      const receipt = await ethnimbleXChain
        .sendTokensWithPayload(
          weth.address,
          localVariables.transferAmountFromEth,
          CHAIN_ID_AVAX, // targetChainId
          0, // batchId=0 to opt out of batching
          "0x" + tryNativeToHexString(avaxWallet.address, CHAIN_ID_AVAX),
        )
        .then(async (tx: ethers.ContractTransaction) => {
          const receipt = await tx.wait();
          return receipt;
        })
        .catch((msg) => {
          // should not happen
          console.log(msg);
          return null;
        });
      expect(receipt).is.not.null;

      // check token balance after to confirm the transfer worked
      const balanceAfter = await weth.balanceOf(ethWallet.address);
      expect(
        balanceBefore.sub(balanceAfter).eq(localVariables.transferAmountFromEth),
      ).is.true;

      // now grab the Wormhole message
      const unsignedMessages = await formatWormholeMessageFromReceipt(
        receipt!,
        CHAIN_ID_ETH,
      );
      expect(unsignedMessages.length).to.equal(1);

      // sign the TransferWithPayload message
      localVariables.signedTransferMessage = Uint8Array.from(
        guardians.addSignatures(unsignedMessages[0], [0]),
      );
      expect(localVariables.signedTransferMessage).is.not.null;
    });

    it("Should Redeem Wrapped WETH tokens on AVAX via Relayer", async () => {
      // fetch the token bridge wrapper for WETH
      const wethOnAvax = await avaxBridge.wrappedAsset(
        CHAIN_ID_ETH,
        "0x" + tryNativeToHexString(localVariables.wethAddress, CHAIN_ID_ETH),
      );

      // Create a token contract for the wrapped WETH. We can reuse the wormUsdAbi
      // since don't need any of the WETH-specific functionality to use the
      // wrapped version.
      const wrappedWethContract = makeContract(
        avaxWallet,
        wethOnAvax,
        wormUsdAbi,
      );

      // Check the balance of the recipient and relayer wallet before
      // redeeming the token transfer.
      const relayerBalanceBefore = await wrappedWethContract.balanceOf(
        avaxRelayerWallet.address,
      );
      const recipientBalanceBefore = await wrappedWethContract.balanceOf(
        avaxWallet.address,
      );

      try {
        const signedVaa = uint8ArrayToHex(localVariables.signedTransferMessage);
        const result = await axios.post(nimble_RELAY_URL, {
          destNodeURL: AVAX_HOST,
          userWalletPrivateKey: USER_WALLET_PRIVATE_KEY,
          relayerWalletPrivateKey: RELAYER_WALLET_PRIVATE_KEY,
          nimbleContractAddress: readnimbleXChainContractAddress(FORK_AVAX_CHAIN_ID),
          signedVAA: signedVaa,
        });
        expect(result.status).eq(200);
        expect(result.data).is.not.null;
      } catch (e) {
        console.error("post error", e);
      }

      // fetch the balances after redeeming the token transfer
      const relayerBalanceAfter = await wrappedWethContract.balanceOf(
        avaxRelayerWallet.address,
      );
      const recipientBalanceAfter = await wrappedWethContract.balanceOf(
        avaxWallet.address,
      );

      // compute the relayer fee using the denormalized transfer amount
      let relayerFee: ethers.BigNumber;
      let denormalizedTransferAmount: ethers.BigNumber;
      {
        const wrappedWethDecimals = await wrappedWethContract.decimals();
        denormalizedTransferAmount = tokenBridgeDenormalizeAmount(
          tokenBridgeNormalizeAmount(
            localVariables.transferAmountFromEth,
            wrappedWethDecimals,
          ),
          wrappedWethDecimals,
        );

        // calculate the relayer fee
        relayerFee = await avaxnimbleXChain.calculateRelayerFee(
          denormalizedTransferAmount,
        );
      }

      // validate the balance transfers
      expect(relayerBalanceAfter.sub(relayerBalanceBefore).eq(relayerFee)).is
        .true;
      expect(
        recipientBalanceAfter
          .sub(recipientBalanceBefore)
          .eq(denormalizedTransferAmount.sub(relayerFee)),
      ).is.true;

      // clear localVariables
      localVariables = {};
    });
  });
});
