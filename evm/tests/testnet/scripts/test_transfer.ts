import {expect} from "chai";
import {BigNumber, ethers, providers, Wallet} from "ethers";
import {
  CHAIN_ID_AVAX,
  CHAIN_ID_ETH,
  CHAIN_ID_BSC,
  CHAIN_ID_POLYGON,
  tryNativeToHexString,
  ChainId,
} from "@certusone/wormhole-sdk";
import {MockGuardians} from "@certusone/wormhole-sdk/lib/cjs/mock";
import {
  FORK_BNB_CHAIN_ID,
  FORK_POLYGON_CHAIN_ID,
  BNB_HOST,
  BNB_WORMHOLE_ADDRESS,
  BNB_BRIDGE_ADDRESS,
  BNB_WORMHOLE_GUARDIAN_SET_INDEX,
  BNB_WORMHOLE_MESSAGE_FEE,
  POLYGON_HOST,
  POLYGON_WORMHOLE_ADDRESS,
  POLYGON_BRIDGE_ADDRESS,
  POLYGON_WORMHOLE_GUARDIAN_SET_INDEX,
  POLYGON_WORMHOLE_MESSAGE_FEE,
  AVAX_HOST,
  AVAX_WORMHOLE_ADDRESS,
  AVAX_BRIDGE_ADDRESS,
  AVAX_WORMHOLE_GUARDIAN_SET_INDEX,
  FORK_AVAX_CHAIN_ID,
  AVAX_WORMHOLE_MESSAGE_FEE,
  ETH_HOST,
  ETH_WORMHOLE_ADDRESS,
  ETH_WORMHOLE_GUARDIAN_SET_INDEX,
  ETH_BRIDGE_ADDRESS,
  FORK_ETH_CHAIN_ID,
  ETH_WORMHOLE_MESSAGE_FEE,
  USER_WALLET_PRIVATE_KEY,
  RELAYER_WALLET_PRIVATE_KEY,
  GUARDIAN_PRIVATE_KEY,
} from "../helpers/constants";
import {
  formatWormholeMessageFromReceipt,
  readTestERC20ContractAddress,
  readnimbleXChainContractAddress,
  tokenBridgeDenormalizeAmount,
  tokenBridgeNormalizeAmount,
} from "../../helpers/utils";
import {makeContract} from "../../helpers/io";
import {
  nimbleXChain,
  nimbleXChain__factory,
  IWormhole__factory,
  ITokenBridge__factory,
  IWormhole,
  ITokenBridge,
} from "../../../build/src/ethers-contracts";


// TestERC20 ERC20 contract
const testErc20Abi = `${__dirname}/../../../build/out/TestERC20.sol/TestERC20.json`;

interface Info {
  provider: ethers.providers.JsonRpcProvider;
  wallet: ethers.Wallet;
  relayerWallet: ethers.Wallet,
  wormholeContract: IWormhole,
  bridgeContract: ITokenBridge,
  tokenContract: ethers.Contract,
  nimbleXChain: nimbleXChain,
  chainId: ChainId,
  networkId: number,
  messageFee: BigNumber,
  guardianSet: number,
}

