const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");
const CrowdfundingCampaignFactory = artifacts.require("CrowdfundingCampaignFactory")

module.exports = function(deployer) {
  deployer.deploy(CrowdfundingCampaign, "TestCampaign", 1, "0x3df52Bbcb21A605C60f5f3152676D7E4B3ed6261")
  deployer.deploy(CrowdfundingCampaignFactory)
};
