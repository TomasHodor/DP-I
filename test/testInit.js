const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign', accounts => {
    it("test deploying crowdfunding campaign", async () => {
        let goalValues = [500];
        let caps = [false];
        let name = "Test";

        let campaign = await CrowdfundingCampaign.new(name, goalValues, accounts[1]);

        let campaignName = await campaign.campaignName.call();
        let goal0 = await campaign.goalValues.call(0);
        let totalValue = await campaign.totalValue.call();
        let campaignCap0 = await campaign.campaignCaps.call(0);
        let numberOfContributions = await campaign.getNumberOfContributions.call();
        let campaignStatus = await campaign.campaignStatus.call();

        assert.equal(campaignName.valueOf(), name);
        assert.equal(goal0.valueOf(), goalValues[0]);
        assert.equal(campaignCap0.valueOf(), caps[0]);
        assert.equal(totalValue.valueOf(), 0);
        assert.equal(numberOfContributions.valueOf(), 0);
        assert.equal(numberOfContributions.valueOf(), 0);
        assert.equal(campaignStatus.valueOf(), "active");
    });

    it("test deploying crowdfunding campaign2", async () => {
        let goalValues = [500, 5000, 10000];
        let caps = [false, false];
        let name = "Test2";

        let campaign = await CrowdfundingCampaign.new(name, goalValues, accounts[2]);

        let campaignName = await campaign.campaignName();
        let totalValue = await campaign.totalValue();
        let goal0 = await campaign.goalValues(0);
        let campaignCap0 = await campaign.campaignCaps(0);
        let goal1 = await campaign.goalValues(1);
        let campaignCap1 = await campaign.campaignCaps(1);
        let numberOfContributions = await campaign.getNumberOfContributions();
        let campaignStatus = await campaign.campaignStatus();

        assert.equal(campaignName, name);
        assert.equal(goal0, goalValues[0]);
        assert.equal(campaignCap0, caps[0]);
        assert.equal(goal1, goalValues[1]);
        assert.equal(campaignCap1, caps[1]);
        assert.equal(totalValue, 0);
        assert.equal(numberOfContributions, 0);
        assert.equal(numberOfContributions, 0);
        assert.equal(campaignStatus, "active");
    });
})