function getInfo() {
  // avax wallet
  const avaxProvider = new ethers.providers.StaticJsonRpcProvider(AVAX_HOST);
  const avaxWallet = new ethers.Wallet(USER_WALLET_PRIVATE_KEY, avaxProvider);
  const avaxRelayerWallet = new ethers.Wallet(RELAYER_WALLET_PRIVATE_KEY, avaxProvider);

  // eth wallet
  const ethProvider = new ethers.providers.StaticJsonRpcProvider(ETH_HOST);
  const ethWallet = new ethers.Wallet(USER_WALLET_PRIVATE_KEY, ethProvider);
  const ethRelayerWallet = new ethers.Wallet(RELAYER_WALLET_PRIVATE_KEY, ethProvider);

  // bnb provider & wallet
  const bnbProvider = new providers.JsonRpcProvider(BNB_HOST);
  const bnbWallet = new Wallet(USER_WALLET_PRIVATE_KEY, bnbProvider);
  const bnbRelayerWallet = new Wallet(RELAYER_WALLET_PRIVATE_KEY, bnbProvider);

  // polygon provider & wallet
  const polygonProvider = new providers.JsonRpcProvider(POLYGON_HOST);
  const polygonWallet = new Wallet(USER_WALLET_PRIVATE_KEY, polygonProvider);
  const polygonRelayerWallet = new Wallet(RELAYER_WALLET_PRIVATE_KEY, polygonProvider);

  // wormhole contract
  const avaxWormhole = IWormhole__factory.connect(
    AVAX_WORMHOLE_ADDRESS,
    avaxWallet
  );
  const ethWormhole = IWormhole__factory.connect(
    ETH_WORMHOLE_ADDRESS,
    ethWallet
  );
  const bnbWormhole = IWormhole__factory.connect(
    BNB_WORMHOLE_ADDRESS,
    bnbWallet
  );
  const polygonWormhole = IWormhole__factory.connect(
    POLYGON_WORMHOLE_ADDRESS,
    polygonWallet
  );

  // token bridge contract
  const avaxBridge = ITokenBridge__factory.connect(
    AVAX_BRIDGE_ADDRESS,
    avaxWallet
  );
  const ethBridge = ITokenBridge__factory.connect(
    ETH_BRIDGE_ADDRESS,
    ethWallet
  );
  const bnbBridge = ITokenBridge__factory.connect(
    BNB_BRIDGE_ADDRESS,
    bnbWallet
  );
  const polygonBridge = ITokenBridge__factory.connect(
    POLYGON_BRIDGE_ADDRESS,
    polygonWallet
  );

  // TestERC20 ERC20 contract
  const avaxTestErc20 = makeContract(
    avaxWallet,
    readTestERC20ContractAddress(FORK_AVAX_CHAIN_ID, "testnet"),
    testErc20Abi
  );
  const ethTestErc20 = makeContract(
    ethWallet,
    readTestERC20ContractAddress(FORK_ETH_CHAIN_ID, "testnet"),
    testErc20Abi
  );
  const bnbTestErc20 = makeContract(
    bnbWallet,
    readTestERC20ContractAddress(FORK_BNB_CHAIN_ID, "testnet"),
    testErc20Abi
  );
  const polygonTestErc20 = makeContract(
    polygonWallet,
    readTestERC20ContractAddress(FORK_POLYGON_CHAIN_ID, "testnet"),
    testErc20Abi
  );

  // nimbleXChain contract
  const avaxnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(FORK_AVAX_CHAIN_ID, "testnet"),
    avaxWallet
  );
  const ethnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(FORK_ETH_CHAIN_ID, "testnet"),
    ethWallet
  );
  const bnbnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(FORK_BNB_CHAIN_ID, "testnet"),
    bnbWallet
  );
  const polygonnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(FORK_POLYGON_CHAIN_ID, "testnet"),
    polygonWallet
  );

  const avalanche: Info = {
    provider: avaxProvider,
    wallet: avaxWallet,
    relayerWallet: avaxRelayerWallet,
    wormholeContract: avaxWormhole,
    bridgeContract: avaxBridge,
    tokenContract: avaxTestErc20,
    nimbleXChain: avaxnimbleXChain,
    chainId: CHAIN_ID_AVAX,
    networkId: FORK_AVAX_CHAIN_ID,
    messageFee: AVAX_WORMHOLE_MESSAGE_FEE,
    guardianSet: AVAX_WORMHOLE_GUARDIAN_SET_INDEX,
  };

  const ethereum: Info = {
    provider: ethProvider,
    wallet: ethWallet,
    relayerWallet: ethRelayerWallet,
    wormholeContract: ethWormhole,
    bridgeContract: ethBridge,
    tokenContract: ethTestErc20,
    nimbleXChain: ethnimbleXChain,
    chainId: CHAIN_ID_ETH,
    networkId: FORK_ETH_CHAIN_ID,
    messageFee: ETH_WORMHOLE_MESSAGE_FEE,
    guardianSet: ETH_WORMHOLE_GUARDIAN_SET_INDEX,
  };

  const binance: Info = {
    provider: bnbProvider,
    wallet: bnbWallet,
    relayerWallet: bnbRelayerWallet,
    wormholeContract: bnbWormhole,
    bridgeContract: bnbBridge,
    tokenContract: bnbTestErc20,
    nimbleXChain: bnbnimbleXChain,
    chainId: CHAIN_ID_BSC,
    networkId: FORK_BNB_CHAIN_ID,
    messageFee: BNB_WORMHOLE_MESSAGE_FEE,
    guardianSet: BNB_WORMHOLE_GUARDIAN_SET_INDEX,
  };

  const polygon: Info = {
    provider: polygonProvider,
    wallet: polygonWallet,
    relayerWallet: polygonRelayerWallet,
    wormholeContract: polygonWormhole,
    bridgeContract: polygonBridge,
    tokenContract: polygonTestErc20,
    nimbleXChain: polygonnimbleXChain,
    chainId: CHAIN_ID_POLYGON,
    networkId: FORK_POLYGON_CHAIN_ID,
    messageFee: POLYGON_WORMHOLE_MESSAGE_FEE,
    guardianSet: POLYGON_WORMHOLE_GUARDIAN_SET_INDEX,
  };

  const info : {[key: string]: Info} = {
    "Avalanche": avalanche,
    "Ethereum": ethereum,
    "Binance": binance,
    "Polygon": polygon,
  };

  return info;
}

const localBuffer = getInfo();

const SUPPORTED_CHAINS = ["Avalanche", "Ethereum", "Binance", "Polygon"];

