# Wormhole Integration in Solana

These programs are enumerated the same as the other smart contract
subdirectories (e.g. [evm](../evm)).

## Design Documents

Read the design documents for each example project:

1. [hello-world](../docs/01_hello_world.md)
2. [hello-token](../docs/02_hello_token.md)

## Getting Started

First, you will need `cargo` and `anchor` CLI tools. If you need these tools,
please visit the [Anchor book] for more details.

```
# Install Solana & Anchor
./scripts/install-solana.sh
./scripts/install-anchor.sh
```

Reference: https://book.anchor-lang.com/chapter_2/installation.html

## Tests
```
# Set $PATH environment variable. You can add it to .bashrc for local development.
source ./scripts/env.sh

# Once you have the above CLI tools, install this subdirectory's dependencies,
# run `make dependencies`. This will set up `node_modules` and compile program
# BPFs from the `solana` directory of the [Wormhole repo].
make dependencies

# To run both unit and integration tests
make test

# If you want to isolate your testing, use either of these commands:
# Runs `cargo clippy` and `cargo test`
make unit-test

# Spawns a solana local validator and uses `ts-mocha` with `@solana/web3.js` to interact with the example programs.
make integration-test
```

## Code Changes
```
# If you are pushing code to a branch and there is a PR associated with it, we
# recommend running the following command to make sure the environment does not have any
# old artifacts. Then running the tests above afterwards to ensure that all of
# the tests run as you expect.
make clean
```

[anchor book]: https://book.anchor-lang.com/getting_started/installation.html
[wormhole repo]: https://github.com/wormhole-foundation/wormhole/tree/dev.v2/solana

## Devnet and Mainnet config

the program deployed on the devnet and mainnet are different by now. Please update the `Anchor.toml`, `testing.env` and `programs/xchain_token/lib.ts`'s program id.
```
Devnet:  2n1p8eEw2CDiwastC3rVPYPEJzZdUpBBhJJWMTwLYty3
Mainnet: EcNezEFFnaWCoWqPMgBPV8b574Js3QBUiLqizvM11ZF3
```


## Deploy program
`anchor deploy`. For the first deployment, please prepare at least 10 SOL.

The default payer wallet is `~/.config/solana/id.json`.
The pair.json is `target/deploy/xchain_token-keypair.json`.

Please update `Anchor.toml`'s [provider] cluster from `devnet` or `localnet` according to your target cluster.
