pragma solidity ^0.4.25;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CrowdfundingCampaign.sol";

contract TestCrowdfundingCampaign {
    uint public initialBalance = 1 ether;
    address owner = DeployedAddresses.CrowdfundingCampaign();

    function testInitialCrowdfundContract() public {

        uint expectedMinimumContribution = 20;
        CrowdfundingCampaign campaign = new CrowdfundingCampaign(expectedMinimumContribution, owner);

        Assert.equal(campaign.getMinimumContribution(), expectedMinimumContribution, "Minimum Contribution");
        Assert.equal(campaign.getTotalValue(), 0, "Balance value");
    }

    function testContributeCrowdfundContract() public {
        CrowdfundingCampaign campaign = new CrowdfundingCampaign(20, owner);
        uint contributors = campaign.contribute.value(100)();
        uint expectedTotalValue = 100;

        Assert.equal(campaign.getTotalValue(), expectedTotalValue, "Balance value");
        Assert.equal(contributors, 1, "Number of contributors");
        Assert.equal(campaign.contributorsCount(), 1, "Number of contributors");
    }

    function testWithdrawal() public {
        CrowdfundingCampaign campaign = new CrowdfundingCampaign(20, owner);
        campaign.contribute.value(100)();
        campaign.contribute.value(150)();

        Assert.equal(campaign.getTotalValue(), 250, "Balance value");

        ThrowProxy throwproxy = new ThrowProxy(address(campaign));
        uint index = CrowdfundingCampaign(address(throwproxy)).createWithdrawal("must pay contractor", 50, DeployedAddresses.CrowdfundingCampaign());
        Assert.equal(index, 0, "Withdrawal index");

        //uint index = campaign.createWithdrawal("must pay contractor", 50, DeployedAddresses.CrowdfundingCampaign());

        //campaign.approveWithdrawal(index);
        //campaign.finalizeWithdrawal(index);

        //Assert.equal(campaign.getTotalValue(), 200, "Balance value");
    }
}

contract ThrowProxy {
    address public target;
    bytes data;

    constructor(address _target) public {
        target = _target;
    }

    //prime the data using the fallback function.
    function() {
        data = msg.data;
    }

    function execute() returns (bool) {
        return target.call(data);
    }
}
