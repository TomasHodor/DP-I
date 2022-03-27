const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign', async accounts => {
    let gasPrice = web3.utils.toWei('20', 'gwei')

    it("test simple contribution", async () => {
        let campaign = await CrowdfundingCampaign.deployed();
        let ownerAddress = await campaign.ownerAddress.call();

        let balanceOwnerBefore = await web3.eth.getBalance(ownerAddress.valueOf());
        let balanceContributorBefore = await web3.eth.getBalance(accounts[1]);

        let sendValue = web3.utils.toWei('50', 'gwei')

        let trans = await campaign.contribute("Test send 50 gwei", {value: sendValue, from: accounts[1]});
        let balanceOwnerAfter = await web3.eth.getBalance(ownerAddress.valueOf());
        let balanceContributorAfter = await web3.eth.getBalance(accounts[1]);

        assert.equal(parseInt(balanceOwnerAfter), parseInt(balanceOwnerBefore) + parseInt(sendValue));
        assert(parseInt(balanceContributorBefore) > (parseInt(balanceContributorAfter)
            + (parseInt(sendValue) + trans.receipt.gasUsed + parseInt(gasPrice))));
    });

    it("test contributionCampaign", async () => {
        let campaign = await CrowdfundingCampaign.new("ContributeCampaignTest", web3.utils.toWei('500', 'gwei'), accounts[7]);
        let ownerAddress = await campaign.ownerAddress.call();

        let balanceCampaign = await web3.eth.getBalance(campaign.address);

        let balanceOwnerBefore = await web3.eth.getBalance(ownerAddress.valueOf());

        let sendValue = web3.utils.toWei('50', 'gwei')

        await campaign.contributeCampaign("Test send 50 gwei", {value: sendValue, from: accounts[1]});
        let balanceOwnerAfter = await web3.eth.getBalance(ownerAddress.valueOf());
        let balanceCampaignAfter = await web3.eth.getBalance(campaign.address);

        assert.equal(parseInt(balanceOwnerAfter), parseInt(balanceOwnerBefore));
        assert.equal(parseInt(balanceCampaignAfter), parseInt(balanceCampaign) + parseInt(sendValue));
    });

    it("test contribute crowdfunding campaign", async () => {
        let campaign = await CrowdfundingCampaign.new("ContributeTest", web3.utils.toWei('500', 'gwei'), accounts[8]);
        let ownerAddress = await campaign.ownerAddress.call();

        let contrib1Text = "text";
        let contrib1Value = web3.utils.toWei('0.3', 'gwei');
        let contrib1Account = accounts[1];
        let contrib2Text = "text2";
        let contrib2Value = web3.utils.toWei('0.2', 'gwei');
        let contrib2Account = accounts[2];

        let balanceOwner = await web3.eth.getBalance(ownerAddress.valueOf());

        await campaign.contribute(contrib1Text, {value: contrib1Value, from: contrib1Account});

        let contribution1 = await campaign.contributions.call(0);
        assert.equal(contribution1.contributor.valueOf(), contrib1Account);
        assert.equal(contribution1.value.valueOf(), contrib1Value);
        assert.equal(contribution1.description.valueOf(), contrib1Text);

        let balanceFirstContrib = await web3.eth.getBalance(ownerAddress.valueOf());
        assert.equal(parseInt(balanceFirstContrib), parseInt(balanceOwner) + parseInt(contrib1Value));

        await campaign.contribute(contrib2Text, {value: contrib2Value, from: contrib2Account});

        let contribution2 = await campaign.contributions.call(1);
        assert.equal(contribution2.contributor.valueOf(), contrib2Account);
        assert.equal(contribution2.value.valueOf(), contrib2Value);
        assert.equal(contribution2.description.valueOf(), contrib2Text);

        let balanceSecondContrib = await web3.eth.getBalance(ownerAddress.valueOf());
        assert.equal(parseInt(balanceSecondContrib), parseInt(balanceFirstContrib) + parseInt(contrib2Value));
    });

    it("test new crowdfunding campaign and multiple contributions", async () => {
        let campaign = await CrowdfundingCampaign.new("MultipleContributionsTest", 5000000, accounts[8]);
        let ownerAddress = await campaign.ownerAddress.call();

        let balanceBefore = await web3.eth.getBalance(ownerAddress);

        await campaign.contribute("contribute1", {value: 100000, from: accounts[1]})
        await campaign.contribute("contribute2", {value: 200000, from: accounts[2]})

        let numberOfContributions = await campaign.getNumberOfContributions.call();
        assert.equal(numberOfContributions.valueOf(), 2);
        let totalValue = await campaign.totalValue.call();
        assert.equal(totalValue.valueOf(),  100000 + 200000);

        let balanceAfter = await web3.eth.getBalance(ownerAddress);
        assert.equal(parseInt(balanceAfter), parseInt(balanceBefore) + 100000 + 200000);

        await campaign.contribute("contribute3", {value: 150000, from: accounts[5]})

        numberOfContributions = await campaign.getNumberOfContributions.call();
        assert.equal(numberOfContributions.valueOf(), 3);
        totalValue = await campaign.totalValue.call();
        assert.equal(totalValue.valueOf(),  100000 + 200000 + 150000);

        let balanceLast = await web3.eth.getBalance(ownerAddress);
        assert.equal(parseInt(balanceLast),  parseInt(balanceAfter) + 150000);
    });
});
