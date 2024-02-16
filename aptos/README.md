# Smart Contracts for Aptos xChain Token Transfer

# Aptos Code Structure

```
aptos
├── README.md                 // aptos smart contract readme
── config                    // aptos smart contract config
    ├── mainnet-prod          // mainnet production config
    ├── mainnet-test          // mainnet test config
    ├── config-base.libsonnet // base config
├── contracts/sources         // aptos smart contract business logic & unit tests
    ├─- modules               // unit tests in each file
├── scripts                   // bash scripts for env setup etc.
├── ts                        // cli tools for deployment etc.
└── tests                     // aptos smart contract integration tests
```

# Prerequisites

```
# after running the following script successfully, perform the following:
# 1. open System Preferences.
# 2. go to Security & Privacy and select the General tab.
# 3. click open anyway to grant permission for aptos.

# Set premissions
chmod +x ./scripts/install-aptos.sh
chmod +x ./scripts/install-wormhole.sh

# Install the Aptos CLI
brew install aptos
```

# init aptos account

```
yarn init
```

# change address in aptos/contracts/Move.toml

replace nimble_xchain's address stored in Move.toml \
with the private address stored in .aptos/config.yaml

# set $PATH environment variable. You can add it to .bashrc for local development.

source ./scripts/env.sh

### Build and Test

```
cd contracts

# build
yarn build

# run unit tests
yarn test

# clean build
yarn clean
```

### References

1. [Aptos CLI Install](https://aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli/)
2. [Aptos Developer Doc](https://aptos.dev/whats-new-in-docs)
3. [Aptos Smart Contract Dev](https://aptos.dev/guides/move-guides/aptos-move-guides)
4. [Aptos First DApp Tutorial](https://aptos.dev/tutorials/your-first-dapp/)
5. [Wormhole on Aptos](https://github.com/wormhole-foundation/wormhole/tree/main/aptos)
