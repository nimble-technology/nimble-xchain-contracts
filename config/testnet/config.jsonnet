local base = import '../config-base.libsonnet';

local testnetExtra = {
    Avalanche: {
        testLocalRpc: "http://127.0.0.1:8545",
        testLocalPort: "8545",
    },
    Ethereum: {
        testLocalRpc: "http://127.0.0.1:8546",
        testLocalPort: "8546",
    },
    Binance: {
        testLocalRpc: "http://127.0.0.1:8547",
        testLocalPort: "8547",
    },
    Polygon: {
        testLocalRpc: "http://127.0.0.1:8548",
        testLocalPort: "8548",
    },
    "relayerWalletPrivateKey": "6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1",
    "testGuardianPrivateKey": "cfb12303a19cde580bb4dd771639b0d26bc68353645571a8cff516ab2ee113a0",
    "testUserMnemonic": "myth like bonus scare over problem client lizard pioneer submit female collect",
    "userWalletPrivateKey": "4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d",
};

base {
    "testnetExtra": testnetExtra,
}
