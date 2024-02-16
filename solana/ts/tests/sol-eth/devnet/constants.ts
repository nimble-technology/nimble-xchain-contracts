import {PublicKey} from "@solana/web3.js";

// rpc

export const LOCALHOST = "https://api.devnet.solana.com"
// export const LOCALHOST = "https://rpc.ankr.com/solana_devnet"

// wallet
export const PAYER_PRIVATE_KEY = Uint8Array.from([
  93, 60, 109, 110, 223, 106, 222, 54, 58, 236, 157,
  83, 9, 127, 198, 226, 116, 62, 154, 213, 240, 237,
  4, 119, 120, 64, 165, 234, 37, 229, 36, 89, 99,
  86, 57, 54, 127, 162, 165, 40, 249, 247, 57, 193,
  89, 238, 145, 208, 137, 168, 68, 171, 223, 251, 123,
  146, 124, 182, 201, 135, 188, 111, 165, 133
]);
export const RELAYER_PRIVATE_KEY = Uint8Array.from([
  38, 198, 52, 108, 231, 56, 89, 154, 27, 104, 129,
  218, 183, 19, 164, 156, 175, 41, 17, 53, 43, 204,
  94, 74, 14, 44, 69, 84, 245, 68, 254, 111, 115,
  57, 117, 45, 130, 219, 64, 70, 93, 126, 176, 34,
  145, 107, 197, 216, 39, 102, 13, 127, 15, 158, 25,
  227, 216, 10, 230, 187, 130, 92, 228, 106
]);

// wormhole
export const WORMHOLE_ADDRESS = new PublicKey(
  "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"
);

export const TOKEN_BRIDGE_ADDRESS = new PublicKey(
  "DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe"
);

// guardian signer
export const GUARDIAN_PRIVATE_KEY = process.env.TESTING_DEVNET_GUARDIAN!;

// testing
export const FUZZ_TEST_ITERATIONS = 64;

// programs
// export const HELLO_WORLD_ADDRESS = new PublicKey(
//   process.env.TESTING_HELLO_WORLD_ADDRESS!
// );
export const XCHAIN_TOKEN_ADDRESS = new PublicKey(
  // process.env.TESTING_XCHAIN_TOKEN_ADDRESS!
  "2n1p8eEw2CDiwastC3rVPYPEJzZdUpBBhJJWMTwLYty3"
);

// special cases for testing on localnet. Don't upload private key on mainnet!
// mints
export const MINT_9_PRIVATE_KEY = Uint8Array.from([
  98, 139, 243, 120, 236, 152, 36, 219, 202, 42, 72, 178, 107, 155, 181, 134,
  120, 36, 55, 108, 253, 218, 96, 139, 80, 99, 85, 54, 116, 145, 94, 40, 227,
  10, 159, 48, 118, 75, 67, 84, 239, 36, 177, 138, 6, 214, 73, 149, 26, 100,
  255, 28, 218, 167, 251, 229, 93, 236, 25, 225, 152, 104, 223, 54,
]);
export const MINT_WITH_DECIMALS_9 = new PublicKey(
  "GHGwbrTCsynp7yJ9keowy2Roe5DzxFbayAaAwLyAvRKj"
);

export const MINT_8_PRIVATE_KEY = Uint8Array.from([
  129, 227, 235, 186, 104, 13, 185, 244, 16, 185, 108, 95, 83, 214, 115, 244,
  194, 207, 250, 150, 180, 86, 70, 198, 97, 40, 71, 3, 26, 185, 48, 222, 226,
  136, 99, 75, 72, 182, 148, 76, 211, 140, 155, 55, 62, 44, 71, 127, 72, 42,
  114, 4, 86, 16, 64, 54, 37, 143, 66, 162, 104, 70, 220, 47,
]);
export const MINT_WITH_DECIMALS_8 = new PublicKey(
  "GFHmBkLYsPSiWbqGD54VmmVKDs9shYVdFnHuNRu1QhTL"
);

// foreign
export const ETHEREUM_TOKEN_BRIDGE_ADDRESS =
  "0x0290FB167208Af455bB137780163b7B7a9a10C16";
export const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

// governance
export const GOVERNANCE_CHAIN = 1;
export const GOVERNANCE_EMITTER_ADDRESS = new PublicKey(
  "11111111111111111111111111111115"
);

export const WORMHOLE_RPC_HOST = ["https://wormhole-v2-testnet-api.certus.one"];
