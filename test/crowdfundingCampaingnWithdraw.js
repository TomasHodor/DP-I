const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign', async accounts => {
    it("test withdraw contribution", async () => {
        let contrib1Text = "text";
        let contrib1Value = 5000000;
        let contrib1Account = accounts[1];
        let contrib2Text = "text2";
        let contrib2Value = 2000000;
        let contrib2Account = accounts[2];

        let campaign = await CrowdfundingCampaign.new("TestWithdraw", 5000000000, accounts[0]);
        assert.equal(await campaign.getNumberOfContributions.call(), 0);
        // 2 contributions
        await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});

        await campaign.contributeCampaign(contrib2Text, {value: contrib2Value, from: contrib2Account});

        let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", CampaignAddressBalance);

        let contrib1 = await campaign.getContribution(contrib1Account)
        assert.equal(contrib1.valueOf(), true);
        let contrib2 = await campaign.getContribution(contrib2Account)
        assert.equal(contrib2.valueOf(), true);
        // compare totalValue
        let totalValue = await campaign.totalValue.call();
        assert.equal(totalValue.valueOf(), contrib1Value + contrib2Value);
        // account1 before withdraw
        let balanceAcc1Before = await web3.eth.getBalance(contrib1Account);
        console.log("Accounts[1] balance:",balanceAcc1Before);
        // withdraw contribution
        let trans = await campaign.withdrawContribution(0);
        // console.log(trans);

        // check if account is out of contribution
        contrib1 = await campaign.getContribution.call(contrib1Account)
        assert.equal(contrib1.valueOf(), false);
        // compare totalValue
        totalValue = await campaign.totalValue.call();
        assert.equal(totalValue.valueOf(), contrib2Value);
        // check if account received contribution
        let balanceAcc1After = await web3.eth.getBalance(contrib1Account);
        console.log("Accounts[1] balance:", balanceAcc1After);
        console.log("Accounts[1] before balance:",balanceAcc1Before, " contribution:", contrib1Value)
        assert(parseInt(balanceAcc1After) >= parseInt(balanceAcc1Before) + contrib1Value);

        CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", CampaignAddressBalance);
        assert.equal(parseInt(CampaignAddressBalance), contrib2Value);
    });

    // it("test2", async () => {
    //     let campaign = await CrowdfundingCampaign.deployed();
    //     let contrib1Value = 500000;
    //     let contrib1Account = accounts[1];
    //
    //     await campaign.contribute("Test", {value: contrib1Value, from: contrib1Account});
    //     let numberOfContributions = await campaign.getNumberOfContributions.call();
    //     assert.equal(numberOfContributions.valueOf(), 1);
    //
    //     console.log(campaign);
    //     console.log(campaign.address);
    //     let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log(CampaignAddressBalance);
    //
    // });
});