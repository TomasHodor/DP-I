const CrowdfundingCampaign = artifacts.require("CrowdfundingCampaign");

contract('CrowdfundingCampaign',  accounts => {
    it("test deploying crowdfunding campaign", async () => {
        let campaign = await CrowdfundingCampaign.deployed();

        let minimumContribution = await campaign.getMinimumContribution.call();
        let totalValue = await campaign.getTotalValue.call();
        let numberOfContributors = await campaign.getContributorsCount.call();

        assert.equal(minimumContribution.valueOf(), 1);
        assert.equal(totalValue.valueOf(), 0);
        assert.equal(numberOfContributors.valueOf(), 0);
    });

    it("test contribute/contribute2 crowdfunding campaign", async () => {
        let campaign = await CrowdfundingCampaign.deployed();

        await campaign.contribute({value: 5, from: accounts[1]});

        let contributor = await campaign.getContribution.call(accounts[1])
        assert.equal(contributor.valueOf(), true);

        let falseContributor = await campaign.getContribution.call(accounts[5])
        assert.equal(falseContributor.valueOf(), false);

        await campaign.contribute2(5, {from: accounts[5]});
        let contributor2 = await campaign.getContribution.call(accounts[5])
        assert.equal(contributor2.valueOf(), true);
    });

    it("test new crowdfunding campaign and multiple contributions", async () => {
        let ownerAddress = "0xFca5a0B5348277C2295c46DBc4E9c1AE56381F9b"

        let campaign = await CrowdfundingCampaign.new(1, ownerAddress);
        let owner = await campaign.getOwnerAddress.call()
        assert.equal(owner.valueOf(), ownerAddress);

        let balanceBefore = await web3.eth.getBalance(ownerAddress);

        await campaign.contribute({value: 10, from: accounts[1]})
        await campaign.contribute({value: 20, from: accounts[2]})

        let numberOfContributors = await campaign.getContributorsCount.call();
        assert.equal(numberOfContributors.valueOf(), 2);
        let totalValue = await campaign.getTotalValue.call();
        assert.equal(totalValue.valueOf(),  10 + 20);

        let balanceAfter = await web3.eth.getBalance(ownerAddress);
        assert.equal(parseInt(balanceAfter),  parseInt(balanceBefore) + 10 + 20);

        await campaign.contribute({value: 15, from: accounts[5]})

        numberOfContributors = await campaign.getContributorsCount.call();
        assert.equal(numberOfContributors.valueOf(), 3);
        totalValue = await campaign.getTotalValue.call();
        assert.equal(totalValue.valueOf(),  10 + 20 + 15);

        let balanceLast = await web3.eth.getBalance(ownerAddress);
        assert.equal(parseInt(balanceLast),  parseInt(balanceAfter) + 15);
    });
})

describe('CrowdfundingCampaign', function() {
    it('create campaign', async () => {
        const campaign = await CrowdfundingCampaign.deployed();
        const minimumContribution = await campaign.getMinimumContribution.call();

        assert.equal(minimumContribution.valueOf(), 1);
    });
});

