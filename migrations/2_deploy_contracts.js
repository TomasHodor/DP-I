const SimpleStorage = artifacts.require("SimpleStorage");
const TutorialToken = artifacts.require("TutorialToken");
const ComplexStorage = artifacts.require("ComplexStorage");
const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");
const CrowdfundingCampaignFactory = artifacts.require("CrowdfundingCampaignFactory")

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(TutorialToken);
  deployer.deploy(ComplexStorage);
  deployer.deploy(CrowdfundingCampaign, 1, "0x3df52Bbcb21A605C60f5f3152676D7E4B3ed6261")
};
