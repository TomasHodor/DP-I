const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign', async accounts => {

    async function testStatus(campaign, statusValue) {
        let campaignStatus = await campaign.campaignStatus();
        console.log("Campaigns status:", campaignStatus);
        assert.equal(campaignStatus, statusValue);
    }

    it("test finish crowdfunding campaign", async () => {
        console.log("test finish crowdfunding campaign")
        let ownerAccount = accounts[9]
        let contrib1Text = "text";
        let contrib1Value = parseInt(web3.utils.toWei('0.004', 'ether'));
        let contrib1Account = accounts[1];
        let contrib2Text = "text2";
        let contrib2Value = parseInt(web3.utils.toWei('0.002', 'ether'));
        let contrib2Account = accounts[2];

        let campaign = await CrowdfundingCampaign.new("TestFinishCampaignFunction",
            [parseInt(web3.utils.toWei('0.006', 'ether'))], ownerAccount);
        let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        assert.equal(parseInt(CampaignAddressBalance), 0);
        console.log("Campaigns balance:", CampaignAddressBalance);
        // compare campaignStatus
        await testStatus(campaign, "active");
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
        let totalValue = await campaign.totalValue();
        assert.equal(totalValue, contrib1Value + contrib2Value);

        // finish campaign
        await campaign.transferCapital({from: ownerAccount, gas: 1000000});

        CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", CampaignAddressBalance);
        assert.equal(parseInt(CampaignAddressBalance), 0);
        // compare campaignStatus
        await testStatus(campaign, "finished");

        let paidContribution = await campaign.paidContributions(contrib1Account, 0);
        assert.equal(paidContribution.value, parseInt(web3.utils.toWei('0.004', 'ether')));
        assert.equal(paidContribution.description, "text");
        paidContribution = await campaign.paidContributions(contrib2Account, 0);
        assert.equal(paidContribution.value, parseInt(web3.utils.toWei('0.002', 'ether')));
        assert.equal(paidContribution.description, "text2");

        let contributions = await campaign.getNumberOfAddressContribution(contrib1Account);
        assert.equal(contributions, 0);
        contributions = await campaign.getNumberOfAddressContribution(contrib2Account);
        assert.equal(contributions, 0);

        let ownerBalanceAfter = await web3.eth.getBalance(ownerAccount);
        console.log("Before owner account:", parseInt(ownerBalanceBefore));
        console.log("After owner account:", parseInt(ownerBalanceAfter));
        assert(parseInt(ownerBalanceBefore) < parseInt(ownerBalanceAfter));
    });

    // it("test finish crowdfunding campaign", async () => {
    //     console.log("test finish crowdfunding campaign")
    //     let ownerAccount = accounts[9]
    //     let contrib1Text = "text";
    //     let contrib1Value = parseInt(web3.utils.toWei('0.002', 'ether'));
    //     let contrib1Account = accounts[1];
    //     let contrib2Text = "text2";
    //     let contrib2Value = parseInt(web3.utils.toWei('0.004', 'ether'));
    //     let contrib2Account = accounts[2];
    //
    //     let campaign = await CrowdfundingCampaign.new("TestTransferCampaignFunction",
    //         [parseInt(web3.utils.toWei('0.002', 'ether')), parseInt(web3.utils.toWei('0.004', 'ether'))], ownerAccount);
    //     let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     assert.equal(parseInt(CampaignAddressBalance), 0);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     // compare campaignStatus
    //     await testStatus(campaign, "active");
    //     let ownerBalanceBefore = await web3.eth.getBalance(ownerAccount);
    //     // 2 contributions
    //     await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});
    //     console.log("Contribution - value:", contrib1Value);
    //     CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //
    //     // transfer capital
    //     await campaign.transferCapital({from: ownerAccount, gas: 1000000});
    //     CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     assert.equal(parseInt(CampaignAddressBalance), 0);
    //     await testStatus(campaign, "active");
    //
    //     await campaign.contributeCampaign(contrib2Text, {value: contrib2Value, from: contrib2Account});
    //     console.log("Contribution - value:", contrib2Value);
    //     CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     assert.equal(parseInt(CampaignAddressBalance), contrib2Value);
    //     // compare totalValue
    //     let totalValue = await campaign.totalValue();
    //     assert.equal(totalValue, contrib1Value + contrib2Value);
    //
    //     await campaign.transferCapital({from: ownerAccount, gas: 1000000});
    //     CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     assert.equal(parseInt(CampaignAddressBalance), 0);
    //     // compare campaignStatus
    //     campaignStatus = await testStatus(campaign, "finished");
    //
    //     let ownerBalanceAfter = await web3.eth.getBalance(ownerAccount);
    //     console.log("Before owner account:", parseInt(ownerBalanceBefore));
    //     console.log("After owner account:", parseInt(ownerBalanceAfter));
    //     assert(parseInt(ownerBalanceBefore) < parseInt(ownerBalanceAfter));
    // });

    // it("test finish crowdfunding campaign", async () => {
    //     console.log("test finish crowdfunding campaign")
    //     let ownerAccount = accounts[9]
    //     let contrib1Text = "text";
    //     let contrib1Value = parseInt(web3.utils.toWei('0.002', 'ether'));
    //     let contrib1Account = accounts[1];
    //     let contrib2Text = "text2";
    //     let contrib2Value = parseInt(web3.utils.toWei('0.001', 'ether'));
    //     let contrib2Account = accounts[2];
    //
    //     let campaign = await CrowdfundingCampaign.new("TestTransferCampaignFunction",
    //         [parseInt(web3.utils.toWei('0.002', 'ether')), parseInt(web3.utils.toWei('0.006', 'ether'))], ownerAccount);
    //     let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     assert.equal(parseInt(CampaignAddressBalance), 0);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     // compare campaignStatus
    //     await testStatus(campaign, "active");
    //     let ownerBalanceBefore = await web3.eth.getBalance(ownerAccount);
    //     // 2 contributions
    //     await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});
    //     console.log("Contribution - value:", contrib1Value);
    //     CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //
    //     // transfer capital
    //     await campaign.transferCapital({from: ownerAccount, gas: 1000000});
    //     CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     assert.equal(parseInt(CampaignAddressBalance), 0);
    //     campaignStatus = await campaign.campaignStatus();
    //     console.log("Campaigns status:", campaignStatus);
    //     assert.equal(campaignStatus, "active");
    //
    //     await campaign.contributeCampaign(contrib2Text, {value: contrib2Value, from: contrib2Account});
    //     console.log("Contribution - value:", contrib2Value);
    //     CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     assert.equal(parseInt(CampaignAddressBalance), contrib2Value);
    //     // compare totalValue
    //     let totalValue = await campaign.totalValue();
    //     assert.equal(totalValue, contrib1Value + contrib2Value);
    //
    //     await campaign.transferCapital({from: ownerAccount, gas: 1000000});
    //     CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     assert.equal(parseInt(CampaignAddressBalance), contrib2Value);
    //     // compare campaignStatus
    //     await testStatus(campaign, "active");
    //
    //     let ownerBalanceAfter = await web3.eth.getBalance(ownerAccount);
    //     console.log("Before owner account:", parseInt(ownerBalanceBefore));
    //     console.log("After owner account:", parseInt(ownerBalanceAfter));
    //     assert(parseInt(ownerBalanceBefore) < parseInt(ownerBalanceAfter));
    // });

    // it("test finish crowdfunding campaign", async () => {
    //     console.log("test finish crowdfunding campaign")
    //     let ownerAccount = accounts[9]
    //     let contrib1Text = "text";
    //     let contrib1Value = parseInt(web3.utils.toWei('0.001', 'ether'));
    //     let contrib1Account = accounts[1];
    //     let contrib2Text = "text2";
    //     let contrib2Value = parseInt(web3.utils.toWei('0.002', 'ether'));
    //     let contrib2Account = accounts[2];
    //
    //     let campaign = await CrowdfundingCampaign.new("TestTransferCampaignFunction",
    //         [parseInt(web3.utils.toWei('0.001', 'ether')), parseInt(web3.utils.toWei('0.002', 'ether'))], ownerAccount);
    //     let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     assert.equal(parseInt(CampaignAddressBalance), 0);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     // compare campaignStatus
    //     await testStatus(campaign, "active");
    //     let ownerBalanceBefore = await web3.eth.getBalance(ownerAccount);
    //     // 2 contributions
    //     await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});
    //     console.log("Contribution - value:", contrib1Value);
    //     CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //
    //     await campaign.contributeCampaign(contrib2Text, {value: contrib2Value, from: contrib2Account});
    //     console.log("Contribution - value:", contrib2Value);
    //     CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     assert.equal(parseInt(CampaignAddressBalance), contrib1Value + contrib2Value);
    //     // compare totalValue
    //     let totalValue = await campaign.totalValue();
    //     assert.equal(totalValue, contrib1Value + contrib2Value);
    //
    //     await campaign.transferCapital({from: ownerAccount, gas: 1000000});
    //     CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
    //     console.log("Campaigns balance:", CampaignAddressBalance);
    //     assert.equal(parseInt(CampaignAddressBalance), 0);
    //
    //     let contribution = await campaign.contributions(contrib1Account, 0);
    //     assert.equal(contribution.value, parseInt(web3.utils.toWei('0.001', 'ether')));
    //     assert.equal(contribution.description, "text");
    //
    //     // compare campaignStatus
    //     await testStatus(campaign, "finished");
    //
    //     let ownerBalanceAfter = await web3.eth.getBalance(ownerAccount);
    //     console.log("Before owner account:", parseInt(ownerBalanceBefore));
    //     console.log("After owner account:", parseInt(ownerBalanceAfter));
    //     assert(parseInt(ownerBalanceBefore) < parseInt(ownerBalanceAfter));
    // });
});