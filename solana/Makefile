include testing.env

.PHONY: dependencies test cargo-test unit-test integration-test clean all sol-eth-mainnet-test clean-lite sol-eth-devnet-test

all: test

.PHONY: clean
clean:
	rm -rf node_modules target dependencies/*.so

clean-lite:
	rm -rf target dependencies/*.so

dependencies: node_modules dependencies/wormhole.so dependencies/token_bridge.so

node_modules:
	yarn

dependencies/token_bridge.so:
	bash shell-scripts/build_wormhole_repo_bpfs.sh

dependencies/wormhole.so:
	bash shell-scripts/build_wormhole_repo_bpfs.sh

.PHONY: cargo-test
cargo-test:
	cargo clippy -- --allow clippy::result_large_err
	cargo test

.PHONY: unit-test
unit-test: cargo-test

.PHONY: integration-test
integration-test: dependencies
	md5sum -c dependencies/checksum.txt
	anchor test --skip-deploy

.PHONY: test
test: unit-test integration-test

.PHONY: sol-eth-mainnet-test
sol-eth-mainnet-test: dependencies
	test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 ts/tests/sol-eth/mainnet-test/sol-eth/testnet/test_*.ts"n

.PHONY: sol-eth-devnet-test
sol-eth-devnet-test: dependencies
	test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 ts/tests/sol-eth/devnet/sol-eth/testnet/test_*.ts"n
