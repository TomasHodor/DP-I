const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign', async accounts => {
    // it("test finish crowdfunding campaign false", async () => {
    //     let contrib1Text = "text";
    //     let contrib1Value = 5000000;
    //     let contrib1Account = accounts[1];
    //
    //     let campaign = await CrowdfundingCampaign.new("TestFinish", 6000000, accounts[0]);
    //     await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});
    //
    //     let contrib1 = await campaign.getContribution(contrib1Account)
    //     assert.equal(contrib1.valueOf(), true);
    //     // compare totalValue
    //     let totalValue = await campaign.totalValue.call();
    //     assert.equal(totalValue.valueOf(), contrib1Value);
    //     // finish campaign
    //     let campaignResult = await campaign.finishCampaign.call();
    //     assert.equal(campaignResult.valueOf(), false);
    // });

    // it("test finish crowdfunding campaign", async () => {
    //     let ownerAccount = accounts[9]
    //     let contrib1Text = "text";
    //     let contrib1Value = 5000000;
    //     let contrib1Account = accounts[1];
    //     let contrib2Text = "text2";
    //     let contrib2Value = 2000000;
    //     let contrib2Account = accounts[2];
    //
    //     let campaign = await CrowdfundingCampaign.new("TestFinish", 6000000, ownerAccount);
    //     assert.equal(await campaign.getNumberOfContributions.call(), 0);
    //     let ownerBalanceBefore = await web3.eth.getBalance(ownerAccount);
    //     // 2 contributions
    //     await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});
    //
    //     await campaign.contributeCampaign(contrib2Text, {value: contrib2Value, from: contrib2Account});
    //
    //     let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     assert.equal(parseInt(CampaignAddressBalance), contrib1Value + contrib2Value);
    //
    //     let contrib1 = await campaign.getContribution(contrib1Account)
    //     assert.equal(contrib1.valueOf(), true);
    //     let contrib2 = await campaign.getContribution(contrib2Account)
    //     assert.equal(contrib2.valueOf(), true);
    //     // compare totalValue
    //     let totalValue = await campaign.totalValue.call();
    //     assert.equal(totalValue.valueOf(), contrib1Value + contrib2Value);
    //     // finish campaign
    //     let campaignResult = await campaign.finishCampaign({from: ownerAccount});
    //     // console.log(campaignResult)
    //
    //     CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     assert.equal(parseInt(CampaignAddressBalance), 0);
    //
    //     let ownerBalanceAfter = await web3.eth.getBalance(ownerAccount);
    //     console.log("Before owner account:", parseInt(ownerBalanceBefore));
    //     console.log("After owner account:", parseInt(ownerBalanceAfter));
    //     assert(parseInt(ownerBalanceBefore) < parseInt(ownerBalanceAfter));
    // });

    it("test finish crowdfunding campaign", async () => {
        let ownerAccount = "0x8B87A799436FbC7f99fd26a287C1093168A073Dc"
        let contrib1Text = "text";
        let contrib1Value = 5000000;
        let contrib1Account = accounts[1];
        let contrib2Text = "text2";
        let contrib2Value = 2000000;
        let contrib2Account = accounts[2];

        let campaign = await CrowdfundingCampaign.deployed();
        assert.equal(await campaign.getNumberOfContributions.call(), 0);
        let ownerBalanceBefore = await web3.eth.getBalance(ownerAccount);
        // 2 contributions
        await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});

        await campaign.contributeCampaign(contrib2Text, {value: contrib2Value, from: contrib2Account});

        let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", campaign.address)
        console.log("Campaigns balance:", CampaignAddressBalance);
        assert.equal(parseInt(CampaignAddressBalance), contrib1Value + contrib2Value);

        let contrib1 = await campaign.getContribution(contrib1Account)
        assert.equal(contrib1.valueOf(), true);
        let contrib2 = await campaign.getContribution(contrib2Account)
        assert.equal(contrib2.valueOf(), true);
        // compare totalValue
        let totalValue = await campaign.totalValue.call();
        assert.equal(totalValue.valueOf(), contrib1Value + contrib2Value);
        // finish campaign
        let campaignResult = await campaign.finishCampaign();
        console.log(campaignResult)

        CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", CampaignAddressBalance);
        assert.equal(parseInt(CampaignAddressBalance), 0);

        let ownerBalanceAfter = await web3.eth.getBalance(ownerAccount);
        console.log("Before owner account:", parseInt(ownerBalanceBefore));
        console.log("After owner account:", parseInt(ownerBalanceAfter));
        assert(parseInt(ownerBalanceBefore) < parseInt(ownerBalanceAfter));
    });
});