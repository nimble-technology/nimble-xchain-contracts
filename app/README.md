## Relayer Engine App Project

- Plugins are located in the plugins directory and should be standalone npm packages
- engine config and a simple main file are in the top level directory
- helper scripts are in the scripts directory

### Prerequisite
Install node
```
npm install -g ts-node
```

Install the Redis
```
brew install redis
```
Starting and Configuring Redis on Mac
```
redis-server
```
Test if Redis Server is Running
```
redis-cli ping
```

### To run

Install the dependencies
```
yarn
```

Launch a testnet spy. Current command:

```
docker run \
    --platform=linux/amd64 \
    -p 7073:7073 \
    --entrypoint /guardiand \
    ghcr.io/wormhole-foundation/guardiand:latest \
spy --nodeKey /node.key --spyRPC "[::]:7073" --network /wormhole/testnet/2/1 --bootstrap /dns4/wormhole-testnet-v2-bootstrap.certus.one/udp/8999/quic/p2p/12D3KooWAkB9ynDur1Jtoa97LBUp8RXdhzS5uHgAfdTquJbrbN7i
```

Launch the Redis
```
redis-server --daemonize yes
```

Launch the relayer

```
ts-node src/main            // need smart contract support, please refer to integration test
```

Send a few VAAs from solana devnet

```
ts-node cli/sendSolanaNativetoAvax.ts
```


### REST API
#### `/shouldRelay`
checks if the relayer can relay this request
```
GET /shouldRelay
params: {
  targetChain: ChainId,
  originAsset: string,    // original address without padding 0s
  amount: string,
}
```

#### `/relay`
ask the relayer to relay a request, given the signedVaa
```
POST /relay
data: {
  targetChain: ChainId,
  signedVAA: string,      // hex encoded string
}
```
### Unit Test
```
yarn start
yarn test               // relay may faild via the insufficient testnet balance
```


### Integration Test
#### on testnet
```
make integration-test-avax-eth-deploy       // build smart contract, start up relayer backend
make integration-test-avax-eth              // execute integration test
```

```
make integration-test-bnb-polygon-deploy
make integration-test-bnb-polygon
```
#### on mainnet
```
make bnb-polygon-mainnet-deploy         
make bnb-polygon-mainnet-test 
```