async function testTransfer(srcChainName: string, targetChainName: string) {
  if(!SUPPORTED_CHAINS.includes(srcChainName)) {
    console.log("Not supported chain: ", srcChainName);
    return;
  }
  if(!SUPPORTED_CHAINS.includes(targetChainName)) {
    console.log("Not supported chain: ", targetChainName);
    return;
  }

  describe(`${srcChainName} & ${targetChainName} Transfer Test`, () => {

    describe("Verify Mainnet Forks", () => {
      it(`${srcChainName} Chain ID`, async () => {
        const network = await localBuffer[srcChainName].provider.getNetwork();
        expect(network.chainId).to.equal(localBuffer[srcChainName].networkId);
      });
  
      it(`${targetChainName} Chain ID`, async () => {
        const network = await localBuffer[targetChainName].provider.getNetwork();
        expect(network.chainId).to.equal(localBuffer[targetChainName].networkId);
      });
    });
  
    describe(`Verify ${srcChainName} Wormhole Contract`, () => {
      it("Chain ID", async () => {
        const chainId = await localBuffer[srcChainName].wormholeContract.chainId();
        expect(chainId).to.equal(localBuffer[srcChainName].chainId);
      });
  
      it("Message Fee", async () => {
        const messageFee: ethers.BigNumber = await localBuffer[srcChainName].wormholeContract.messageFee();
        expect(messageFee.eq(localBuffer[srcChainName].messageFee)).to.be.true;
      });
  
      it("Guardian Set", async () => {
        // Check guardian set index
        const guardianSetIndex = await localBuffer[srcChainName].wormholeContract.getCurrentGuardianSetIndex();
        expect(guardianSetIndex).to.equal(localBuffer[srcChainName].guardianSet);
  
        // Override guardian set
        const abiCoder = ethers.utils.defaultAbiCoder;
  
        // Get slot for Guardian Set at the current index
        const guardianSetSlot = ethers.utils.keccak256(
          abiCoder.encode(["uint32", "uint256"], [guardianSetIndex, 2])
        );
  
        // Overwrite all but first guardian set to zero address. This isn't
        // necessary, but just in case we inadvertently access these slots
        // for any reason.
        const numGuardians = await localBuffer[srcChainName].provider
          .getStorageAt(localBuffer[srcChainName].wormholeContract.address, guardianSetSlot)
          .then((value) => ethers.BigNumber.from(value).toBigInt());
        for (let i = 1; i < numGuardians; ++i) {
          await localBuffer[srcChainName].provider.send("anvil_setStorageAt", [
            localBuffer[srcChainName].wormholeContract.address,
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
        await localBuffer[srcChainName].provider.send("anvil_setStorageAt", [
          localBuffer[srcChainName].wormholeContract.address,
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
        await localBuffer[srcChainName].provider.send("anvil_setStorageAt", [
          localBuffer[srcChainName].wormholeContract.address,
          guardianSetSlot,
          ethers.utils.hexZeroPad("0x1", 32),
        ]);
  
        // Confirm guardian set override
        const guardians = await localBuffer[srcChainName].wormholeContract
          .getGuardianSet(guardianSetIndex)
          .then(
            (guardianSet: any) => guardianSet[0] // first element is array of keys
          );
        expect(guardians.length).to.equal(1);
        expect(guardians[0]).to.equal(devnetGuardian);
      });
    });
  
    describe(`Verify ${targetChainName} Wormhole Contract`, () => {
      it("Chain ID", async () => {
        const chainId = await localBuffer[targetChainName].wormholeContract.chainId();
        expect(chainId).to.equal(localBuffer[targetChainName].chainId);
      });
  
      it("Message Fee", async () => {
        const messageFee: ethers.BigNumber = await localBuffer[targetChainName].wormholeContract.messageFee();
        expect(messageFee.eq(localBuffer[targetChainName].messageFee)).to.be.true;
      });
  
      it("Guardian Set", async () => {
        // Check guardian set index
        const guardianSetIndex = await localBuffer[targetChainName].wormholeContract.getCurrentGuardianSetIndex();
        expect(guardianSetIndex).to.equal(localBuffer[targetChainName].guardianSet);
  
        // Override guardian set
        const abiCoder = ethers.utils.defaultAbiCoder;
  
        // Get slot for Guardian Set at the current index
        const guardianSetSlot = ethers.utils.keccak256(
          abiCoder.encode(["uint32", "uint256"], [guardianSetIndex, 2])
        );
  
        // Overwrite all but first guardian set to zero address. This isn't
        // necessary, but just in case we inadvertently access these slots
        // for any reason.
        const numGuardians = await localBuffer[targetChainName].provider
          .getStorageAt(localBuffer[targetChainName].wormholeContract.address, guardianSetSlot)
          .then((value) => ethers.BigNumber.from(value).toBigInt());
        for (let i = 1; i < numGuardians; ++i) {
          await localBuffer[targetChainName].provider.send("anvil_setStorageAt", [
            localBuffer[targetChainName].wormholeContract.address,
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
        await localBuffer[targetChainName].provider.send("anvil_setStorageAt", [
          localBuffer[targetChainName].wormholeContract.address,
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
        await localBuffer[targetChainName].provider.send("anvil_setStorageAt", [
          localBuffer[targetChainName].wormholeContract.address,
          guardianSetSlot,
          ethers.utils.hexZeroPad("0x1", 32),
        ]);
  
        // Confirm guardian set override
        const guardians = await localBuffer[targetChainName].wormholeContract.getGuardianSet(guardianSetIndex).then(
          (guardianSet: any) => guardianSet[0] // first element is array of keys
        );
        expect(guardians.length).to.equal(1);
        expect(guardians[0]).to.equal(devnetGuardian);
      });
    });
  
    describe(`Verify ${srcChainName} Bridge Contract`, () => {
      it("Chain ID", async () => {
        const chainId = await localBuffer[srcChainName].bridgeContract.chainId();
        expect(chainId).to.equal(localBuffer[srcChainName].chainId);
      });
      it("Wormhole", async () => {
        const wormhole = await localBuffer[srcChainName].bridgeContract.wormhole();
        expect(wormhole).to.equal(localBuffer[srcChainName].wormholeContract.address);
      });
    });
  
    describe(`Verify ${targetChainName} Bridge Contract`, () => {
      it("Chain ID", async () => {
        const chainId = await localBuffer[targetChainName].bridgeContract.chainId();
        expect(chainId).to.equal(localBuffer[targetChainName].chainId);
      });
      it("Wormhole", async () => {
        const wormhole = await localBuffer[targetChainName].bridgeContract.wormhole();
        expect(wormhole).to.equal(localBuffer[targetChainName].wormholeContract.address);
      });
    });
  
    describe("Check wormhole-sdk", () => {
      it("tryNativeToHexString", async () => {
        const accounts = await localBuffer[srcChainName].provider.listAccounts();
        expect(tryNativeToHexString(accounts[0], "ethereum")).to.equal(
          "00000000000000000000000090f8bf6a479f320ead074411a4b0e7944ea8c9c1"
        );
      });
    });
  
    describe(`Verify ${srcChainName} TestERC20`, () => {
      const guardians = new MockGuardians(localBuffer[srcChainName].guardianSet, [
        GUARDIAN_PRIVATE_KEY,
      ]);
  
      let signedTokenAttestation: Buffer;
  
      it(`Attest Tokens on ${srcChainName} Bridge`, async () => {
        const receipt: ethers.ContractReceipt = await localBuffer[srcChainName].bridgeContract
          .attestToken(localBuffer[srcChainName].tokenContract.address, 0) // set nonce to zero
          .then((tx: ethers.ContractTransaction) => tx.wait());
  
        // simulate signing the VAA with the mock guardian
        const unsignedMessages = await formatWormholeMessageFromReceipt(
          receipt,
          localBuffer[srcChainName].chainId
        );
        expect(unsignedMessages.length).to.equal(1);
        signedTokenAttestation = guardians.addSignatures(unsignedMessages[0], [
          0,
        ]);
      });
  
      it(`Create Wrapped Token Contract on ${targetChainName}`, async () => {
        // create wrapped token on polygon using signedTokenAttestation message
        const receipt: ethers.ContractReceipt = await localBuffer[targetChainName].bridgeContract
          .createWrapped(signedTokenAttestation) // set nonce to zero
          .then((tx: ethers.ContractTransaction) => tx.wait());
  
        // confirm that the token contract was created
        const wrappedAsset = await localBuffer[targetChainName].bridgeContract.wrappedAsset(
          localBuffer[srcChainName].chainId,
          "0x" + tryNativeToHexString(localBuffer[srcChainName].tokenContract.address, localBuffer[srcChainName].chainId)
        );
        const isWrapped = await localBuffer[targetChainName].bridgeContract.isWrappedAsset(wrappedAsset);
        expect(isWrapped).is.true;
      });
    });
  
    describe(`Verify ${targetChainName} TestERC20`, () => {
      const guardians = new MockGuardians(localBuffer[targetChainName].guardianSet, [
        GUARDIAN_PRIVATE_KEY,
      ]);
  
      let signedTokenAttestation: Buffer;
  
      it(`Attest Tokens on ${targetChainName} Bridge`, async () => {
        const receipt: ethers.ContractReceipt = await localBuffer[targetChainName].bridgeContract
          .attestToken(localBuffer[targetChainName].tokenContract.address, 0) // set nonce to zero
          .then((tx: ethers.ContractTransaction) => tx.wait());
  
        // simulate signing the VAA with the mock guardian
        const unsignedMessages = await formatWormholeMessageFromReceipt(
          receipt,
          localBuffer[targetChainName].chainId
        );
        expect(unsignedMessages.length).to.equal(1);
        signedTokenAttestation = guardians.addSignatures(unsignedMessages[0], [
          0,
        ]);
      });
  
      it(`Create Wrapped Token Contract on ${srcChainName}`, async () => {
        // create wrapped token on bnb using signedTokenAttestation message
        const receipt: ethers.ContractReceipt = await localBuffer[srcChainName].bridgeContract
          .createWrapped(signedTokenAttestation) // set nonce to zero
          .then((tx: ethers.ContractTransaction) => tx.wait());
  
        // confirm that the token contract was created
        const wrappedAsset = await localBuffer[srcChainName].bridgeContract.wrappedAsset(
          localBuffer[targetChainName].chainId,
          "0x" + tryNativeToHexString(localBuffer[targetChainName].tokenContract.address, localBuffer[targetChainName].chainId)
        );
        const isWrapped = await localBuffer[srcChainName].bridgeContract.isWrappedAsset(wrappedAsset);
        expect(isWrapped).is.true;
      });
    });

    describe("Test Contract Deployment and Emitter Registration", () => {
      it(`Verify ${srcChainName} Contract Deployment`, async () => {
        // confirm chainId
        const deployedChainId = await localBuffer[srcChainName].nimbleXChain.getChainId();
        expect(deployedChainId).to.equal(localBuffer[srcChainName].chainId);
      });
  
      it(`Verify ${targetChainName} Contract Deployment`, async () => {
        // confirm chainId
        const deployedChainId = await localBuffer[targetChainName].nimbleXChain.getChainId();
        expect(deployedChainId).to.equal(localBuffer[targetChainName].chainId);
      });
  
      it(`Should Register nimbleXChain Contract Emitter on ${srcChainName}`, async () => {
        // Convert the target contract address to bytes32, since other
        // non-evm blockchains (e.g. Solana) have 32 byte wallet addresses.
        const targetContractAddressHex =
          "0x" + tryNativeToHexString(localBuffer[targetChainName].nimbleXChain.address, localBuffer[targetChainName].chainId);
  
        // register the emitter
        const receipt = await localBuffer[srcChainName].nimbleXChain
          .registerEmitter(localBuffer[targetChainName].chainId, targetContractAddressHex)
          .then((tx: ethers.ContractTransaction) => tx.wait())
          .catch((msg: any) => {
            // should not happen
            console.log(msg);
            return null;
          });
        expect(receipt).is.not.null;
  
        // query the contract and confirm that the emitter is set in storage
        const emitterInContractState = await localBuffer[srcChainName].nimbleXChain.getRegisteredEmitter(
          localBuffer[targetChainName].chainId
        );
        expect(emitterInContractState).to.equal(targetContractAddressHex);
      });
  
      it(`Should Register nimbleXChain Contract Emitter on ${targetChainName}`, async () => {
        // Convert the target contract address to bytes32, since other
        // non-evm blockchains (e.g. Solana) have 32 byte wallet addresses.
        const targetContractAddressHex =
          "0x" + tryNativeToHexString(localBuffer[srcChainName].nimbleXChain.address, localBuffer[srcChainName].chainId);
  
        // register the emitter
        const receipt = await localBuffer[targetChainName].nimbleXChain
          .registerEmitter(localBuffer[srcChainName].chainId, targetContractAddressHex)
          .then((tx: ethers.ContractTransaction) => tx.wait())
          .catch((msg: any) => {
            // should not happen
            console.log(msg);
            return null;
          });
        expect(receipt).is.not.null;
  
        // query the contract and confirm that the emitter is set in storage
        const emitterInContractState = await localBuffer[targetChainName].nimbleXChain.getRegisteredEmitter(
          localBuffer[srcChainName].chainId
        );
        expect(emitterInContractState).to.equal(targetContractAddressHex);
      });
    });

    describe("Test nimbleXChain Interface", () => {
      // simulated guardian that signs wormhole messages
      const guardians = new MockGuardians(localBuffer[srcChainName].guardianSet, [
        GUARDIAN_PRIVATE_KEY,
      ]);
    
      let localStorage: any = {};
    
      it(`Should Transfer testERC20 Tokens From ${targetChainName} to ${srcChainName}`, async () => {
        // define the transfer amount
        localStorage.transferAmountFromTargetChain = ethers.utils.parseUnits(
          "100",
          await localBuffer[targetChainName].tokenContract.decimals()
        );
    
        // increase allowance
        {
          const receipt = await localBuffer[targetChainName].tokenContract
            .approve(localBuffer[targetChainName].nimbleXChain.address, localStorage.transferAmountFromTargetChain)
            .then((tx: ethers.ContractTransaction) => tx.wait())
            .catch((msg: any) => {
              // should not happen
              console.log(msg);
              return null;
            });
          expect(receipt).is.not.null;
        }
    
        // grab token balance before performing the transfer
        const balanceBefore = await localBuffer[targetChainName].tokenContract.balanceOf(localBuffer[targetChainName].wallet.address);
    
        // call sendTokensWithPayload
        const receipt = await localBuffer[targetChainName].nimbleXChain
          .sendTokensWithPayload(
            localBuffer[targetChainName].tokenContract.address,
            localStorage.transferAmountFromTargetChain,
            localBuffer[srcChainName].chainId, // targetChainId
            0, // batchId=0 to opt out of batching
            "0x" + tryNativeToHexString(localBuffer[srcChainName].wallet.address, localBuffer[srcChainName].chainId)
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
        const balanceAfter = await localBuffer[targetChainName].tokenContract.balanceOf(localBuffer[targetChainName].wallet.address);
        expect(
          balanceBefore.sub(balanceAfter).eq(localStorage.transferAmountFromTargetChain)
        ).is.true;
    
        // now grab the Wormhole message
        const unsignedMessages = await formatWormholeMessageFromReceipt(
          receipt!,
          localBuffer[targetChainName].chainId
        );
        expect(unsignedMessages.length).to.equal(1);
    
        // sign the TransferWithPayload message
        localStorage.signedTransferMessage = Uint8Array.from(
          guardians.addSignatures(unsignedMessages[0], [0])
        );
        expect(localStorage.signedTransferMessage).is.not.null;
      });
    
      it(`Should Redeem Wrapped testERC20 tokens on ${srcChainName}`, async () => {
        // fetch the token bridge wrapper for the transferred token
        const wrappedTokenOnSrcChain = await localBuffer[srcChainName].bridgeContract.wrappedAsset(
          localBuffer[targetChainName].chainId,
          "0x" + tryNativeToHexString(localBuffer[targetChainName].tokenContract.address, localBuffer[targetChainName].chainId)
        );
    
        // create token contract for the wrapped asset
        const wrappedTokenContract = makeContract(
          localBuffer[srcChainName].wallet,
          wrappedTokenOnSrcChain,
          testErc20Abi
        );
    
        // Check the balance of the recipient and relayer wallet before
        // redeeming the token transfer.
        const relayerBalanceBefore = await wrappedTokenContract.balanceOf(
          localBuffer[srcChainName].relayerWallet.address
        );
        const recipientBalanceBefore = await wrappedTokenContract.balanceOf(
          localBuffer[srcChainName].wallet.address
        );
    
        // Invoke the nimbleXChain contract to redeem the transfer, passing the
        // encoded Wormhole message. Invoke this method using the localBuffer[srcChainName].relayerWallet
        // to confirm that the contract handles relayer payouts correctly.
        const receipt = await localBuffer[srcChainName].nimbleXChain
          .connect(localBuffer[srcChainName].relayerWallet) // change signer
          .redeemTransferWithPayload(localStorage.signedTransferMessage)
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
    
        // fetch the balances after redeeming the token transfer
        const relayerBalanceAfter = await wrappedTokenContract.balanceOf(
          localBuffer[srcChainName].relayerWallet.address
        );
        const recipientBalanceAfter = await wrappedTokenContract.balanceOf(
          localBuffer[srcChainName].wallet.address
        );
    
        // compute the relayer fee using the denormalized transfer amount
        let relayerFee: ethers.BigNumber;
        let denormalizedTransferAmount: ethers.BigNumber;
        {
          const wrappedTokenDecimals = await wrappedTokenContract.decimals();
          denormalizedTransferAmount = tokenBridgeDenormalizeAmount(
            tokenBridgeNormalizeAmount(
              localStorage.transferAmountFromTargetChain,
              wrappedTokenDecimals
            ),
            wrappedTokenDecimals
          );
    
          // calculate the relayer fee
          relayerFee = await localBuffer[srcChainName].nimbleXChain.calculateRelayerFee(
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
    
        // clear localStorage
        localStorage = {};
    
        // Save the recipient balance change and wrapped token contract for the
        // next test.
        localStorage.srcWalletWrappedTokenBalance = recipientBalanceAfter.sub(
          recipientBalanceBefore
        );
        localStorage.wrappedTokenContract = wrappedTokenContract;
      });
    
      it(`Should Transfer Wrapped testERC20 Tokens From ${srcChainName} to ${targetChainName}`, async () => {
        // increase allowance
        {
          const receipt = await localStorage.wrappedTokenContract
            .approve(
              localBuffer[srcChainName].nimbleXChain.address,
              localStorage.srcWalletWrappedTokenBalance
            )
            .then((tx: ethers.ContractTransaction) => tx.wait())
            .catch((msg: any) => {
              // should not happen
              console.log(msg);
              return null;
            });
          expect(receipt).is.not.null;
        }
    
        // grab token balance before performing the transfer
        const balanceBefore = await localStorage.wrappedTokenContract.balanceOf(
          localBuffer[srcChainName].wallet.address
        );
    
        // call sendTokensWithPayload
        const receipt = await localBuffer[srcChainName].nimbleXChain
          .sendTokensWithPayload(
            localStorage.wrappedTokenContract.address,
            localStorage.srcWalletWrappedTokenBalance,
            localBuffer[targetChainName].chainId, // targetChainId
            0, // batchId=0 to opt out of batching
            "0x" + tryNativeToHexString(localBuffer[targetChainName].wallet.address, localBuffer[targetChainName].chainId)
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
        const balanceAfter = await localStorage.wrappedTokenContract.balanceOf(
          localBuffer[srcChainName].wallet.address
        );
        expect(
          balanceBefore
            .sub(balanceAfter)
            .eq(localStorage.srcWalletWrappedTokenBalance)
        ).is.true;
    
        // now grab the Wormhole message
        const unsignedMessages = await formatWormholeMessageFromReceipt(
          receipt!,
          localBuffer[srcChainName].chainId
        );
        expect(unsignedMessages.length).to.equal(1);
    
        // clear localStorage
        localStorage = {};
    
        // sign the TransferWithPayload message
        localStorage.signedTransferMessage = Uint8Array.from(
          guardians.addSignatures(unsignedMessages[0], [0])
        );
        expect(localStorage.signedTransferMessage).is.not.null;
    
        // save the balance change
        localStorage.transferAmountFromSrcChain = balanceBefore.sub(balanceAfter);
      });
    
      it(`Should Redeem Unwrapped testERC20 tokens on ${targetChainName}`, async () => {
        // Check the balance of the recipient and relayer wallet before
        // redeeming the token transfer.
        const relayerBalanceBefore = await localBuffer[targetChainName].tokenContract.balanceOf(
          localBuffer[targetChainName].relayerWallet.address
        );
        const recipientBalanceBefore = await localBuffer[targetChainName].tokenContract.balanceOf(
          localBuffer[targetChainName].wallet.address
        );
    
        // Invoke the nimbleXChain contract to redeem the transfer, passing the
        // encoded Wormhole message. Invoke this method using the localBuffer[srcChainName].relayerWallet
        // to confirm that the contract handles relayer payouts correctly.
        const receipt = await localBuffer[targetChainName].nimbleXChain
          .connect(localBuffer[targetChainName].relayerWallet) // change signer
          .redeemTransferWithPayload(localStorage.signedTransferMessage)
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
    
        // fetch the balances after redeeming the token transfer
        const relayerBalanceAfter = await localBuffer[targetChainName].tokenContract.balanceOf(
          localBuffer[targetChainName].relayerWallet.address
        );
        const recipientBalanceAfter = await localBuffer[targetChainName].tokenContract.balanceOf(
          localBuffer[targetChainName].wallet.address
        );
    
        // compute the relayer fee using the denormalized transfer amount
        let relayerFee: ethers.BigNumber;
        let denormalizedTransferAmount: ethers.BigNumber;
        {
          const tokenDecimals = await localBuffer[targetChainName].tokenContract.decimals();
          denormalizedTransferAmount = tokenBridgeDenormalizeAmount(
            tokenBridgeNormalizeAmount(
              localStorage.transferAmountFromSrcChain,
              tokenDecimals
            ),
            tokenDecimals
          );
    
          // calculate the relayer fee
          relayerFee = await localBuffer[targetChainName].nimbleXChain.calculateRelayerFee(
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
    
        // clear localStorage
        localStorage = {};
      });
    
      it(`Should Transfer testERC20 Tokens From ${srcChainName} to ${targetChainName}`, async () => {
        // define the transfer amount
        localStorage.transferAmountFromSrcChain = ethers.utils.parseUnits(
          "100",
          await localBuffer[srcChainName].tokenContract.decimals()
        );
    
        // increase allowance
        {
          const receipt = await localBuffer[srcChainName].tokenContract
            .approve(localBuffer[srcChainName].nimbleXChain.address, localStorage.transferAmountFromSrcChain)
            .then((tx: ethers.ContractTransaction) => tx.wait())
            .catch((msg: any) => {
              // should not happen
              console.log(msg);
              return null;
            });
          expect(receipt).is.not.null;
        }
    
        // grab token balance before performing the transfer
        const balanceBefore = await localBuffer[srcChainName].tokenContract.balanceOf(localBuffer[srcChainName].wallet.address);
    
        // call sendTokensWithPayload
        const receipt = await localBuffer[srcChainName].nimbleXChain
          .sendTokensWithPayload(
            localBuffer[srcChainName].tokenContract.address,
            localStorage.transferAmountFromSrcChain,
            localBuffer[targetChainName].chainId, // targetChainId
            0, // batchId=0 to opt out of batching
            "0x" + tryNativeToHexString(localBuffer[targetChainName].wallet.address, localBuffer[targetChainName].chainId)
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
        const balanceAfter = await localBuffer[srcChainName].tokenContract.balanceOf(localBuffer[srcChainName].wallet.address);
        expect(
          balanceBefore.sub(balanceAfter).eq(localStorage.transferAmountFromSrcChain)
        ).is.true;
    
        // now grab the Wormhole message
        const unsignedMessages = await formatWormholeMessageFromReceipt(
          receipt!,
          localBuffer[srcChainName].chainId
        );
        expect(unsignedMessages.length).to.equal(1);
    
        // sign the TransferWithPayload message
        localStorage.signedTransferMessage = Uint8Array.from(
          guardians.addSignatures(unsignedMessages[0], [0])
        );
        expect(localStorage.signedTransferMessage).is.not.null;
      });
    
      it(`Should Redeem Wrapped testERC20 tokens on ${targetChainName}`, async () => {
        // fetch the token bridge wrapper for the transferred token
        const wrappedTokenOnTargetChain = await localBuffer[targetChainName].bridgeContract.wrappedAsset(
          localBuffer[srcChainName].chainId,
          "0x" + tryNativeToHexString(localBuffer[srcChainName].tokenContract.address, localBuffer[srcChainName].chainId)
        );
    
        // create token contract for the wrapped asset
        const wrappedTokenContract = makeContract(
          localBuffer[targetChainName].wallet,
          wrappedTokenOnTargetChain,
          testErc20Abi
        );
    
        // Check the balance of the recipient and relayer wallet before
        // redeeming the token transfer.
        const relayerBalanceBefore = await wrappedTokenContract.balanceOf(
          localBuffer[targetChainName].relayerWallet.address
        );
        const recipientBalanceBefore = await wrappedTokenContract.balanceOf(
          localBuffer[targetChainName].wallet.address
        );
    
        // Invoke the nimbleXChain contract to redeem the transfer, passing the
        // encoded Wormhole message. Invoke this method using the localBuffer[srcChainName].relayerWallet
        // to confirm that the contract handles relayer payouts correctly.
        const receipt = await localBuffer[targetChainName].nimbleXChain
          .connect(localBuffer[targetChainName].relayerWallet) // change signer
          .redeemTransferWithPayload(localStorage.signedTransferMessage)
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
    
        // fetch the balances after redeeming the token transfer
        const relayerBalanceAfter = await wrappedTokenContract.balanceOf(
          localBuffer[targetChainName].relayerWallet.address
        );
        const recipientBalanceAfter = await wrappedTokenContract.balanceOf(
          localBuffer[targetChainName].wallet.address
        );
    
        // compute the relayer fee using the denormalized transfer amount
        let relayerFee: ethers.BigNumber;
        let denormalizedTransferAmount: ethers.BigNumber;
        {
          const wrappedTokenDecimals = await wrappedTokenContract.decimals();
          denormalizedTransferAmount = tokenBridgeDenormalizeAmount(
            tokenBridgeNormalizeAmount(
              localStorage.transferAmountFromSrcChain,
              wrappedTokenDecimals
            ),
            wrappedTokenDecimals
          );
    
          // calculate the relayer fee
          relayerFee = await localBuffer[targetChainName].nimbleXChain.calculateRelayerFee(
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
    
        // clear localStorage
        localStorage = {};
    
        // Save the recipient balance change and wrapped token contract for the
        // next test.
        localStorage.targetWalletWrappedTokenBalance = recipientBalanceAfter.sub(
          recipientBalanceBefore
        );
        localStorage.wrappedTokenContract = wrappedTokenContract;
      });
    
      it(`Should Transfer Wrapped testERC20 Tokens From ${targetChainName} to ${srcChainName}`, async () => {
        // increase allowance
        {
          const receipt = await localStorage.wrappedTokenContract
            .approve(
              localBuffer[targetChainName].nimbleXChain.address,
              localStorage.targetWalletWrappedTokenBalance
            )
            .then((tx: ethers.ContractTransaction) => tx.wait())
            .catch((msg: any) => {
              // should not happen
              console.log(msg);
              return null;
            });
          expect(receipt).is.not.null;
        }
    
        // grab token balance before performing the transfer
        const balanceBefore = await localStorage.wrappedTokenContract.balanceOf(
          localBuffer[targetChainName].wallet.address
        );
    
        // call sendTokensWithPayload
        const receipt = await localBuffer[targetChainName].nimbleXChain
          .sendTokensWithPayload(
            localStorage.wrappedTokenContract.address,
            localStorage.targetWalletWrappedTokenBalance,
            localBuffer[srcChainName].chainId, // targetChainId
            0, // batchId=0 to opt out of batching
            "0x" + tryNativeToHexString(localBuffer[srcChainName].wallet.address, localBuffer[srcChainName].chainId)
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
        const balanceAfter = await localStorage.wrappedTokenContract.balanceOf(
          localBuffer[targetChainName].wallet.address
        );
        expect(
          balanceBefore
            .sub(balanceAfter)
            .eq(localStorage.targetWalletWrappedTokenBalance)
        ).is.true;
    
        // now grab the Wormhole message
        const unsignedMessages = await formatWormholeMessageFromReceipt(
          receipt!,
          localBuffer[targetChainName].chainId
        );
        expect(unsignedMessages.length).to.equal(1);
    
        // clear localStorage
        localStorage = {};
    
        // sign the TransferWithPayload message
        localStorage.signedTransferMessage = Uint8Array.from(
          guardians.addSignatures(unsignedMessages[0], [0])
        );
        expect(localStorage.signedTransferMessage).is.not.null;
    
        // save the balance change
        localStorage.transferAmountFromTargetChain = balanceBefore.sub(balanceAfter);
      });
    
      it(`Should Redeem Unwrapped testERC20 tokens on ${srcChainName}`, async () => {
        // Check the balance of the recipient and relayer wallet before
        // redeeming the token transfer.
        const relayerBalanceBefore = await localBuffer[srcChainName].tokenContract.balanceOf(
          localBuffer[srcChainName].relayerWallet.address
        );
        const recipientBalanceBefore = await localBuffer[srcChainName].tokenContract.balanceOf(
          localBuffer[srcChainName].wallet.address
        );
    
        // Invoke the nimbleXChain contract to redeem the transfer, passing the
        // encoded Wormhole message. Invoke this method using the localBuffer[srcChainName].relayerWallet
        // to confirm that the contract handles relayer payouts correctly.
        const receipt = await localBuffer[srcChainName].nimbleXChain
          .connect(localBuffer[srcChainName].relayerWallet) // change signer
          .redeemTransferWithPayload(localStorage.signedTransferMessage)
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
    
        // fetch the balances after redeeming the token transfer
        const relayerBalanceAfter = await localBuffer[srcChainName].tokenContract.balanceOf(
          localBuffer[srcChainName].relayerWallet.address
        );
        const recipientBalanceAfter = await localBuffer[srcChainName].tokenContract.balanceOf(
          localBuffer[srcChainName].wallet.address
        );
    
        // compute the relayer fee using the denormalized transfer amount
        let relayerFee: ethers.BigNumber;
        let denormalizedTransferAmount: ethers.BigNumber;
        {
          const tokenDecimals = await localBuffer[srcChainName].tokenContract.decimals();
          denormalizedTransferAmount = tokenBridgeDenormalizeAmount(
            tokenBridgeNormalizeAmount(
              localStorage.transferAmountFromTargetChain,
              tokenDecimals
            ),
            tokenDecimals
          );
    
          // calculate the relayer fee
          relayerFee = await localBuffer[srcChainName].nimbleXChain.calculateRelayerFee(
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
    
        // clear localStorage
        localStorage = {};
      });
    });
  }); 
}

async function test() {
  await testTransfer("Binance", "Polygon");
  await testTransfer("Binance", "Avalanche");
  await testTransfer("Binance", "Ethereum");
  await testTransfer("Polygon", "Avalanche");
  await testTransfer("Polygon", "Ethereum");
  await testTransfer("Ethereum", "Avalanche");
}

test();
