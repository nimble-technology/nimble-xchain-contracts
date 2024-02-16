local chainConfigs = {
    Arbitrum: {
        rpc: "https://clean-cool-rain.arbitrum-mainnet.quiknode.pro/ce5177ed8c53edf4f27cf3d540ac83ae7853ac69/",
        chainId: 42161,
    },
    Avalanche: {
        rpc: "https://api.avax.network/ext/bc/C/rpc",
        chainId: 43114,
    },
    Binance: {
        rpc: "https://wandering-tiniest-resonance.bsc.quiknode.pro/bdf3a9c0f29b436370ce60cb501a1c1a00a42d64/",
        chainId: 56,
    },
    Ethereum: {
        rpc: "https://empty-light-dust.quiknode.pro/ebd6400050ca2a15bc0d5b110a1310cb6655f03f/",
        chainId: 1,
    },
    Injective: {
        rpc: "https://k8s.global.mainnet.tm.injective.network:443",
        chainId: 19,
    },
    Optimism: {
        rpc: "https://fluent-yolo-water.optimism.quiknode.pro/196281e37361ddfa5e6c6e1d58f2e1b82837d9f9/",
        chainId: 10,
    },
    Polygon: {
        rpc: "https://silent-cosmological-field.matic.quiknode.pro/292df0e326c595ff4637df99975920390e7ab8c5/",
        chainId: 137,
    },
};

local wormholeConfigs = {
    Arbitrum: {
        wormholeCoreContractAddress: "0xa5f208e072434bC67592E4C49C1B991BA79BCA46",
        wormholeTokenBridgeContractAddress: "0x0b2402144Bb366A632D14B83F244D2e0e21bD39c",
        wormholeChainId: 23,
        wormholeMessageFee: 0,
        wormholeGuardianSet: 3,
    },
    Avalanche: {
        wormholeCoreContractAddress: "0x54a8e5f9c4CbA08F9943965859F6c34eAF03E26c",
        wormholeTokenBridgeContractAddress: "0x0e082F06FF657D94310cB8cE8B0D9a04541d8052",
        wormholeChainId: 6,
        wormholeMessageFee: 0,
        wormholeGuardianSet: 3,
    },
    Binance: {
        wormholeCoreContractAddress: "0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B",
        wormholeTokenBridgeContractAddress: "0xB6F6D86a8f9879A9c87f643768d9efc38c1Da6E7",
        wormholeChainId: 4,
        wormholeMessageFee: 0,
        wormholeGuardianSet: 3,
    },
    Ethereum: {
        wormholeCoreContractAddress: "0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B",
        wormholeTokenBridgeContractAddress: "0x3ee18B2214AFF97000D974cf647E7C347E8fa585",
        wormholeChainId: 2,
        wormholeMessageFee: 0,
        wormholeGuardianSet: 3,
    },
    Injective: {
        wormholeCoreContractAddress: "inj17p9rzwnnfxcjp32un9ug7yhhzgtkhvl9l2q74d",
        wormholeTokenBridgeContractAddress: "inj1ghd753shjuwexxywmgs4xz7x2q732vcnxxynfn",
        wormholeChainId: 19,
        wormholeMessageFee: 0,
        wormholeGuardianSet: 3,
    },
    Optimism: {
        wormholeCoreContractAddress: "0xEe91C335eab126dF5fDB3797EA9d6aD93aeC9722",
        wormholeTokenBridgeContractAddress: "0x1D68124e65faFC907325e3EDbF8c4d84499DAa8b",
        wormholeChainId: 24,
        wormholeMessageFee: 0,
        wormholeGuardianSet: 3,
    },
    Polygon: {
        wormholeCoreContractAddress: "0x7A4B5a56256163F07b2C80A7cA55aBE66c4ec4d7",
        wormholeTokenBridgeContractAddress: "0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE",
        wormholeChainId: 5,
        wormholeMessageFee: 0,
        wormholeGuardianSet: 3,
    },
};

local tokenConfigs = {
    Arbitrum: {
        USDC: {
            address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
        },
        WETH: {
            address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
        },
    },
    Avalanche: {
        USDC: {
            address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
        },
        WAVAX: {
            address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        },
    },
    Binance: {
        WBNB: {
            address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        },
        USDC: {
            address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        },
    },
    Ethereum: {
        WETH: {
            address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        },
    },
    Injective: {
        // There’s no contract/mint address for INJ.
        // INJ Bridged from Ethereum is credited directly to the bank module.
        USDC: {
            address: "inj1q6zlut7gtkzknkk773jecujwsdkgq882akqksk",
        },
    },
    Optimism: {
        USDC: {
            address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
        },
        WETH: {
            address: "0x4200000000000000000000000000000000000006",
        },
    },
    Polygon: {
        WMATIC: {
            address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        },
        USDC: {
            address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        },
    },
};

{
    "chainConfigs": chainConfigs,
    "wormholeConfigs": wormholeConfigs,
    "tokenConfigs": tokenConfigs,
}
