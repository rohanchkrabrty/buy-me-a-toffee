export const mantleTestnet = {
    id: 5001,
    name: "Mantle Testnet",
    network: "mantleTestnet",
    rpcUrls: {
        public: {
            http: [`https://rpc.testnet.mantle.xyz`],
        },
        default: {
            http: [`https://rpc.testnet.mantle.xyz`],
        },
    },
    nativeCurrency: {
        name: "BIT",
        symbol: "BIT",
        decimals: 18,
    },
    blockExplorers: {
        default: {
            name: "SnowTrace",
            url: "https://explorer.testnet.mantle.xyz",
        },
    },

    testnet: true,
};
