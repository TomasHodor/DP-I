import web3 from "./web3instance"

const options = {
  web3: {
    block: false,
    customProvider: web3,
  },
  contracts: [],
  events: {
    CrowdfundingCampaign: ["logContributeMoney", "logContributions2length"],
  },
};

export default options;
