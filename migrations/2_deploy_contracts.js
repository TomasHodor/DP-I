const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");
const CrowdfundingCampaignFactory = artifacts.require("CrowdfundingCampaignFactory")

module.exports = function(deployer) {
  deployer.deploy(CrowdfundingCampaign, "CampaignDeploy", 1000000, "0x06d04A2ba0714eCBF251c251c2c8bBdc0D6BCf57")
  deployer.deploy(CrowdfundingCampaignFactory)
};
