import {expect} from "chai";
import {BigNumber, ethers, Overrides, providers, Wallet} from "ethers";
import {
  CHAIN_ID_BSC,
  CHAIN_ID_POLYGON,
  tryNativeToHexString,
  parseSequenceFromLogEth,
  getEmitterAddressEth,
  getSignedVAAWithRetry, uint8ArrayToHex,
} from "@certusone/wormhole-sdk";
import {
  BNB_USDC_ADDRESS,
  POLYGON_USDC_ADDRESS,
  USER_WALLET_PRIVATE_KEY,
  RELAYER_WALLET_PRIVATE_KEY,
  BNB_ENDPOINT,
  POLYGON_ENDPOINT,
  BNB_WORMHOLE_ADDRESS,
  POLYGON_WORMHOLE_ADDRESS,
  BNB_BRIDGE_ADDRESS,
  POLYGON_BRIDGE_ADDRESS,
  BNB_CHAIN_ID,
  POLYGON_CHAIN_ID,
  WORMHOLE_RPC_HOSTS,
} from "./constants"
import {
  readnimbleXChainContractAddress,
  tokenBridgeDenormalizeAmount,
  tokenBridgeNormalizeAmount,
} from "../../helpers/utils";
import {makeContract} from "../../helpers/io";
import {
  nimbleXChain__factory,
  ITokenBridge__factory,
  IWormhole__factory,
} from "../../../build/src/ethers-contracts";
import {NodeHttpTransport} from "@improbable-eng/grpc-web-node-http-transport";
import axios from "axios";
import {nimble_RELAY_URL} from "../../relay/constants";
import {FORK_POLYGON_CHAIN_ID} from "../testnet/constants";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
describe("BNB POLYGON Mainnet Transfer Test", () => {
  // bnb provider & wallet
  const bnbProvider = new providers.JsonRpcProvider(BNB_ENDPOINT);
  const bnbWallet = new Wallet(USER_WALLET_PRIVATE_KEY, bnbProvider);
  const bnbRelayerWallet = new Wallet(RELAYER_WALLET_PRIVATE_KEY, bnbProvider);

  // polygon provider & wallet
  const polygonProvider = new providers.JsonRpcProvider(POLYGON_ENDPOINT);
  const polygonWallet = new Wallet(USER_WALLET_PRIVATE_KEY, polygonProvider);
  const polygonRelayerWallet = new Wallet(RELAYER_WALLET_PRIVATE_KEY, polygonProvider);

  // get ERC20 Token ABI
  const erc20_abi_path = `${__dirname}/ERC20.ABI.json`;

  // wormhole core contract
  const bnbWormhole = IWormhole__factory.connect(
    BNB_WORMHOLE_ADDRESS,
    bnbWallet
  );
  const polygonWormhole = IWormhole__factory.connect(
    POLYGON_WORMHOLE_ADDRESS,
    polygonWallet
  );

  // wormhole token bridge contract
  const bnbBridge = ITokenBridge__factory.connect(
    BNB_BRIDGE_ADDRESS,
    bnbWallet
  );
  const polygonBridge = ITokenBridge__factory.connect(
    POLYGON_BRIDGE_ADDRESS,
    polygonWallet
  );

  // USDC contract
  const bnb_USDC_contract = makeContract(bnbWallet, BNB_USDC_ADDRESS, erc20_abi_path);
  const polygon_USDC_contract = makeContract(polygonWallet, POLYGON_USDC_ADDRESS, erc20_abi_path);

  // nimbleXChain contract
  const bnbnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(BNB_CHAIN_ID),
    bnbWallet
  );
  const polygonnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(POLYGON_CHAIN_ID),
    polygonWallet
  );

  describe("Basic Checks", () => {
    it("Check Gas Fee Info", async () => {
      console.log("-------- Gas Fee Info --------");
      // check bnb chain
      console.log("bnb feeData: ", await bnbProvider.getFeeData());
      console.log("bnb gasPrice: ", (await bnbProvider.getGasPrice()).toBigInt());

      // check polygon chain
      console.log("polygon feeData: ", await polygonProvider.getFeeData());
      console.log("polygon gasPrice: ", (await polygonProvider.getGasPrice()).toBigInt());
      console.log("------------------------------");
    });

    it("Check Wallet Connection", async () => {
      console.log("-------- Wallet Info --------");
      console.log("bnb chainId: ", await bnbWallet.getChainId());
      console.log("bnb wallet address: ", await bnbWallet.getAddress());
      console.log("bnb balance: ", (await bnbWallet.getBalance()).toBigInt());
      console.log("bnb relayer wallet address: ", await bnbRelayerWallet.getAddress());
      console.log("polygon chainId: ", await polygonWallet.getChainId());
      console.log("polygon wallet address: ", await polygonWallet.getAddress());
      console.log("polygon balance: ", (await polygonWallet.getBalance()).toBigInt());
      console.log("polygon relayer wallet address: ", await polygonRelayerWallet.getAddress());
      console.log("------------------------------");
    });

    it("Check Token Assets(USDC)", async () => {
      console.log("-------- Token Info --------");
      // check bnb USDC balance
      const bnb_USDC_balance = (await bnb_USDC_contract.balanceOf(bnbWallet.address)).toBigInt();
      console.log("bnb usdc decimals: ", await bnb_USDC_contract.decimals());
      console.log("bnb usdc balance: ", bnb_USDC_balance);

      // check polygon USDC balance
      const polygon_USDC_balance = (await polygon_USDC_contract.balanceOf(polygonWallet.address)).toBigInt();
      console.log("polygon usdc decimals: ", await polygon_USDC_contract.decimals());
      console.log("polygon usdc balance: ", polygon_USDC_balance);
      console.log("------------------------------");
    });

    it("Check Wormhole information", async () => {
      console.log("-------- Wormhole Info --------");
      // bnb wormhole
      console.log("bnb wormhole core contract address: ", bnbWormhole.address);
      console.log("bnb wormhole token bridge contract address: ", bnbBridge.address);
      console.log("bnb wormhole chainId: ", await bnbWormhole.chainId());
      console.log("bnb wormhole messageFee: ", (await bnbWormhole.messageFee()).toBigInt());
      expect(await bnbBridge.wormhole()).to.equal(BNB_WORMHOLE_ADDRESS);

      // polygon wormhole
      console.log("polygon wormhole core contract address: ", polygonWormhole.address);
      console.log("polygon wormhole token bridge contract address: ", polygonBridge.address);
      console.log("polygon wormhole chainId: ", await polygonWormhole.chainId());
      console.log("polygon wormhole messageFee: ", (await polygonWormhole.messageFee()).toBigInt());
      expect(await polygonBridge.wormhole()).to.equal(POLYGON_WORMHOLE_ADDRESS);
      console.log("------------------------------");
    });

    it("Verify Nimble Smart Contract Deployment ", async () => {
      console.log("-------- Nimble SC Info --------");
      // bnb nimble sc
      console.log("bnb nimble sc address: ", bnbnimbleXChain.address);
      console.log("bnb nimble sc owner: ", await bnbnimbleXChain.owner());
      console.log("bnb nimble sc chainId: ", await bnbnimbleXChain.chainId());
      expect(await bnbnimbleXChain.chainId()).to.equal(CHAIN_ID_BSC);

      // polygon nimble sc
      console.log("polygon nimble sc address: ", await polygonnimbleXChain.address);
      console.log("polygon nimble sc owner: ", await polygonnimbleXChain.owner());
      console.log("polygon nimble sc chainId: ", await polygonnimbleXChain.chainId());
      expect(await polygonnimbleXChain.chainId()).to.equal(CHAIN_ID_POLYGON);
      console.log("------------------------------");
    });

    it("Verify Nimble Smart Contract Registration ", async () => {
      console.log("-------- Nimble SC Registration Info --------");
      // bnb
      {
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
      }

      // polygon
      {
        const targetContractAddressHex =
          "0x" + tryNativeToHexString(bnbnimbleXChain.address, CHAIN_ID_BSC);

        // register the emitter
        const baseFee = (await polygonProvider.getBlock(-1)).baseFeePerGas!.toBigInt();
        const maxFee = baseFee * BigInt(2);
        const maxPriorityFee = ethers.utils.parseUnits("31", "gwei").toBigInt();

        const receipt = await polygonnimbleXChain
          .registerEmitter(CHAIN_ID_BSC, targetContractAddressHex, {
            maxFeePerGas: maxFee,
            maxPriorityFeePerGas: maxPriorityFee
          })
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
      }
      console.log("------------------------------");
    });
  });

  // this test takes about 1 - 2 min
  describe("BNB Transfer USDC to Polygon", () => {
    let localBuffer: any = {};

    it("Should Transfer USDC(bnb) Tokens From BNB to POLYGON", async () => {
      // define the transfer amount
      localBuffer.transferAmountFromBnb = ethers.utils.parseUnits(
        "0.01",
        await bnb_USDC_contract.decimals()
      );

      // increase allowance
      {
        const receipt = await bnb_USDC_contract
          .approve(bnbnimbleXChain.address, localBuffer.transferAmountFromBnb)
          .then((tx: ethers.ContractTransaction) => tx.wait())
          .catch((msg: any) => {
            // should not happen
            console.log(msg);
            return null;
          });
        expect(receipt).is.not.null;
        // console.log("increase allowance receipt:", receipt);
      }

      // grab token balance before performing the transfer
      const balanceBefore = await bnb_USDC_contract.balanceOf(bnbWallet.address);

      // call sendTokensWithPayload
      const receipt = await bnbnimbleXChain
        .sendTokensWithPayload(
          bnb_USDC_contract.address,
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
      // console.log("sendTokensWithPayload receipt:", receipt);

      // check token balance after to confirm the transfer worked
      const balanceAfter = await bnb_USDC_contract.balanceOf(bnbWallet.address);

      expect(
        balanceBefore.sub(balanceAfter).eq(localBuffer.transferAmountFromBnb)
      ).is.true;

      // get signed VAA
      // Get the sequence number and emitter address required to fetch the signedVAA of our message
      const sequence = parseSequenceFromLogEth(receipt!, bnbWormhole.address);
      const emitterAddress = getEmitterAddressEth(bnbBridge.address);

      // Fetch the signedVAA from the Wormhole Network (this may require retries while you wait for confirmation)
      const {vaaBytes} = await getSignedVAAWithRetry(
        WORMHOLE_RPC_HOSTS,
        CHAIN_ID_BSC,
        emitterAddress,
        sequence,
        {
          transport: NodeHttpTransport(),
        }
      );

      console.log("signed vaa: ", vaaBytes);
      localBuffer.signedTransferMessage = vaaBytes;
    });

    it("Should Redeem USDC(polygon) tokens on POLYGON via Relayer", async () => {
      // confirm that the token contract was created
      const wrappedTokenOnPolygon = await polygonBridge.wrappedAsset(
        CHAIN_ID_BSC,
        "0x" + tryNativeToHexString(bnb_USDC_contract.address, CHAIN_ID_BSC)
      );

      const wrappedTokenContract = makeContract(
        polygonWallet,
        wrappedTokenOnPolygon,
        erc20_abi_path
      );
      console.log("wrappedToken Address: ", wrappedTokenOnPolygon);

      // Check the balance of the recipient and relayer wallet before
      // redeeming the token transfer.
      const relayerBalanceBefore = await wrappedTokenContract.balanceOf(
        polygonRelayerWallet.address
      );
      const recipientBalanceBefore = await wrappedTokenContract.balanceOf(
        polygonWallet.address
      );
      console.log("relayer wallet balance before redeem: ", relayerBalanceBefore.toBigInt());
      console.log("user wallet balance before redeem: ", recipientBalanceBefore.toBigInt());

      // Invoke the nimbleXChain contract to redeem the transfer, passing the
      // encoded Wormhole message. Invoke this method using the bnbRelayerWallet
      // to confirm that the contract handles relayer payouts correctly.
      const baseFee = (await polygonProvider.getBlock(-1)).baseFeePerGas!.toBigInt();
      const maxFee = baseFee * BigInt(2);
      const maxPriorityFee = ethers.utils.parseUnits("31", "gwei").toBigInt();


      const override = {
        maxFeePerGas: maxFee,
        maxPriorityFeePerGas: maxPriorityFee
      }
      var result;
      try {
        const signedVaa = uint8ArrayToHex(localBuffer.signedTransferMessage);
        result = await axios.post(nimble_RELAY_URL, {
          destNodeURL: POLYGON_ENDPOINT,
          userWalletPrivateKey: USER_WALLET_PRIVATE_KEY,
          relayerWalletPrivateKey: RELAYER_WALLET_PRIVATE_KEY,
          nimbleContractAddress: readnimbleXChainContractAddress(FORK_POLYGON_CHAIN_ID),
          signedVAA: signedVaa,
          override: override
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
      console.log("relayer wallet balance after redeem: ", relayerBalanceAfter.toBigInt());
      console.log("user wallet balance after redeem: ", recipientBalanceAfter.toBigInt());

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
      console.log("relayer fee: ", relayerFee.toBigInt());

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
    });
  });
});
