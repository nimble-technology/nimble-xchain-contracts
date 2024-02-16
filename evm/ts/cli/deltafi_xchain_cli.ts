import { Command } from "commander";
import * as os from "os";
import * as child_process from "child_process";

import {BigNumber, ethers, providers, Wallet} from "ethers";
import {
  // chain ids
  CHAIN_ID_AVAX,
  CHAIN_ID_ARBITRUM,
  CHAIN_ID_BSC,
  CHAIN_ID_OPTIMISM,
  CHAIN_ID_POLYGON,
  // utils
  tryNativeToHexString,
} from "@certusone/wormhole-sdk";
import {
  // keys
  USER_WALLET_PRIVATE_KEY,
  // endpoints
  ARBITRUM_ENDPOINT,
  AVAX_ENDPOINT,
  BNB_ENDPOINT,
  OPTIMISM_ENDPOINT,
  POLYGON_ENDPOINT,
  // chain ids
  ARBITRUM_CHAIN_ID,
  AVAX_CHAIN_ID,
  BNB_CHAIN_ID,
  OPTIMISM_CHAIN_ID,
  POLYGON_CHAIN_ID,
  // fees
  RELAYER_FEE_PRECISION,
  RELAYER_FEE_PERCENTAGE,
} from "../../../constants/constants"
import {
  readnimbleXChainContractAddress,
} from "../../tests/helpers/utils";
import {
  nimbleXChain,
  nimbleXChain__factory,
} from "../../build/src/ethers-contracts";

const SUPPORTED_CHAINS = ["Arbitrum", "Avalanche", "Binance", "Optimism", "Polygon"];

interface chainInfoType {
  [key: string]: {
    chainAddr: string,
    chainId: any,
  }
};

function checkChains(chainname: string) {
  return SUPPORTED_CHAINS.includes(chainname);
}

function runCommand(command: string) {
  console.info(`Running: ${command}`);
  child_process.execSync(command, { stdio: "inherit" });
}

async function deploySmartContract() {
  runCommand(
    `make bnb-polygon-mainnet-deploy`
  );
}

async function registerEmitter() {

  // Providers & wallets
  const arbitrumProvider = new providers.JsonRpcProvider(ARBITRUM_ENDPOINT);
  const arbitrumWallet = new Wallet(USER_WALLET_PRIVATE_KEY, arbitrumProvider);

  const avaxProvider = new providers.JsonRpcProvider(AVAX_ENDPOINT);
  const avaxWallet = new Wallet(USER_WALLET_PRIVATE_KEY, avaxProvider);

  const bnbProvider = new providers.JsonRpcProvider(BNB_ENDPOINT);
  const bnbWallet = new Wallet(USER_WALLET_PRIVATE_KEY, bnbProvider);

  const optimismProvider = new providers.JsonRpcProvider(OPTIMISM_ENDPOINT);
  const optimisWallet = new Wallet(USER_WALLET_PRIVATE_KEY, optimismProvider);

  const polygonProvider = new providers.JsonRpcProvider(POLYGON_ENDPOINT);
  const polygonWallet = new Wallet(USER_WALLET_PRIVATE_KEY, polygonProvider);

  // nimbleXChain contracts
  const arbitrumnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(ARBITRUM_CHAIN_ID),
    arbitrumWallet
    );
  
  const avaxnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(AVAX_CHAIN_ID),
    avaxWallet
  );

  const bnbnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(BNB_CHAIN_ID),
    bnbWallet
  );

  const optimismnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(OPTIMISM_CHAIN_ID),
    optimisWallet
  );

  const polygonnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(POLYGON_CHAIN_ID),
    polygonWallet
  );

  const chainInfo: chainInfoType = {
    Arbitrum: {
      chainAddr: arbitrumnimbleXChain.address,
      chainId: CHAIN_ID_ARBITRUM,
    },
    Avalanche: {
      chainAddr: avaxnimbleXChain.address,
      chainId: CHAIN_ID_AVAX,
    },
    Binance: {
      chainAddr: bnbnimbleXChain.address,
      chainId: CHAIN_ID_BSC,
    },
    Optimism: {
      chainAddr: optimismnimbleXChain.address,
      chainId: CHAIN_ID_OPTIMISM,
    },
    Polygon: {
      chainAddr: polygonnimbleXChain.address,
      chainId: CHAIN_ID_POLYGON,
    },
  }

  // Register bridge contracts
  {
    await registerBridge("Arbitrum", chainInfo, arbitrumnimbleXChain);
  }

  {
    await registerBridge("Avalanche", chainInfo, arbitrumnimbleXChain);
  }

  {
    await registerBridge("Binance", chainInfo, bnbnimbleXChain);
  }

  {
    await registerBridge("Optimism", chainInfo, optimismnimbleXChain);
  }

  {
    await registerBridge("Polygon", chainInfo, polygonnimbleXChain);
  }
}

