import '@nomiclabs/hardhat-waffle'
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-abi-exporter'

import { networks } from './hardhat.networks'

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.6.11',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: 'istanbul',
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    pool: {
      default: "0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e",
      4: '0xaFF4481D10270F50f203E0763e2597776068CBc5'
    },
  },
  networks,
  abiExporter: {
    path: './abis',
    clear: true,
    flat: true
  }
}
