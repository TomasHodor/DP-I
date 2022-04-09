const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign', async accounts => {
    it("test withdraw contribution", async () => {
        let contrib1Text = "text";
        let contrib1Value = web3.utils.toWei('1', 'ether');
        let contrib1Account = accounts[3];
        let contrib2Text = "text2";
        let contrib2Value = web3.utils.toWei('2000', 'gwei');
        let contrib2Account = accounts[4];

        let campaign = await CrowdfundingCampaign.new("TestWithdraw", web3.utils.toWei('7000', 'gwei'), accounts[0]);
        assert.equal(await campaign.getNumberOfContributors(), 0);
        let acc1BalanceFirst = await web3.eth.getBalance(contrib1Account);
        // 2 contributions
        await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});
        await campaign.contributeCampaign(contrib2Text, {value: contrib2Value, from: contrib2Account});

        let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", CampaignAddressBalance);

        // compare totalValue
        let totalValue = await campaign.totalValue();
        assert.equal(totalValue.valueOf(), parseInt(contrib1Value) + parseInt(contrib2Value));
        // account1 before withdraw
        let acc1BalanceBefore = await web3.eth.getBalance(contrib1Account);
        // withdraw contribution
        let trans = await campaign.withdrawContribution(0, {from: contrib1Account, gas: 100000});
        // console.log(trans.receipt)
        // compare totalValue
        totalValue = await campaign.totalValue();
        assert.equal(totalValue.valueOf(), contrib2Value);
        CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:      ", CampaignAddressBalance);
        assert.equal(parseInt(CampaignAddressBalance), contrib2Value);

        // check if account received contribution
        let acc1BalanceAfter = await web3.eth.getBalance(contrib1Account);
        console.log("Accounts[3] balance before contribution:", acc1BalanceFirst);
        console.log("Accounts[3] balance after contribution: ", acc1BalanceBefore);
        console.log("contribution 1 value:                    ", contrib1Value);
        console.log("Accounts[3] balance after withdraw    : ", acc1BalanceAfter );
        assert(parseInt(acc1BalanceAfter) >= parseInt(acc1BalanceBefore));
    });

    it("test withdraw contribution false", async () => {
        let contrib1Text = "text";
        let contrib1Value = web3.utils.toWei('10', 'gwei');
        let contrib1Account = accounts[3];
        let contrib2Text = "text2";
        let contrib2Value = web3.utils.toWei('20', 'gwei');
        let contrib2Account = accounts[4];

        let campaign = await CrowdfundingCampaign.new("TestWithdraw2", web3.utils.toWei('30', 'gwei'), accounts[0]);
        assert.equal(await campaign.getNumberOfContributors(), 0);
        // 2 contributions
        await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});
        await campaign.contributeCampaign(contrib2Text, {value: contrib2Value, from: contrib2Account});

        let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", CampaignAddressBalance);

        // compare totalValue
        let totalValue = await campaign.totalValue();
        assert.equal(totalValue.valueOf(), parseInt(contrib1Value) + parseInt(contrib2Value));
        // account1 before withdraw
        let acc1Balance = await web3.eth.getBalance(accounts[1]);
        console.log("Accounts[1] balance:", acc1Balance);
        // withdraw contribution
        let trans = await campaign.withdrawContribution(0, {from: accounts[1], gas: 100000});
        acc1Balance = await web3.eth.getBalance(accounts[1]);
        console.log("Accounts[1] balance:", acc1Balance);
        // console.log(trans.receipt)
        // compare totalValue
        totalValue = await campaign.totalValue();
        assert.equal(totalValue.valueOf(), web3.utils.toWei('30', 'gwei'));
        CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", CampaignAddressBalance);
        assert.equal(parseInt(CampaignAddressBalance), web3.utils.toWei('30', 'gwei'));
    });

    it("test withdraw contribution false2", async () => {
        let contrib1Text = "text";
        let contrib1Value = web3.utils.toWei('10', 'gwei');
        let contrib1Account = accounts[3];
        let contrib2Text = "text2";
        let contrib2Value = web3.utils.toWei('20', 'gwei');
        let contrib2Account = accounts[4];

        let campaign = await CrowdfundingCampaign.new("TestWithdraw3", web3.utils.toWei('30', 'gwei'), accounts[0]);
        assert.equal(await campaign.getNumberOfContributors(), 0);
        // 2 contributions
        await campaign.contributeCampaign(contrib1Text, {value: contrib1Value, from: contrib1Account});
        await campaign.contributeCampaign(contrib2Text, {value: contrib2Value, from: contrib2Account});

        let CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", CampaignAddressBalance);

        // compare totalValue
        let totalValue = await campaign.totalValue();
        assert.equal(totalValue.valueOf(), parseInt(contrib1Value) + parseInt(contrib2Value));
        // account1 before withdraw
        let acc1Balance = await web3.eth.getBalance(contrib1Account);
        console.log("Accounts[3] balance:", acc1Balance);
        // withdraw contribution
        let trans = await campaign.withdrawContribution(1, {from: contrib1Account, gas: 100000});
        acc1Balance = await web3.eth.getBalance(contrib1Account);
        console.log("Accounts[3] balance:", acc1Balance);
        // console.log(trans.receipt)
        // compare totalValue
        totalValue = await campaign.totalValue();
        assert.equal(totalValue.valueOf(), web3.utils.toWei('30', 'gwei'));
        CampaignAddressBalance = await web3.eth.getBalance(campaign.address);
        console.log("Campaigns balance:", CampaignAddressBalance);
        assert.equal(parseInt(CampaignAddressBalance), web3.utils.toWei('30', 'gwei'));
    });
});