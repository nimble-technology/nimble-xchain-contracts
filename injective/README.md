# Injective xChain Token Transfer Smart Contracts

## Code Structure

```
injective
├── README.md                 // Injective smart contract readme
├── config                    // Injective smart contract config
    ├── mainnet-prod          // mainnet production config
    ├── mainnet-test          // mainnet test config
    ├── config-base.libsonnet // base config
├── contracts                 // Injective smart contract business logic & unit tests
├── scripts                   // bash scripts for env setup etc.
├── ts                        // cli tools for deployment etc.
└── tests                     // Injective smart contract integration tests
```

## Prerequisites
```
# update env variables
./scripts/env.sh

# install injectived tools
./scripts/install-injective.sh

# install wormhole dependencies
./scripts/install-wormhole.sh

# install jq
brew install jq

# install jsonnet
brew install jsonnet
```

## Build & Test
```
# install dependencies
yarn install

# clean env
yarn clean

# build contracts
yarn build

# run lint
yarn lint

# format the contracts code
yarn format
```

## References
1. [Install Injectived](https://docs.injective.network/develop/tools/injectived/install)
2. [Cosmwasm on Injective](https://docs.injective.network/develop/guides/cosmwasm-dapps/Your_first_contract_on_injective)
3. [Rust and Wasm](https://docs.near.org/develop/contracts/introduction)
4. [jq - a lightweight and flexible command-line JSON processor](https://stedolan.github.io/jq/)
5. [jsonnet - a data templating language for app and tool developers](https://jsonnet.org/)
6. [Wormhole core bridge contracts on Cosmwasm](https://github.com/wormhole-foundation/wormhole/tree/main/cosmwasm)
