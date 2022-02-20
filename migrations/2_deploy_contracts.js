const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");
const CrowdfundingCampaignFactory = artifacts.require("CrowdfundingCampaignFactory")

module.exports = function(deployer) {
  deployer.deploy(CrowdfundingCampaign, "CampaignDeploy", 1000000, "0x8B87A799436FbC7f99fd26a287C1093168A073Dc")
  deployer.deploy(CrowdfundingCampaignFactory)
};
