// hardhat.config.js
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("hardhat-abi-exporter");

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
    solidity: "0.8.4",
    networks: {
        "mantle-testnet": {
            url: "https://rpc.testnet.mantle.xyz/",
            accounts: [PRIVATE_KEY],
        },
    },
    abiExporter: {
        path: "./abi",
        runOnCompile: true,
        clear: true,
        flat: true,
        spacing: 2,
        format: "json",
    },
};
