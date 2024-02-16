# Near xChain Token Transfer Smart Contracts

## Code Structure

```
near
├── README.md                 // Near smart contract readme
├── config                    // Near smart contract config
    ├── mainnet-prod          // mainnet production config
    ├── mainnet-test          // mainnet test config
    ├── config-base.libsonnet // base config
├── contracts                 // Near smart contract business logic & unit tests
├── scripts                   // bash scripts for env setup etc.
├── ts                        // cli tools for deployment etc.
└── tests                     // Near smart contract integration tests
```

## Prerequisites
Install necessary building tools:
```
# install rust & wasm
./scripts/env.sh
./scripts/install-wasm.sh

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

## References:

1. [Rust and Wasm](https://docs.near.org/develop/contracts/introduction): include `rust` and `wasm` CLI tools.

2. [jq](https://stedolan.github.io/jq/): a lightweight and flexible command-line JSON processor.

3. [jsonnet](https://jsonnet.org/): a data templating language for app and tool developers.

4. [Wormhole Near contracts](https://github.com/wormhole-foundation/wormhole/tree/main/near): Wormhole core bridge contracts on Near.
