const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign', async accounts => {

    it("test finish crowdfunding campaign", async () => {
        console.log("test finish crowdfunding campaign")
        let ownerAccount = accounts[9]
        let contrib1Text = "text";
        let contrib1Value = parseInt(web3.utils.toWei('0.004', 'ether'));
        let contrib1Account = accounts[1];
        let contrib2Text = "text2";
        let contrib2Value = parseInt(web3.utils.toWei('0.002', 'ether'));
        let contrib2Account = accounts[2];

        let campaign = await CrowdfundingCampaign.new("TestFinishCampaignFunction", parseInt(web3.utils.toWei('0.006', 'ether')), ownerAccount);
        let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(CampaignAddressBalance), 0);
        console.log("Campaigns balance:", CampaignAddressBalance);
        assert.equal(await campaign.getNumberOfContributions.call(), 0);
        // compare campaignStatus
        let campaignStatus = await campaign.campaignStatus.call();
        console.log("Campaigns status:", campaignStatus);
        assert.equal(campaignStatus.valueOf(), "active");
        let ownerBalanceBefore = await web3.eth.getBalance(ownerAccount);
        // 2 contributions
        await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});
        console.log("Contribution - value:", contrib1Value);
        await campaign.contributeCampaign(contrib2Text, {value: contrib2Value, from: contrib2Account});
        console.log("Contribution - value:", contrib2Value);

        CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", CampaignAddressBalance);
        assert.equal(parseInt(CampaignAddressBalance), contrib1Value + contrib2Value);
        // compare totalValue
        let totalValue = await campaign.totalValue.call();
        assert.equal(totalValue.valueOf(), contrib1Value + contrib2Value);
        // finish campaign
        await campaign.finishCampaign({from: ownerAccount, gas: 1000000});

        CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", CampaignAddressBalance);
        assert.equal(parseInt(CampaignAddressBalance), 0);
        // compare campaignStatus
        campaignStatus = await campaign.campaignStatus.call();
        console.log("Campaigns status:", campaignStatus);
        assert.equal(campaignStatus.valueOf(), "finished");

        let ownerBalanceAfter = await web3.eth.getBalance(ownerAccount);
        console.log("Before owner account:", parseInt(ownerBalanceBefore));
        console.log("After owner account:", parseInt(ownerBalanceAfter));
        assert(parseInt(ownerBalanceBefore) < parseInt(ownerBalanceAfter));
    });

    it("test finish crowdfunding campaign deployed", async () => {
        console.log("test finish crowdfunding campaign deployed")
        let ownerAccount = accounts[9]
        let contrib1Text = "text";
        let contrib1Value = parseInt(web3.utils.toWei('5000000', 'gwei'));
        let contrib1Account = accounts[1];
        let contrib2Text = "text2";
        let contrib2Value = parseInt(web3.utils.toWei('2000000', 'gwei'));
        let contrib2Account = accounts[2];

        let campaign = await CrowdfundingCampaign.deployed();
        assert.equal(await campaign.getNumberOfContributions.call(), 0);
        let ownerBalanceBefore = await web3.eth.getBalance(ownerAccount);

        // compare campaignStatus
        let campaignStatus = await campaign.campaignStatus.call();
        console.log("Campaigns status:", campaignStatus);
        assert.equal(campaignStatus.valueOf(), "active");
        // 2 contributions
        await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});
        await campaign.contributeCampaign(contrib2Text, {value: contrib2Value, from: contrib2Account});

        let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns address:", campaign.address)
        console.log("Campaigns balance:", CampaignAddressBalance);
        assert.equal(parseInt(CampaignAddressBalance), contrib1Value + contrib2Value);
        // compare totalValue
        let totalValue = await campaign.totalValue.call();
        assert.equal(totalValue.valueOf(), contrib1Value + contrib2Value);

        // finish campaign
        await campaign.finishCampaign({from: ownerAccount, gas: 1000000});

        // compare campaignStatus
        campaignStatus = await campaign.campaignStatus.call();
        console.log("Campaigns status:", campaignStatus);
        assert.equal(campaignStatus.valueOf(), "finished");
        // compare campaign balance
        CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", CampaignAddressBalance);
        assert.equal(parseInt(CampaignAddressBalance), 0);

        let ownerBalanceAfter = await web3.eth.getBalance(ownerAccount);
        console.log("Before owner account:", parseInt(ownerBalanceBefore));
        console.log("After owner account:", parseInt(ownerBalanceAfter));
        assert(parseInt(ownerBalanceBefore) < parseInt(ownerBalanceAfter));
    });
});