pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CrowdfundingCampaign.sol";

contract TestCrowdfundingCampaign {
    address owner = DeployedAddresses.CrowdfundingCampaign();
    address address1 = tx.origin;

    function testInitialCrowdfundContract() public {

        uint expectedMinimumContribution = 5;
        CrowdfundingCampaign campaign = new CrowdfundingCampaign(expectedMinimumContribution, owner);

        Assert.equal(campaign.getMinimumContribution(), expectedMinimumContribution, "Minimum Contribution");
        Assert.equal(campaign.getTotalValue(), 0, "Balance value");
    }

    function testContributeCrowdfundContract() public {
        uint expectedTotalValue = 20;
        CrowdfundingCampaign campaign = new CrowdfundingCampaign(5, owner);

        uint balanceBefore = campaign.ownerAddress().balance;

        uint contributors = campaign.contribute.value(expectedTotalValue)(address1);

        uint balanceAfter = campaign.ownerAddress().balance;

        Assert.equal(campaign.getTotalValue(), expectedTotalValue, "Balance value");
        Assert.equal(contributors, 1, "Number of contributors");
        Assert.equal(campaign.contributorsCount(), 1, "Number of contributors");

        Assert.equal(balanceBefore, balanceAfter + expectedTotalValue, "");
    }

}
