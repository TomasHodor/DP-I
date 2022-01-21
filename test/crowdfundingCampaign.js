const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign',  accounts => {
    it("test deploying crowdfunding campaign", async () => {
        let campaign = await CrowdfundingCampaign.deployed();

        let minimumContribution = await campaign.minimumContribution.call();
        let totalValue = await campaign.totalValue.call();
        let numberOfContributions = await campaign.getNumberOfContributions.call();

        assert.equal(minimumContribution.valueOf(), 1);
        assert.equal(totalValue.valueOf(), 0);
        assert.equal(numberOfContributions.valueOf(), 0);
    });

    it("test contribute crowdfunding campaign", async () => {
        let contribution1Text = "text";
        let contribution1Value = 5;
        let contribution1Account = accounts[1];
        let contribution2Text = "text2";
        let contribution2Value = 2;
        let contribution2Account = accounts[2];

        let campaign = await CrowdfundingCampaign.deployed();
        assert.equal(await campaign.getNumberOfContributions.call(), 0);

        await campaign.contribute(contribution1Text, {value: contribution1Value, from: contribution1Account});

        let contributor = await campaign.getContribution.call(contribution1Account)
        assert.equal(contributor.valueOf(), true);
        let contribution1 = await campaign.contributions.call(0);
        assert.equal(contribution1.contributor.valueOf(), contribution1Account);
        assert.equal(contribution1.value.valueOf(), contribution1Value);
        assert.equal(contribution1.description.valueOf(), contribution1Text);

        let falseContributor = await campaign.getContribution.call(contribution2Account)
        assert.equal(falseContributor.valueOf(), false);

        await campaign.contribute(contribution2Text, {value: contribution2Value, from: contribution2Account});

        let contributor2 = await campaign.getContribution.call(contribution2Account)
        assert.equal(contributor2.valueOf(), true);
        let contribution2 = await campaign.contributions.call(1);
        assert.equal(contribution2.contributor.valueOf(), contribution2Account);
        assert.equal(contribution2.value.valueOf(), contribution2Value);
        assert.equal(contribution2.description.valueOf(), contribution2Text);
    });

    it("test contribute2 crowdfunding campaign", async () => {
        let contribution1Value = 2;
        let contribution2Value = 7;
        let contribution1Account = accounts[3];
        let contribution2Account = accounts[4];

        let campaign = await CrowdfundingCampaign.deployed();
        assert.equal(await campaign.getNumberOfContributions.call(), 2);

        await campaign.contribute2(contribution1Value, {from: contribution1Account});

        let contributor = await campaign.getContribution.call(contribution1Account)
        assert.equal(contributor.valueOf(), true);
        let contribution1 = await campaign.contributions.call(2);
        assert.equal(contribution1.contributor.valueOf(), contribution1Account);
        assert.equal(contribution1.value.valueOf(), contribution1Value);

        await campaign.contribute2(contribution2Value, {from: contribution2Account});

        let contributor2 = await campaign.getContribution.call(contribution2Account)
        assert.equal(contributor2.valueOf(), true);
        let contribution2 = await campaign.contributions.call(3);
        assert.equal(contribution2.contributor.valueOf(), contribution2Account);
        assert.equal(contribution2.value.valueOf(), contribution2Value);
    });

    it("test contribute3 crowdfunding campaign", async () => {
        let contribution1Text = "text";
        let contribution1Value = 3;
        let contribution1Account = accounts[5];
        let contribution2Text = "text2";
        let contribution2Value = 1;
        let contribution2Account = accounts[6];

        let campaign = await CrowdfundingCampaign.deployed();
        assert.equal(await campaign.getNumberOfContributions.call(), 4);

        await campaign.contribute3(contribution1Value, contribution1Account, contribution1Text);

        let contributor = await campaign.getContribution.call(contribution1Account)
        assert.equal(contributor.valueOf(), true);
        let contribution1 = await campaign.contributions.call(4);
        assert.equal(contribution1.contributor.valueOf(), contribution1Account);
        assert.equal(contribution1.value.valueOf(), contribution1Value);
        assert.equal(contribution1.description.valueOf(), contribution1Text);

        await campaign.contribute3(contribution2Value, contribution2Account, contribution2Text)

        let contributor2 = await campaign.getContribution.call(contribution2Account)
        assert.equal(contributor2.valueOf(), true);
        let contribution2 = await campaign.contributions.call(5);
        assert.equal(contribution2.contributor.valueOf(), contribution2Account);
        assert.equal(contribution2.value.valueOf(), contribution2Value);
        assert.equal(contribution2.description.valueOf(), contribution2Text);
    });

    it("test new crowdfunding campaign and multiple contributions", async () => {
        let ownerAddress = "0xFca5a0B5348277C2295c46DBc4E9c1AE56381F9b"

        let campaign = await CrowdfundingCampaign.new("Test", 1, ownerAddress, );
        let owner = await campaign.ownerAddress.call()
        assert.equal(owner.valueOf(), ownerAddress);

        let balanceBefore = await web3.eth.getBalance(ownerAddress);

        await campaign.contribute("contribute1", {value: 10, from: accounts[1]})
        await campaign.contribute("contribute2", {value: 20, from: accounts[2]})

        let numberOfContributions = await campaign.getNumberOfContributions.call();
        assert.equal(numberOfContributions.valueOf(), 2);
        let totalValue = await campaign.totalValue.call();
        assert.equal(totalValue.valueOf(),  10 + 20);

        let balanceAfter = await web3.eth.getBalance(ownerAddress);
        assert.equal(parseInt(balanceAfter), parseInt(balanceBefore) + 10 + 20);

        await campaign.contribute("contribute3", {value: 15, from: accounts[5]})

        numberOfContributions = await campaign.getNumberOfContributions.call();
        assert.equal(numberOfContributions.valueOf(), 3);
        totalValue = await campaign.totalValue.call();
        assert.equal(totalValue.valueOf(),  10 + 20 + 15);

        let balanceLast = await web3.eth.getBalance(ownerAddress);
        assert.equal(parseInt(balanceLast),  parseInt(balanceAfter) + 15);
    });

    it("test retrive crowdfunding campaign", async () => {
        let contribution1Text = "text";
        let contribution1Value = 5;
        let contribution1Account = accounts[1];
        let contribution2Text = "text2";
        let contribution2Value = 2;
        let contribution2Account = accounts[2];

        let campaign = await CrowdfundingCampaign.new("Test", 1, accounts[0]);
        assert.equal(await campaign.getNumberOfContributions.call(), 0);

        await campaign.contribute(contribution1Text, {value: contribution1Value, from: contribution1Account});
        await campaign.contribute(contribution2Text, {value: contribution2Value, from: contribution2Account});

        await campaign.retrieveContribution(0);

        let contribution2 = await campaign.contributions.call(1);
        assert.equal(contribution2.contributor.valueOf(), contribution2Account);
        assert.equal(contribution2.value.valueOf(), contribution2Value);
        assert.equal(contribution2.description.valueOf(), contribution2Text);
    });
})

