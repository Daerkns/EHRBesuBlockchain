const HDWalletProvider = require('@truffle/hdwallet-provider');

const privateKey = '8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63'; // Without 0x prefix

module.exports = {
  networks: {
    development: {
      provider: () => new HDWalletProvider({
        privateKeys: [privateKey],
        providerOrUrl: 'http://127.0.0.1:8545',
      }),
      network_id: "*",
      gas: 5500000,
      gasPrice: 0
    }
  },
  contracts_directory: './smart-contracts',
  contracts_build_directory: './build/contracts',
  compilers: {
    solc: {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
