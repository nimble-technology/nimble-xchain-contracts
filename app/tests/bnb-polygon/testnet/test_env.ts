import {expect} from "chai";
import {ethers} from "ethers";
import {
  CHAIN_ID_BSC,
  CHAIN_ID_POLYGON,
  tryNativeToHexString,
} from "@certusone/wormhole-sdk";
import {MockGuardians} from "@certusone/wormhole-sdk/lib/cjs/mock";
import {
  FORK_BNB_CHAIN_ID,
  FORK_POLYGON_CHAIN_ID,
  GUARDIAN_PRIVATE_KEY,
  BNB_HOST,
  BNB_WORMHOLE_ADDRESS,
  BNB_BRIDGE_ADDRESS,
  BNB_WORMHOLE_CHAIN_ID,
  BNB_WORMHOLE_GUARDIAN_SET_INDEX,
  BNB_WORMHOLE_MESSAGE_FEE,
  POLYGON_HOST,
  POLYGON_WORMHOLE_ADDRESS,
  POLYGON_BRIDGE_ADDRESS,
  POLYGON_WORMHOLE_CHAIN_ID,
  POLYGON_WORMHOLE_GUARDIAN_SET_INDEX,
  POLYGON_WORMHOLE_MESSAGE_FEE,
  USER_WALLET_PRIVATE_KEY,
} from "./constants";
import {
  formatWormholeMessageFromReceipt,
  readTestERC20ContractAddress,
} from "../../helpers/utils";
import {IWormhole__factory, IERC20__factory} from "../../../build/src/ethers-contracts";
import {ITokenBridge__factory} from "@certusone/wormhole-sdk/lib/cjs/ethers-contracts";

