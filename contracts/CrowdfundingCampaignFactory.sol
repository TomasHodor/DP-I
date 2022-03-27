pragma solidity >=0.4.21 <0.8.0;

import "./CrowdfundingCampaign.sol";

contract CrowdfundingCampaignFactory {

    address[] public deployedCampaigns;

    function createCampaign(string memory name, uint goal, address payable owner) public returns (address) {
        address newCampaign = address(new CrowdfundingCampaign(name, goal, owner));
        deployedCampaigns.push(newCampaign);

        return newCampaign;
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}