async function registerBridge(chainName: string, chainInfo: chainInfoType, nimbleXchain: nimbleXChain) {
  for (const chain of SUPPORTED_CHAINS) {
    if (chain !== chainName) {
      const targetContractAddressHex =
          "0x" + tryNativeToHexString(chainInfo[chainName].chainAddr, chainInfo[chainName].chainId);

      // register the emitter
      const receipt = await nimbleXchain
          .registerEmitter(chainInfo[chainName].chainId, targetContractAddressHex)
          .then((tx: ethers.ContractTransaction) => tx.wait())
          .catch((msg: any) => {
            // should not happen
            console.log(msg);
            return null;
          });
      return receipt;
    }
  }
}

async function updateRelayerFee() {
  // Providers & wallets
  const arbitrumProvider = new providers.JsonRpcProvider(ARBITRUM_ENDPOINT);
  const arbitrumWallet = new Wallet(USER_WALLET_PRIVATE_KEY, arbitrumProvider);

  const avalancheProvider = new providers.JsonRpcProvider(AVAX_ENDPOINT);
  const avalancheWallet = new Wallet(USER_WALLET_PRIVATE_KEY, avalancheProvider);

  const bnbProvider = new providers.JsonRpcProvider(BNB_ENDPOINT);
  const bnbWallet = new Wallet(USER_WALLET_PRIVATE_KEY, bnbProvider);

  const optimismProvider = new providers.JsonRpcProvider(OPTIMISM_ENDPOINT);
  const optimismWallet = new Wallet(USER_WALLET_PRIVATE_KEY, optimismProvider);

  const polygonProvider = new providers.JsonRpcProvider(POLYGON_ENDPOINT);
  const polygonWallet = new Wallet(USER_WALLET_PRIVATE_KEY, polygonProvider);

  // Connect contracts
  const arbitrumnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(ARBITRUM_CHAIN_ID),
    arbitrumWallet
  );

  const avalanchenimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(AVAX_CHAIN_ID),
    avalancheWallet
  );

  const bnbnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(BNB_CHAIN_ID),
    bnbWallet
  );

  const optimismnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(OPTIMISM_CHAIN_ID),
    optimismWallet
  );

  const polygonnimbleXChain = nimbleXChain__factory.connect(
    readnimbleXChainContractAddress(POLYGON_CHAIN_ID),
    polygonWallet
  );

  // Update relayer fees
  {
    updateBridgeRelayerFee(arbitrumnimbleXChain);
  }

  {
    updateBridgeRelayerFee(avalanchenimbleXChain);
  }

  {
    updateBridgeRelayerFee(bnbnimbleXChain);
  }

  {
    updateBridgeRelayerFee(optimismnimbleXChain);
  }

  {
    updateBridgeRelayerFee(polygonnimbleXChain);
  }
}

function updateBridgeRelayerFee(nimbleXchain: nimbleXChain) {
  // set the new relayer fee
  nimbleXchain.updateRelayerFee(
    RELAYER_FEE_PERCENTAGE,
    RELAYER_FEE_PRECISION
  )
  .then((tx: ethers.ContractTransaction) => tx.wait())
  .catch((msg: any) => {
    // should not happen
    console.log(msg);
    return null;
  });
}

function main() {
  const program = new Command();

  program
    .command("deploy")
    .action(async () => {
      await deploySmartContract();
    });

  program
    .command("register-emitter")
    .action(async () => {
      await registerEmitter();
    });

  program
  .command("update-relayer-fee")
  .action(async () => {
    await updateRelayerFee();
  });

  program.parse(process.argv);
}

main();
