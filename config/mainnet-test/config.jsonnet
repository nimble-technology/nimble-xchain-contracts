local base = import '../config-base.libsonnet';

local mainnetExtra = {
    wormholeRpcHost: [
            "https://wormhole-v2-mainnet-api.certus.one",
            "https://wormhole.inotel.ro",
            "https://wormhole-v2-mainnet-api.mcf.rocks",
            "https://wormhole-v2-mainnet-api.chainlayer.network",
            "https://wormhole-v2-mainnet-api.staking.fund",
            "https://wormhole-v2-mainnet.01node.com",
        ],
};

base {
    "mainnetExtra": mainnetExtra,
}
