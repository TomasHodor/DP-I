const CrowdfundingCampaignFactory = artifacts.require("CrowdfundingCampaignFactory");

contract('CrowdfundingCampaignFactory',  accounts => {
    it("create crowdfunding campaign", async () => {
        let factory = await CrowdfundingCampaignFactory.deployed();
        let campaignAddress = await factory.createCampaign.call("TestCampaign", 1, accounts[0]);

        // TODO Fix the tests
        // let deployedCampaign = await factory.deployedCampaigns.call(0);
        // assert.equal(deployedCampaign.valueOf(), campaignAddress.valueOf());

        // let deployedCampaigns = await factory.getDeployedCampaigns.call();
        // assert.equal(deployedCampaigns.valueOf()[0], campaignAddress.valueOf());
    })
});