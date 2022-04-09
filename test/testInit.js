const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign', accounts => {
    it("test deploying crowdfunding campaign", async () => {
        let goalValue = 500;
        let name = "Test";

        let campaign = await CrowdfundingCampaign.new(name, goalValue, accounts[1]);

        let campaignName = await campaign.campaignName.call();
        let goal = await campaign.goalValue.call();
        let totalValue = await campaign.totalValue.call();
        let numberOfContributors = await campaign.getNumberOfContributors.call();
        let campaignStatus = await campaign.campaignStatus.call();

        assert.equal(campaignName.valueOf(), name);
        assert.equal(goal.valueOf(), goalValue);
        assert.equal(totalValue.valueOf(), 0);
        assert.equal(numberOfContributors.valueOf(), 0);
        assert.equal(campaignStatus.valueOf(), "active");
    });

    it("test deploying crowdfunding campaign2", async () => {
        let goalValue = 10000;
        let name = "Test2";

        let campaign = await CrowdfundingCampaign.new(name, goalValue, accounts[2]);

        let campaignName = await campaign.campaignName();
        let totalValue = await campaign.totalValue();
        let goal = await campaign.goalValue();
        let numberOfContributors = await campaign.getNumberOfContributors();
        let campaignStatus = await campaign.campaignStatus();

        assert.equal(campaignName, name);
        assert.equal(goal, goalValue);
        assert.equal(totalValue, 0);
        assert.equal(numberOfContributors, 0);
        assert.equal(campaignStatus, "active");
    });
})

