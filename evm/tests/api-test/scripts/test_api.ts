import {expect} from "chai";
import {Wallet} from "ethers";
import {
  ARBITRUM_USDC_ADDRESS,
  AVALANCHE_USDC_ADDRESS,
  BNB_USDC_ADDRESS,
  OPTIMISM_USDC_ADDRESS,
  POLYGON_USDC_ADDRESS,
  USER_WALLET_PRIVATE_KEY,
} from "../../../../constants/constants";
import {localBuffer, getRelayerFee, transferToken} from "../../../ts/api/xchain";
import {mockApprove, mockRegister} from "../helpers/utils";

async function test_relayer_fee(chainName: string, amount: number) {
  const relayerFee = await getRelayerFee(chainName, amount);
  expect(relayerFee).to.equal(amount * 0.01);
}

async function test_transfer(srcChainName: string, userPrivateKey: string, srcTokenAddress: string, transferAmount: number, targetChainName: string) {
  const provider = localBuffer[targetChainName].provider;
  const wallet = new Wallet(userPrivateKey, provider);
  const targetWalletAddress = wallet.address;

  await mockApprove(srcChainName, userPrivateKey, srcTokenAddress, transferAmount);
  await mockRegister(srcChainName, targetChainName);
  const receipt = await transferToken(srcChainName, srcTokenAddress, targetChainName, transferAmount, targetWalletAddress);
  expect(receipt).is.not.null;
}

async function main() {
  await test_relayer_fee("Arbitrum", 0.4);
  await test_transfer("Arbitrum", USER_WALLET_PRIVATE_KEY, ARBITRUM_USDC_ADDRESS, 1, "Avalanche");
  await test_transfer("Arbitrum", USER_WALLET_PRIVATE_KEY, ARBITRUM_USDC_ADDRESS, 1, "Binance");
  await test_transfer("Arbitrum", USER_WALLET_PRIVATE_KEY, ARBITRUM_USDC_ADDRESS, 1, "Optimism");
  await test_transfer("Arbitrum", USER_WALLET_PRIVATE_KEY, ARBITRUM_USDC_ADDRESS, 1, "Polygon");

  await test_relayer_fee("Avalanche", 0.4);
  await test_transfer("Avalanche", USER_WALLET_PRIVATE_KEY, AVALANCHE_USDC_ADDRESS, 0.01, "Arbitrum");
  await test_transfer("Avalanche", USER_WALLET_PRIVATE_KEY, AVALANCHE_USDC_ADDRESS, 0.01, "Binance");
  await test_transfer("Avalanche", USER_WALLET_PRIVATE_KEY, AVALANCHE_USDC_ADDRESS, 0.01, "Optimism");
  await test_transfer("Avalanche", USER_WALLET_PRIVATE_KEY, AVALANCHE_USDC_ADDRESS, 0.01, "Polygon");

  await test_relayer_fee("Binance", 0.4);
  await test_transfer("Binance", USER_WALLET_PRIVATE_KEY, BNB_USDC_ADDRESS, 0.01, "Arbitrum");
  await test_transfer("Binance", USER_WALLET_PRIVATE_KEY, BNB_USDC_ADDRESS, 0.01, "Avalanche");
  await test_transfer("Binance", USER_WALLET_PRIVATE_KEY, BNB_USDC_ADDRESS, 0.01, "Optimism");
  await test_transfer("Binance", USER_WALLET_PRIVATE_KEY, BNB_USDC_ADDRESS, 0.01, "Polygon");

  await test_relayer_fee("Optimism", 0.4);
  await test_transfer("Optimism", USER_WALLET_PRIVATE_KEY, OPTIMISM_USDC_ADDRESS, 1, "Arbitrum");
  await test_transfer("Optimism", USER_WALLET_PRIVATE_KEY, OPTIMISM_USDC_ADDRESS, 1, "Avalanche");
  await test_transfer("Optimism", USER_WALLET_PRIVATE_KEY, OPTIMISM_USDC_ADDRESS, 1, "Binance");
  await test_transfer("Optimism", USER_WALLET_PRIVATE_KEY, OPTIMISM_USDC_ADDRESS, 1, "Polygon");

  await test_relayer_fee("Polygon", 0.4);
  await test_transfer("Polygon", USER_WALLET_PRIVATE_KEY, POLYGON_USDC_ADDRESS, 0.01, "Arbitrum");
  await test_transfer("Polygon", USER_WALLET_PRIVATE_KEY, POLYGON_USDC_ADDRESS, 0.01, "Avalanche");
  await test_transfer("Polygon", USER_WALLET_PRIVATE_KEY, POLYGON_USDC_ADDRESS, 0.01, "Binance");
  await test_transfer("Polygon", USER_WALLET_PRIVATE_KEY, POLYGON_USDC_ADDRESS, 0.01, "Optimism");
}

main();
