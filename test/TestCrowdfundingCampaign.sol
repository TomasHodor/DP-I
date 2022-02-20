pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CrowdfundingCampaign.sol";

contract TestCrowdfundingCampaign {
    address payable owner = DeployedAddresses.CrowdfundingCampaign();
    address payable address1 = tx.origin;

    function testInitialCrowdfundContract() public {

        uint pledgedGoal = 500;
        CrowdfundingCampaign campaign = new CrowdfundingCampaign("TestInit", pledgedGoal, owner);

        Assert.equal(campaign.goalValue(), pledgedGoal, "Minimum Contribution");
        Assert.equal(campaign.totalValue(), 0, "Balance value");
    }

    function testContributeCrowdfundContract() public {
        uint expectedValue = 20;
        CrowdfundingCampaign campaign = new CrowdfundingCampaign("TestContribute", 500, owner);

        //uint balanceBefore = campaign.ownerAddress().balance;

        bool success = campaign.contribute.value(expectedValue)("TestContribution", address1);
        Assert.equal(success, true, "");
//        bool success2;
//        string memory testString;
//        (success2, testString) = campaign.contribute3(expectedValue, address1, "TestContribution");
//        Assert.equal(testString, "", "");
        //uint balanceAfter = campaign.ownerAddress().balance;

        //Assert.equal(campaign.totalValue(), expectedValue, "Balance value");
        // Assert.equal(campaign.contributions(0), expectedValue, "");

        //Assert.equal(balanceBefore, balanceAfter + expectedValue, "");
    }

}
