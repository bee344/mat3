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
      accounts: [vars.get("PRIVATE_KEY")]
    }
  }
};

export default config;
