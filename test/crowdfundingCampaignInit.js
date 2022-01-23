const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign', accounts => {
    it("test deploying crowdfunding campaign", async () => {
        let goalValue = 500;
        let name = "Test";

        let campaign = await CrowdfundingCampaign.new(name, goalValue, accounts[1]);

        let campaignName = await campaign.campaignName.call();
        let goal = await campaign.goalValue.call();
        let totalValue = await campaign.totalValue.call();
        let numberOfContributions = await campaign.getNumberOfContributions.call();
        let campaignStatus = await campaign.status.call();

        assert.equal(campaignName.valueOf(), name);
        assert.equal(goal.valueOf(), goalValue);
        assert.equal(totalValue.valueOf(), 0);
        assert.equal(numberOfContributions.valueOf(), 0);
        assert.equal(campaignStatus.valueOf(), true);
    });
})

