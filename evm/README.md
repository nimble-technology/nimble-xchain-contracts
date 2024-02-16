# EVM xChain Contracts with Wormhole

This folder provides smart contracts code for EVM chains. All the contracts are built on top
of Wormhole token bridge contract (i.e., [IWormhole](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/interfaces/IWormhole.sol)
and [ITokenBridge](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/bridge/interfaces/ITokenBridge.sol) interfaces).

## Prerequisites
Install necessary building tools:
```
# install foundry
./scripts/install_foundry.sh

# install jq
brew install jq

# install jsonnet
brew install jsonnet
```

## Build and Test

### Local Tests
```
# clean the folder
make clean

# install dependencies
make install

# build the package
make build

# run unit tests
make unit-test

# deploy smart contracts & run integration tests in Testnet mode
make integration-test

# run both unit and integration tests
make test
```

### Mainnet API Tests
To run in this mode, make sure you have created a json file called `mainnet_config.json` under `$HOME/.nimble/xchain/` folder with the following format:
```json
{
   "userWalletPrivateKey": YOUR_TEST_WALLET_PRIVATE_KEY,
   "relayerWalletPrivateKey": YOUR_TEST_RELAYER_WALLET_PRIVATE_KEY,
   "relayerFeePrecision": 1e6,
   "relayerFeePercentage": 2000,
   "endPoints": {
      "Arbitrum": YOUR_ARBITRUM_ENDPOINT,
      "Avalanche": YOUR_AVALANCHE_ENDPOINT,
      "Binance": YOUR_BINANCE_ENDPOINT,
      "Ethereum": YOUR_ETHEREUM_ENDPOINT,
      "Optimism": YOUR_OPTIMISM_ENDPOINT,
      "Polygon": YOUR_POLYGON_ENDPOINT
   }
}

```

Run the integration test with following commands
```
# deploy smart contracts
make mainnet-deploy

# run tests
make api-test
```

We also support cli for smart contracts deployment & emitter registration:
```
# deploy smart contracts to mainnet
yarn ts-node ts/cli/nimble_xchain_cli.ts deploy

# register emitters on each chain
yarn ts-node ts/cli/nimble_xchain_cli.ts register-emitter

# update relayer fee
yarn ts-node ts/cli/nimble_xchain_cli.ts update-relayer-fee
```

## Config
Config files are under `config` folder.
```
# generate or update config files
make json
```

## References:

1. [Foundry tools](https://book.getfoundry.sh/getting-started/installation): include `forge`, `anvil` and `cast` CLI tools.

2. [jq](https://stedolan.github.io/jq/): a lightweight and flexible command-line JSON processor.

3. [jsonnet](https://jsonnet.org/): a data templating language
for app and tool developers.

4. [Wormhole deployed contracts](https://book.wormhole.com/reference/contracts.html): Reference for Wormhole deployed contract configs like chain ids, core contracts, etc.
