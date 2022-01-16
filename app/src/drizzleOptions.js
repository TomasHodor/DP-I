import Web3 from "web3";
import ComplexStorage from "./contracts/ComplexStorage.json";
import SimpleStorage from "./contracts/SimpleStorage.json";
import TutorialToken from "./contracts/TutorialToken.json";
import CrowdfundingCampaign from "./contracts/CrowdfundingCampaign.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:7545"),
  },
  contracts: [SimpleStorage, ComplexStorage, TutorialToken, CrowdfundingCampaign],
  events: {
    SimpleStorage: ["StorageSet"],
  },
};

export default options;
