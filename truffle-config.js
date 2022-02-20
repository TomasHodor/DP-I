const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
      // gas: 5000000,
      // accounts: 5,
      // defaultEtherBalance: 500,
      // blockTime: 3
    }
    // eth: {
    //   provider: () => new HDWalletProvider(
    //       privateKeys,
    //       'ETH_NODE_URL' // TODO create infura.io project
    //   ),
    //   network_id: 1,
    //   skipDryRun: true
    // },
    // ethTestnet: {
    //   provider: () => new HDWalletProvider(
    //       privateKeys,
    //       'ETH_NODE_URL' // TODO create infura.io project
    //   ),
    //   network_id: 5,
    //   skipDryRun: true
    // },
    // bsc: {
    //   provider: () => new HDWalletProvider(
    //       privateKeys,
    //       'https://bsc-dataseed.binance.org/'
    //   ),
    //   network_id: 56,
    //   skipDryRun: true
    // },
    // bscTestnet: {
    //   provider: () => new HDWalletProvider(
    //       privateKeys,
    //       'https://data-seed-prebsc-1-s1.binance.org:8545/'
    //   ),
    //   network_id: 97,
    //   skipDryRun: true
    // }
  },
  // mocha: {},
  // compilers: {
  //   solc: {
  //     settings: {
  //       optimizer: {
  //         enabled: false, // Default: false
  //         runs: 200      // Default: 200
  //       },
  //     }
  //     version: "0.4.25"
  //   }
  // }
};
