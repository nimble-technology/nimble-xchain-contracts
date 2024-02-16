.PHONY: clean dependencies build unit-test integration-test integration-test-avax-eth-deploy integration-test-avax-eth integration-test-bnb-polygon-deploy integration-test-bnb-polygon build-json bnb-polygon-mainnet-deploy

clean:
	rm -rf build node_modules

install-js-lib:
	yarn

dependencies: install-js-lib install-forge-lib

build: dependencies
	forge build
	yarn build-types

unit-test: dependencies
	forge test --fork-url ${TESTING_AVAX_FORK_RPC} -vv

integration-test-avax-eth-deploy: clean
	bash scripts/run_avax_eth_testnet_deploy.sh

integration-test-avax-eth:
	npx ts-mocha -t 1000000 tests/eth-avax/testnet/test_*.ts

integration-test-bnb-polygon-deploy: clean
	bash scripts/run_bnb_polygon_testnet_deploy.sh

integration-test-bnb-polygon:
	npx ts-mocha -t 1000000  tests/bnb-polygon/testnet/test_env.ts tests/bnb-polygon/testnet/test_bnbSendERC20ToPolygon.ts

integration-test:
	make integration-test-avax-eth-deploy
	make integration-test-avax-eth
	make integration-test-bnb-polygon-deploy
	make integration-test-bnb-polygon

build-json:
	jsonnet config/testnet/config.jsonnet -o config/testnet/config.json

bnb-polygon-mainnet-deploy: clean
	bash scripts/run_bnb_polygon_mainnet_deploy.sh

bnb-polygon-mainnet-test:
	npx ts-mocha -t 10000000 tests/bnb-polygon/mainnet-test/test_transfer.ts
