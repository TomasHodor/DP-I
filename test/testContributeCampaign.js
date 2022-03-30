const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign', async accounts => {
    let gasPrice = web3.utils.toWei('20', 'gwei')

    it("test simple contributeCampaign", async () => {
        let campaign = await CrowdfundingCampaign.deployed();

        let balanceCampaignBefore = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaignBefore), 0);
        let balanceContributorBefore = await web3.eth.getBalance(accounts[1]);

        let sendValue = web3.utils.toWei('5', 'gwei')

        let trans = await campaign.contributeCampaign("Test send 5 gwei", {value: sendValue, from: accounts[1]});
        let balanceCampaignAfter = await web3.eth.getBalance(campaign.address);
        let balanceContributorAfter = await web3.eth.getBalance(accounts[1]);

        assert.equal(parseInt(balanceCampaignAfter), parseInt(balanceCampaignBefore) + parseInt(sendValue));
        assert(parseInt(balanceContributorBefore) > (parseInt(balanceContributorAfter)
            + (parseInt(sendValue) + trans.receipt.gasUsed + parseInt(gasPrice))));

        let contribution = await campaign.contributions(accounts[1], 0);
        assert.equal(contribution.value, parseInt(sendValue));
        assert.equal(contribution.description, "Test send 5 gwei");
    });

    it("test multiple contributionCampaign", async () => {
        let campaign = await CrowdfundingCampaign.new("ContributeCampaignTest",
            [parseInt(web3.utils.toWei('500', 'gwei'))], accounts[7]);

        let balanceCampaignBefore = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaignBefore), 0);

        let sendValue = web3.utils.toWei('5', 'gwei');

        await campaign.contributeCampaign("Test send 5 gwei", {value: sendValue, from: accounts[1]});
        let balanceCampaignAfter = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaignAfter), parseInt(balanceCampaignBefore) + parseInt(sendValue));

        await campaign.contributeCampaign("Test send second 5 gwei", {value: sendValue, from: accounts[1]});
        balanceCampaignAfter = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaignAfter), parseInt(balanceCampaignBefore) + parseInt(sendValue) + parseInt(sendValue));

        await campaign.contributeCampaign("Test send third 5 gwei", {value: sendValue, from: accounts[2]});
        balanceCampaignAfter = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaignAfter), parseInt(balanceCampaignBefore) + parseInt(sendValue) + parseInt(sendValue) + parseInt(sendValue));

        let contribution = await campaign.contributions(accounts[1], 0);
        assert.equal(contribution.value, parseInt(sendValue));
        assert.equal(contribution.description, "Test send 5 gwei");

        contribution = await campaign.contributions(accounts[1], 1);
        assert.equal(contribution.value, parseInt(sendValue));
        assert.equal(contribution.description, "Test send second 5 gwei");

        contribution = await campaign.contributions(accounts[2], 0);
        assert.equal(contribution.value, parseInt(sendValue));
        assert.equal(contribution.description, "Test send third 5 gwei");
    });

    it("test contribute crowdfunding canceled campaign", async () => {
        let campaign = await CrowdfundingCampaign.new("ContributeTest", [web3.utils.toWei('5', 'gwei')], accounts[8]);

        let contrib1Text = "text";
        let contrib1Value = web3.utils.toWei('3', 'gwei');
        let contrib1Account = accounts[1];

        let balanceCampaign = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaign), 0);

        await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});
        balanceCampaign = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaign), web3.utils.toWei('3', 'gwei'));

        let cancel = await campaign.cancelCampaign();
        let campaignStatus = await campaign.campaignStatus();
        assert.equal(campaignStatus, "canceled");
        balanceCampaign = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaign), 0);
        let trans = await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});
        console.log()

        balanceCampaign = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(balanceCampaign), 0);
    });
});
