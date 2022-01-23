const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign', async accounts => {
    it("test retrieve crowdfunding campaign", async () => {
        let contrib1Text = "text";
        let contrib1Value = 5000000;
        let contrib1Account = accounts[1];
        let contrib2Text = "text2";
        let contrib2Value = 2000000;
        let contrib2Account = accounts[2];

        let campaign = await CrowdfundingCampaign.new("TestRetrieve", 500, accounts[0]);
        assert.equal(await campaign.getNumberOfContributions.call(), 0);

        let balance0 = await web3.eth.getBalance(accounts[0]);

        await campaign.contribute(contrib1Text, {value: contrib1Value, from: contrib1Account});
        await campaign.contribute(contrib2Text, {value: contrib2Value, from: contrib2Account});
        await campaign.contribute3(contrib2Value, contrib2Account, contrib2Text);

        let balance1 = await web3.eth.getBalance(accounts[0]);
        console.log(balance1)

        let success = await campaign.retrieveContribution.call(0);
        let totalValue = await campaign.totalValue.call();
        assert.equal(totalValue.valueOf(), 2);

        let balance2 = await web3.eth.getBalance(accounts[0]);
        console.log(balance2);

        let contrib2 = await campaign.contributions.call(1);
        assert.equal(contrib2.contributor.valueOf(), contrib2Account);
        assert.equal(contrib2.value.valueOf(), contrib2Value);
        assert.equal(contrib2.description.valueOf(), contrib2Text);

        assert.equal(balance2, balance1 - contrib1Value);
    });

});