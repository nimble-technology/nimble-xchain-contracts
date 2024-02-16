import {expect} from "chai";
import {ethers} from "ethers";
import {MockGuardians} from "@certusone/wormhole-sdk/lib/cjs/mock";
import {
  CHAIN_ID_POLYGON,
  CHAIN_ID_BSC,
  tryNativeToHexString, uint8ArrayToHex,
} from "@certusone/wormhole-sdk";
import {
  BNB_HOST,
  BNB_WORMHOLE_ADDRESS,
  BNB_BRIDGE_ADDRESS,
  BNB_WORMHOLE_GUARDIAN_SET_INDEX,
  FORK_BNB_CHAIN_ID,
  POLYGON_HOST,
  POLYGON_WORMHOLE_ADDRESS,
  POLYGON_BRIDGE_ADDRESS,
  FORK_POLYGON_CHAIN_ID,
  USER_WALLET_PRIVATE_KEY,
  RELAYER_WALLET_PRIVATE_KEY,
  GUARDIAN_PRIVATE_KEY,
} from "./constants";
import {
  formatWormholeMessageFromReceipt,
  readTestERC20ContractAddress,
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
import axios from "axios";
import {nimble_RELAY_URL} from "../../relay/constants";

describe("BNB POLYGON Transfer Test", () => {
  // bnb wallet
  const bnbProvider = new ethers.providers.StaticJsonRpcProvider(BNB_HOST);
  const bnbWallet = new ethers.Wallet(USER_WALLET_PRIVATE_KEY, bnbProvider);
  const bnbRelayerWallet = new ethers.Wallet(
    RELAYER_WALLET_PRIVATE_KEY,
    bnbProvider
  );

  // polygon wallet
  const polygonProvider = new ethers.providers.StaticJsonRpcProvider(POLYGON_HOST);
  const polygonWallet = new ethers.Wallet(USER_WALLET_PRIVATE_KEY, polygonProvider);
  const polygonRelayerWallet = new ethers.Wallet(
    RELAYER_WALLET_PRIVATE_KEY,
    polygonProvider
  );

  // wormhole contract
  const bnbWormhole = IWormhole__factory.connect(
    BNB_WORMHOLE_ADDRESS,
    bnbWallet
  );
  const polygonWormhole = IWormhole__factory.connect(
    POLYGON_WORMHOLE_ADDRESS,
    polygonWallet
  );

  // token bridge contract
  const bnbBridge = ITokenBridge__factory.connect(
    BNB_BRIDGE_ADDRESS,
    bnbWallet
  );
  const polygonBridge = ITokenBridge__factory.connect(
    POLYGON_BRIDGE_ADDRESS,
    polygonWallet
  );

  // TestERC20 ERC20 contract
  const testErc20Abi = `${__dirname}/../../../build/out/TestERC20.sol/TestERC20.json`;
  const bnbTestErc20 = makeContract(
    bnbWallet,
    readTestERC20ContractAddress(FORK_BNB_CHAIN_ID),
    testErc20Abi
  );
  const polygonTestErc20 = makeContract(
    polygonWallet,
    readTestERC20ContractAddress(FORK_POLYGON_CHAIN_ID),
    testErc20Abi
  );

  // nimbleXChain contract
  const bnbnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(FORK_BNB_CHAIN_ID),
    bnbWallet
  );
  const polygonnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(FORK_POLYGON_CHAIN_ID),
    polygonWallet
  );

  describe("Test Contract Deployment and Emitter Registration", () => {
    it("Verify BNB Contract Deployment", async () => {
      // confirm chainId
      const deployedChainId = await bnbnimbleXChain.chainId();
      expect(deployedChainId).to.equal(CHAIN_ID_BSC);
    });

    it("Verify POLYGON Contract Deployment", async () => {
      // confirm chainId
      const deployedChainId = await polygonnimbleXChain.chainId();
      expect(deployedChainId).to.equal(CHAIN_ID_POLYGON);
    });

    it("Should Register nimbleXChain Contract Emitter on BNB", async () => {
      // Convert the target contract address to bytes32, since other
      // non-evm blockchains (e.g. Solana) have 32 byte wallet addresses.
      const targetContractAddressHex =
        "0x" + tryNativeToHexString(polygonnimbleXChain.address, CHAIN_ID_POLYGON);

      // register the emitter
      const receipt = await bnbnimbleXChain
        .registerEmitter(CHAIN_ID_POLYGON, targetContractAddressHex)
        .then((tx: ethers.ContractTransaction) => tx.wait())
        .catch((msg: any) => {
          // should not happen
          console.log(msg);
          return null;
        });
      expect(receipt).is.not.null;

      // query the contract and confirm that the emitter is set in storage
      const emitterInContractState = await bnbnimbleXChain.getRegisteredEmitter(
        CHAIN_ID_POLYGON
      );
      expect(emitterInContractState).to.equal(targetContractAddressHex);
    });

    it("Should Register nimbleXChain Contract Emitter on POLYGON", async () => {
      // Convert the target contract address to bytes32, since other
      // non-evm blockchains (e.g. Solana) have 32 byte wallet addresses.
      const targetContractAddressHex =
        "0x" + tryNativeToHexString(bnbnimbleXChain.address, CHAIN_ID_BSC);

      // register the emitter
      const receipt = await polygonnimbleXChain
        .registerEmitter(CHAIN_ID_BSC, targetContractAddressHex)
        .then((tx: ethers.ContractTransaction) => tx.wait())
        .catch((msg: any) => {
          // should not happen
          console.log(msg);
          return null;
        });
      expect(receipt).is.not.null;

      // query the contract and confirm that the emitter is set in storage
      const emitterInContractState = await polygonnimbleXChain.getRegisteredEmitter(
        CHAIN_ID_BSC
      );
      expect(emitterInContractState).to.equal(targetContractAddressHex);
    });
  });

  describe("Test nimbleXChain Interface", () => {
    // simulated guardian that signs wormhole messages
    const guardians = new MockGuardians(BNB_WORMHOLE_GUARDIAN_SET_INDEX, [
      GUARDIAN_PRIVATE_KEY,
    ]);

    let localBuffer: any = {};

    it("Should Transfer testERC20 Tokens From POLYGON to BNB", async () => {
      // define the transfer amount
      localBuffer.transferAmountFromPolygon = ethers.utils.parseUnits(
        "42069",
        await polygonTestErc20.decimals()
      );

      // increase allowance
      {
        const receipt = await polygonTestErc20
          .approve(polygonnimbleXChain.address, localBuffer.transferAmountFromPolygon)
          .then((tx: ethers.ContractTransaction) => tx.wait())
          .catch((msg: any) => {
            // should not happen
            console.log(msg);
            return null;
          });
        expect(receipt).is.not.null;
      }

      // grab token balance before performing the transfer
      const balanceBefore = await polygonTestErc20.balanceOf(polygonWallet.address);

      // call sendTokensWithPayload
      const receipt = await polygonnimbleXChain
        .sendTokensWithPayload(
          polygonTestErc20.address,
          localBuffer.transferAmountFromPolygon,
          CHAIN_ID_BSC, // targetChainId
          0, // batchId=0 to opt out of batching
          "0x" + tryNativeToHexString(bnbWallet.address, CHAIN_ID_BSC)
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
      const balanceAfter = await polygonTestErc20.balanceOf(polygonWallet.address);
      expect(
        balanceBefore.sub(balanceAfter).eq(localBuffer.transferAmountFromPolygon)
      ).is.true;

      // now grab the Wormhole message
      const unsignedMessages = await formatWormholeMessageFromReceipt(
        receipt,
        CHAIN_ID_POLYGON
      );
      expect(unsignedMessages.length).to.equal(1);

      // sign the TransferWithPayload message
      localBuffer.signedTransferMessage = Uint8Array.from(
        guardians.addSignatures(unsignedMessages[0], [0])
      );
      expect(localBuffer.signedTransferMessage).is.not.null;
    });

    it("Should Redeem Wrapped testERC20 tokens on BNB via Relayer", async () => {
      // fetch the token bridge wrapper for the transferred token
      const wrappedTokenOnBnb = await bnbBridge.wrappedAsset(
        CHAIN_ID_POLYGON,
        "0x" + tryNativeToHexString(polygonTestErc20.address, CHAIN_ID_POLYGON)
      );

      // create token contract for the wrapped asset
      const wrappedTokenContract = makeContract(
        bnbWallet,
        wrappedTokenOnBnb,
        testErc20Abi
      );

      // Check the balance of the recipient and relayer wallet before
      // redeeming the token transfer.
      const relayerBalanceBefore = await wrappedTokenContract.balanceOf(
        bnbRelayerWallet.address
      );
      const recipientBalanceBefore = await wrappedTokenContract.balanceOf(
        bnbWallet.address
      );

      // Invoke the nimbleXChain contract to redeem the transfer, passing the
      // encoded Wormhole message. Invoke this method using the bnbRelayerWallet
      // to confirm that the contract handles relayer payouts correctly.
      var result
      try {
        const signedVaa = uint8ArrayToHex(localBuffer.signedTransferMessage);
        result = await axios.post(nimble_RELAY_URL, {
          destNodeURL: BNB_HOST,
          userWalletPrivateKey: USER_WALLET_PRIVATE_KEY,
          relayerWalletPrivateKey: RELAYER_WALLET_PRIVATE_KEY,
          nimbleContractAddress: readnimbleXChainContractAddress(FORK_BNB_CHAIN_ID),
          signedVAA: signedVaa,
        });
      } catch (e) {
        console.error("post error", e);
      }
      expect(result.status).eq(200);
      expect(result.data).is.not.null;

      // fetch the balances after redeeming the token transfer
      const relayerBalanceAfter = await wrappedTokenContract.balanceOf(
        bnbRelayerWallet.address
      );
      const recipientBalanceAfter = await wrappedTokenContract.balanceOf(
        bnbWallet.address
      );

      // compute the relayer fee using the denormalized transfer amount
      let relayerFee: ethers.BigNumber;
      let denormalizedTransferAmount: ethers.BigNumber;
      {
        const wrappedTokenDecimals = await wrappedTokenContract.decimals();
        denormalizedTransferAmount = tokenBridgeDenormalizeAmount(
          tokenBridgeNormalizeAmount(
            localBuffer.transferAmountFromPolygon,
            wrappedTokenDecimals
          ),
          wrappedTokenDecimals
        );

        // calculate the relayer fee
        relayerFee = await bnbnimbleXChain.calculateRelayerFee(
          denormalizedTransferAmount
        );
      }

      // validate the balance transfers
      expect(relayerBalanceAfter.sub(relayerBalanceBefore).eq(relayerFee)).is
        .true;
      expect(
        recipientBalanceAfter
          .sub(recipientBalanceBefore)
          .eq(denormalizedTransferAmount.sub(relayerFee))
      ).is.true;

      // clear localBuffer
      localBuffer = {};

      // Save the recipient balance change and wrapped token contract for the
      // next test.
      localBuffer.bnbWalletWrappedTokenBalance = recipientBalanceAfter.sub(
        recipientBalanceBefore
      );
      localBuffer.wrappedTokenContract = wrappedTokenContract;
    });


    it("Should Transfer testERC20 Tokens From BNB to POLYGON", async () => {
      // define the transfer amount
      localBuffer.transferAmountFromBnb = ethers.utils.parseUnits(
        "42069",
        await bnbTestErc20.decimals()
      );

      // increase allowance
      {
        const receipt = await bnbTestErc20
          .approve(bnbnimbleXChain.address, localBuffer.transferAmountFromBnb)
          .then((tx: ethers.ContractTransaction) => tx.wait())
          .catch((msg: any) => {
            // should not happen
            console.log(msg);
            return null;
          });
        expect(receipt).is.not.null;
      }

      // grab token balance before performing the transfer
      const balanceBefore = await bnbTestErc20.balanceOf(bnbWallet.address);

      // call sendTokensWithPayload
      const receipt = await bnbnimbleXChain
        .sendTokensWithPayload(
          bnbTestErc20.address,
          localBuffer.transferAmountFromBnb,
          CHAIN_ID_POLYGON, // targetChainId
          0, // batchId=0 to opt out of batching
          "0x" + tryNativeToHexString(polygonWallet.address, CHAIN_ID_POLYGON)
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
      const balanceAfter = await bnbTestErc20.balanceOf(bnbWallet.address);
      expect(
        balanceBefore.sub(balanceAfter).eq(localBuffer.transferAmountFromBnb)
      ).is.true;

      // now grab the Wormhole message
      const unsignedMessages = await formatWormholeMessageFromReceipt(
        receipt,
        CHAIN_ID_BSC
      );
      expect(unsignedMessages.length).to.equal(1);

      // sign the TransferWithPayload message
      localBuffer.signedTransferMessage = Uint8Array.from(
        guardians.addSignatures(unsignedMessages[0], [0])
      );
      expect(localBuffer.signedTransferMessage).is.not.null;
    });

    it("Should Redeem Wrapped testERC20 tokens on POLYGON via Relayer", async () => {
      // fetch the token bridge wrapper for the transferred token
      const wrappedTokenOnPolygon = await polygonBridge.wrappedAsset(
        CHAIN_ID_BSC,
        "0x" + tryNativeToHexString(bnbTestErc20.address, CHAIN_ID_BSC)
      );

      // create token contract for the wrapped asset
      const wrappedTokenContract = makeContract(
        polygonWallet,
        wrappedTokenOnPolygon,
        testErc20Abi
      );

      // Check the balance of the recipient and relayer wallet before
      // redeeming the token transfer.
      const relayerBalanceBefore = await wrappedTokenContract.balanceOf(
        polygonRelayerWallet.address
      );
      const recipientBalanceBefore = await wrappedTokenContract.balanceOf(
        polygonWallet.address
      );

      // Invoke the nimbleXChain contract to redeem the transfer, passing the
      // encoded Wormhole message. Invoke this method using the bnbRelayerWallet
      // to confirm that the contract handles relayer payouts correctly.

      var result
      try {
        const signedVaa = uint8ArrayToHex(localBuffer.signedTransferMessage);
        result = await axios.post(nimble_RELAY_URL, {
          destNodeURL: POLYGON_HOST,
          userWalletPrivateKey: USER_WALLET_PRIVATE_KEY,
          relayerWalletPrivateKey: RELAYER_WALLET_PRIVATE_KEY,
          nimbleContractAddress: readnimbleXChainContractAddress(FORK_POLYGON_CHAIN_ID),
          signedVAA: signedVaa,
        });
      } catch (e) {
        console.error("post error", e);
      }
      expect(result.status).eq(200);
      expect(result.data).is.not.null;

      // fetch the balances after redeeming the token transfer
      const relayerBalanceAfter = await wrappedTokenContract.balanceOf(
        polygonRelayerWallet.address
      );
      const recipientBalanceAfter = await wrappedTokenContract.balanceOf(
        polygonWallet.address
      );

      // compute the relayer fee using the denormalized transfer amount
      let relayerFee: ethers.BigNumber;
      let denormalizedTransferAmount: ethers.BigNumber;
      {
        const wrappedTokenDecimals = await wrappedTokenContract.decimals();
        denormalizedTransferAmount = tokenBridgeDenormalizeAmount(
          tokenBridgeNormalizeAmount(
            localBuffer.transferAmountFromBnb,
            wrappedTokenDecimals
          ),
          wrappedTokenDecimals
        );

        // calculate the relayer fee
        relayerFee = await polygonnimbleXChain.calculateRelayerFee(
          denormalizedTransferAmount
        );
      }

      // validate the balance transfers
      expect(relayerBalanceAfter.sub(relayerBalanceBefore).eq(relayerFee)).is
        .true;
      expect(
        recipientBalanceAfter
          .sub(recipientBalanceBefore)
          .eq(denormalizedTransferAmount.sub(relayerFee))
      ).is.true;

      // clear localBuffer
      localBuffer = {};

      // Save the recipient balance change and wrapped token contract for the
      // next test.
      localBuffer.polygonWalletWrappedTokenBalance = recipientBalanceAfter.sub(
        recipientBalanceBefore
      );
      localBuffer.wrappedTokenContract = wrappedTokenContract;
    });

  });
});
