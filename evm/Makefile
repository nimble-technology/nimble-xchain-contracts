include contracts/tests/helpers/env/unit-test.env
.PHONY: clean install build test json unit-test integration-test mainnet-deploy api-test

clean:
	rm -rf node_modules lib build

clean-lite:
	rm -rf build

install:
	yarn
	bash scripts/install_forge_lib.sh

build:
	forge build
	yarn build-types

json:
	jsonnet config/testnet/config.jsonnet -o config/testnet/config.json
	jsonnet config/mainnet-test/config.jsonnet -o config/mainnet-test/config.json
	jsonnet config/mainnet-prod/config.jsonnet -o config/mainnet-prod/config.json

unit-test:
	forge test --fork-url ${TESTING_AVAX_FORK_RPC} -vv

integration-test:
	bash scripts/run_integration_test.sh

test: unit-test integration-test

mainnet-deploy:
	bash scripts/run_mainnet_deploy.sh

api-test:
	yarn ts-node tests/api-test/scripts/test_api.ts
