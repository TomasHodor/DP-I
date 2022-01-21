import Web3 from "web3";
import CrowdfundingCampaign from "./contracts/CrowdfundingCampaign.json";
import CrowdfundingCampaignFactory from "./contracts/CrowdfundingCampaignFactory.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:7545"),
  },
  contracts: [CrowdfundingCampaign, CrowdfundingCampaignFactory],
  events: {
    SimpleStorage: ["CrowdfundingCampaign"],
  },
};

export default options;