describe("Environment Test", () => {
  // bnb wallet
  const bnbProvider = new ethers.providers.StaticJsonRpcProvider(BNB_HOST);
  const bnbWallet = new ethers.Wallet(USER_WALLET_PRIVATE_KEY, bnbProvider);

  // polygon wallet
  const polygonProvider = new ethers.providers.StaticJsonRpcProvider(POLYGON_HOST);
  const polygonWallet = new ethers.Wallet(USER_WALLET_PRIVATE_KEY, polygonProvider);

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

  // testERC20 ERC20 contract
  const bnbTestErc20 = IERC20__factory.connect(
    readTestERC20ContractAddress(FORK_BNB_CHAIN_ID),
    bnbWallet
  );
  const polygonTestErc20 = IERC20__factory.connect(
    readTestERC20ContractAddress(FORK_POLYGON_CHAIN_ID),
    polygonWallet
  );

  describe("Verify Mainnet Forks", () => {
    it("BNB Chain ID", async () => {
      const network = await bnbProvider.getNetwork();
      expect(network.chainId).to.equal(FORK_BNB_CHAIN_ID);
    });

    it("POLYGON Chain ID", async () => {
      const network = await polygonProvider.getNetwork();
      expect(network.chainId).to.equal(FORK_POLYGON_CHAIN_ID);
    });
  });

  describe("Verify BNB Wormhole Contract", () => {
    it("Chain ID", async () => {
      const chainId = await bnbWormhole.chainId();
      expect(chainId).to.equal(BNB_WORMHOLE_CHAIN_ID);
    });

    it("Message Fee", async () => {
      const messageFee: ethers.BigNumber = await bnbWormhole.messageFee();
      expect(messageFee.eq(BNB_WORMHOLE_MESSAGE_FEE)).to.be.true;
    });

    it("Guardian Set", async () => {
      // Check guardian set index
      const guardianSetIndex = await bnbWormhole.getCurrentGuardianSetIndex();
      expect(guardianSetIndex).to.equal(BNB_WORMHOLE_GUARDIAN_SET_INDEX);

      // Override guardian set
      const abiCoder = ethers.utils.defaultAbiCoder;

      // Get slot for Guardian Set at the current index
      const guardianSetSlot = ethers.utils.keccak256(
        abiCoder.encode(["uint32", "uint256"], [guardianSetIndex, 2])
      );

      // Overwrite all but first guardian set to zero address. This isn't
      // necessary, but just in case we inadvertently access these slots
      // for any reason.
      const numGuardians = await bnbProvider
        .getStorageAt(BNB_WORMHOLE_ADDRESS, guardianSetSlot)
        .then((value) => ethers.BigNumber.from(value).toBigInt());
      for (let i = 1; i < numGuardians; ++i) {
        await bnbProvider.send("anvil_setStorageAt", [
          BNB_WORMHOLE_ADDRESS,
          abiCoder.encode(
            ["uint256"],
            [
              ethers.BigNumber.from(
                ethers.utils.keccak256(guardianSetSlot)
              ).add(i),
            ]
          ),
          ethers.utils.hexZeroPad("0x0", 32),
        ]);
      }

      // Now overwrite the first guardian key with the devnet key specified
      // in the function argument.
      const devnetGuardian = new ethers.Wallet(GUARDIAN_PRIVATE_KEY).address;
      await bnbProvider.send("anvil_setStorageAt", [
        BNB_WORMHOLE_ADDRESS,
        abiCoder.encode(
          ["uint256"],
          [
            ethers.BigNumber.from(ethers.utils.keccak256(guardianSetSlot)).add(
              0 // just explicit w/ index 0
            ),
          ]
        ),
        ethers.utils.hexZeroPad(devnetGuardian, 32),
      ]);

      // Change the length to 1 guardian
      await bnbProvider.send("anvil_setStorageAt", [
        BNB_WORMHOLE_ADDRESS,
        guardianSetSlot,
        ethers.utils.hexZeroPad("0x1", 32),
      ]);

      // Confirm guardian set override
      const guardians = await bnbWormhole
        .getGuardianSet(guardianSetIndex)
        .then(
          (guardianSet: any) => guardianSet[0] // first element is array of keys
        );
      expect(guardians.length).to.equal(1);
      expect(guardians[0]).to.equal(devnetGuardian);
    });
  });

  describe("Verify POLYGON Wormhole Contract", () => {
    it("Chain ID", async () => {
      const chainId = await polygonWormhole.chainId();
      expect(chainId).to.equal(POLYGON_WORMHOLE_CHAIN_ID);
    });

    it("Message Fee", async () => {
      const messageFee: ethers.BigNumber = await polygonWormhole.messageFee();
      expect(messageFee.eq(POLYGON_WORMHOLE_MESSAGE_FEE)).to.be.true;
    });

    it("Guardian Set", async () => {
      // Check guardian set index
      const guardianSetIndex = await polygonWormhole.getCurrentGuardianSetIndex();
      expect(guardianSetIndex).to.equal(POLYGON_WORMHOLE_GUARDIAN_SET_INDEX);

      // Override guardian set
      const abiCoder = ethers.utils.defaultAbiCoder;

      // Get slot for Guardian Set at the current index
      const guardianSetSlot = ethers.utils.keccak256(
        abiCoder.encode(["uint32", "uint256"], [guardianSetIndex, 2])
      );

      // Overwrite all but first guardian set to zero address. This isn't
      // necessary, but just in case we inadvertently access these slots
      // for any reason.
      const numGuardians = await polygonProvider
        .getStorageAt(POLYGON_WORMHOLE_ADDRESS, guardianSetSlot)
        .then((value) => ethers.BigNumber.from(value).toBigInt());
      for (let i = 1; i < numGuardians; ++i) {
        await polygonProvider.send("anvil_setStorageAt", [
          POLYGON_WORMHOLE_ADDRESS,
          abiCoder.encode(
            ["uint256"],
            [
              ethers.BigNumber.from(
                ethers.utils.keccak256(guardianSetSlot)
              ).add(i),
            ]
          ),
          ethers.utils.hexZeroPad("0x0", 32),
        ]);
      }

      // Now overwrite the first guardian key with the devnet key specified
      // in the function argument.
      const devnetGuardian = new ethers.Wallet(GUARDIAN_PRIVATE_KEY).address;
      await polygonProvider.send("anvil_setStorageAt", [
        POLYGON_WORMHOLE_ADDRESS,
        abiCoder.encode(
          ["uint256"],
          [
            ethers.BigNumber.from(ethers.utils.keccak256(guardianSetSlot)).add(
              0 // just explicit w/ index 0
            ),
          ]
        ),
        ethers.utils.hexZeroPad(devnetGuardian, 32),
      ]);

      // Change the length to 1 guardian
      await polygonProvider.send("anvil_setStorageAt", [
        POLYGON_WORMHOLE_ADDRESS,
        guardianSetSlot,
        ethers.utils.hexZeroPad("0x1", 32),
      ]);

      // Confirm guardian set override
      const guardians = await polygonWormhole.getGuardianSet(guardianSetIndex).then(
        (guardianSet: any) => guardianSet[0] // first element is array of keys
      );
      expect(guardians.length).to.equal(1);
      expect(guardians[0]).to.equal(devnetGuardian);
    });
  });

  describe("Verify BNB Bridge Contract", () => {
    it("Chain ID", async () => {
      const chainId = await bnbBridge.chainId();
      expect(chainId).to.equal(BNB_WORMHOLE_CHAIN_ID);
    });
    it("Wormhole", async () => {
      const wormhole = await bnbBridge.wormhole();
      expect(wormhole).to.equal(BNB_WORMHOLE_ADDRESS);
    });
  });

  describe("Verify POLYGON Bridge Contract", () => {
    it("Chain ID", async () => {
      const chainId = await polygonBridge.chainId();
      expect(chainId).to.equal(POLYGON_WORMHOLE_CHAIN_ID);
    });
    it("Wormhole", async () => {
      const wormhole = await polygonBridge.wormhole();
      expect(wormhole).to.equal(POLYGON_WORMHOLE_ADDRESS);
    });
  });

  describe("Check wormhole-sdk", () => {
    it("tryNativeToHexString", async () => {
      const accounts = await bnbProvider.listAccounts();
      expect(tryNativeToHexString(accounts[0], "ethereum")).to.equal(
        "00000000000000000000000090f8bf6a479f320ead074411a4b0e7944ea8c9c1"
      );
    });
  });

  describe("Verify BNB TestERC20", () => {
    const guardians = new MockGuardians(BNB_WORMHOLE_GUARDIAN_SET_INDEX, [
      GUARDIAN_PRIVATE_KEY,
    ]);

    let signedTokenAttestation: Buffer;

    it("Tokens Minted to Wallet", async () => {
      // fetch the total supply and confirm it was all minted to the bnbWallet
      const totalSupply = await bnbTestErc20.totalSupply();
      const walletBalance = await bnbTestErc20.balanceOf(bnbWallet.address);
      expect(totalSupply.eq(walletBalance)).is.true;
    });

    it("Attest Tokens on Avax Bridge", async () => {
      const receipt: ethers.ContractReceipt = await bnbBridge
        .attestToken(bnbTestErc20.address, 0) // set nonce to zero
        .then((tx: ethers.ContractTransaction) => tx.wait());

      // simulate signing the VAA with the mock guardian
      const unsignedMessages = await formatWormholeMessageFromReceipt(
        receipt,
        CHAIN_ID_BSC
      );
      expect(unsignedMessages.length).to.equal(1);
      signedTokenAttestation = guardians.addSignatures(unsignedMessages[0], [
        0,
      ]);
    });

    it("Create Wrapped Token Contract on POLYGON", async () => {
      // create wrapped token on polygon using signedTokenAttestation message
      const receipt: ethers.ContractReceipt = await polygonBridge
        .createWrapped(signedTokenAttestation) // set nonce to zero
        .then((tx: ethers.ContractTransaction) => tx.wait());

      // confirm that the token contract was created
      const wrappedAsset = await polygonBridge.wrappedAsset(
        CHAIN_ID_BSC,
        "0x" + tryNativeToHexString(bnbTestErc20.address, CHAIN_ID_BSC)
      );
      const isWrapped = await polygonBridge.isWrappedAsset(wrappedAsset);
      expect(isWrapped).is.true;
    });
  });

  describe("Verify POLYGON TestERC20", () => {
    const guardians = new MockGuardians(POLYGON_WORMHOLE_GUARDIAN_SET_INDEX, [
      GUARDIAN_PRIVATE_KEY,
    ]);

    let signedTokenAttestation: Buffer;

    it("Tokens Minted to Wallet", async () => {
      // fetch the total supply and confirm it was all minted to the bnbWallet
      const totalSupply = await polygonTestErc20.totalSupply();
      const walletBalance = await polygonTestErc20.balanceOf(polygonWallet.address);
      expect(totalSupply.eq(walletBalance)).is.true;
    });

    it("Attest Tokens on Avax Bridge", async () => {
      const receipt: ethers.ContractReceipt = await polygonBridge
        .attestToken(polygonTestErc20.address, 0) // set nonce to zero
        .then((tx: ethers.ContractTransaction) => tx.wait());

      // simulate signing the VAA with the mock guardian
      const unsignedMessages = await formatWormholeMessageFromReceipt(
        receipt,
        CHAIN_ID_POLYGON
      );
      expect(unsignedMessages.length).to.equal(1);
      signedTokenAttestation = guardians.addSignatures(unsignedMessages[0], [
        0,
      ]);
    });

    it("Create Wrapped Token Contract on BNB", async () => {
      // create wrapped token on bnb using signedTokenAttestation message
      const receipt: ethers.ContractReceipt = await bnbBridge
        .createWrapped(signedTokenAttestation) // set nonce to zero
        .then((tx: ethers.ContractTransaction) => tx.wait());

      // confirm that the token contract was created
      const wrappedAsset = await bnbBridge.wrappedAsset(
        CHAIN_ID_POLYGON,
        "0x" + tryNativeToHexString(polygonTestErc20.address, CHAIN_ID_POLYGON)
      );
      const isWrapped = await bnbBridge.isWrappedAsset(wrappedAsset);
      expect(isWrapped).is.true;
    });
  });
});
