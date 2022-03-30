const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign', async accounts => {

    it("test simple camcel Campaign", async () => {
        let campaign = await CrowdfundingCampaign.deployed();
        let campaignStatus = await campaign.campaignStatus();
        assert.equal(campaignStatus, "active");

        let balanceCampaignBefore = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaignBefore), 0);
        let balanceContributorBefore = await web3.eth.getBalance(accounts[1]);

        let trans = await campaign.contributeCampaign("Test send 500 gwei", {value: web3.utils.toWei('500', 'gwei'), from: accounts[1]});
        let balanceCampaignAfter = await web3.eth.getBalance(campaign.address);
        let balanceContributorAfter = await web3.eth.getBalance(accounts[1]);

        assert.equal(parseInt(balanceCampaignAfter), parseInt(balanceCampaignBefore) + web3.utils.toWei('500', 'gwei'));
        assert(parseInt(balanceContributorBefore) > (parseInt(balanceContributorAfter)
            + (parseInt(web3.utils.toWei('500', 'gwei')) + trans.receipt.gasUsed)));

        await campaign.cancelCampaign();
        campaignStatus = await campaign.campaignStatus();
        assert.equal(campaignStatus, "canceled");
        balanceCampaignAfter = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaignAfter), 0);

        let balanceContributorAfterCancel = await web3.eth.getBalance(accounts[1]);
        assert(parseInt(balanceContributorAfter) < parseInt(balanceContributorAfterCancel));
    });

    it("test simple camcel Campaign", async () => {
        let campaign = await CrowdfundingCampaign.new("Canceltest", [web3.utils.toWei('500000', 'gwei')], accounts[8]);
        let campaignStatus = await campaign.campaignStatus();
        assert.equal(campaignStatus, "active");

        let balanceCampaignBefore = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaignBefore), 0);

        await campaign.contributeCampaign("Test send 500 gwei", {value: web3.utils.toWei('500', 'gwei'), from: accounts[1]});
        await campaign.contributeCampaign("Test send second 500 gwei", {value: web3.utils.toWei('500', 'gwei'), from: accounts[2]});
        let balanceCampaignAfter = await web3.eth.getBalance(campaign.address);
        let balanceContributorAfter = await web3.eth.getBalance(accounts[1]);

        await campaign.cancelCampaign();
        campaignStatus = await campaign.campaignStatus();
        assert.equal(campaignStatus, "canceled");
        balanceCampaignAfter = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaignAfter), 0);

        let balanceContributorAfterCancel = await web3.eth.getBalance(accounts[1]);
        assert(parseInt(balanceContributorAfter) < parseInt(balanceContributorAfterCancel));
        balanceContributorAfterCancel = await web3.eth.getBalance(accounts[2]);
        assert(parseInt(balanceContributorAfter) < parseInt(balanceContributorAfterCancel));
    });
});