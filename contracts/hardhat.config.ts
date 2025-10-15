import { HardhatUserConfig } from "hardhat/config";
import "@parity/hardhat-polkadot-resolc";
import "@nomicfoundation/hardhat-ignition";
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      viaIR: true, // Enable IR-based compilation
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  resolc: {
    settings:{
      viaIR: true
    }
  },
  networks: {
    hardhat: {
      polkadot: true,
      forking: {
        url: "https://testnet-passet-hub-eth-rpc.polkadot.io"
      },
      adapterConfig: {
        adapterBinaryPath: "./bin/eth-rpc",
        dev: true
      }
    },
    polkadotHubTestnet: {
      polkadot: true,
      url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
      accounts: ["fb0ba23e5b86327532457879bbf23edccc77acd10cdd244b038d3b349076837b"]
    }
  }
};

export default config;
