pragma solidity ^0.4.25;

contract CrowdfundingCampaignFactory {
    
    address[] public deployedCampaigns;
    
    function createCampain(uint minimum) public {
        address newCampain = new CrowdfundingCampaign(minimum, msg.sender);
        deployedCampaigns.push(newCampain);
    }
    
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract CrowdfundingCampaign {
    
//    struct Withdrawal {
//        string description;
//        uint value;
//        address recipient;
//        bool complete;
//        uint approvalCount;
//        mapping(address => bool) approvals;
//    }

    struct Contribution {
        uint value;
        address contributor;
    }
    
//    Withdrawal [] public withdrawals;
    address public owner;
    mapping(address => bool) contributors;
    uint public contributorsCount;
    uint public minimumContribution;
    uint public totalValue;

    constructor(uint minimum, address creator) public {
        owner = creator;
        minimumContribution = minimum;
        totalValue = 0;
        contributorsCount = 0;
    }

    event contributeMoney(address indexed _from, uint256 _value);
    
    function contribute() public payable returns(uint numberOfContributors) {
        require(msg.value >= minimumContribution);
        require(msg.sender.balance >= msg.value);
        contributors[msg.sender] = true;
        contributorsCount++;
        totalValue += msg.value;
        owner.transfer(msg.value);
        return this.contributorsCount();
    }

    function contribute2(uint money) public payable returns(uint numberOfContributors) {
        require(money >= minimumContribution);
        contributors[msg.sender] = true;
        contributorsCount++;
        totalValue += money;
        emit contributeMoney(msg.sender, money);
        owner.transfer(msg.value);
        return this.contributorsCount();
    }

    function contribute3(uint money, address toAddress) public payable returns(uint numberOfContributors) {
        require(money >= minimumContribution);
        contributors[toAddress] = true;
        contributorsCount++;
        totalValue += money;
        emit contributeMoney(toAddress, money);
        owner.transfer(money);
        return this.contributorsCount();
    }

    function getContribution(address addr) public view returns(bool) {
        return contributors[addr];
    }

    function getContributorsCount() public view returns(uint) {
        return this.contributorsCount();
    }

    function getMinimumContribution() public view returns(uint) {
        return this.minimumContribution();
    }

    function getTotalValue() public view returns(uint) {
        return this.totalValue();
    }

    function getOwnerAddress() public view returns(address ) {
        return this.owner();
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    modifier onlyContributor() {
        require(contributors[msg.sender]);
        _;
    }
    
//    function createWithdrawal (string description, uint value, address recipient) public onlyOwner returns(uint) {
//        Withdrawal memory newWithdraw = Withdrawal({
//            description: description,
//            value: value,
//            recipient: recipient,
//            complete: false,
//            approvalCount: 0
//        });
//        withdrawals.push(newWithdraw);
//        return withdrawals.length - 1;
//    }
//
//    function approveWithdrawal (uint index) public onlyContributor {
//        Withdrawal storage withdrawal = withdrawals[index];
//
//        require(!withdrawal.approvals[msg.sender]);
//
//        withdrawal.approvals[msg.sender] = true;
//        withdrawal.approvalCount++;
//    }
//
//    function finalizeWithdrawal (uint index) public onlyOwner {
//        Withdrawal storage withdrawal = withdrawals[index];
//
//        require(withdrawal.approvalCount > (contributorsCount / 2));
//        require(!withdrawal.complete);
//
//        withdrawal.recipient.transfer(withdrawal.value);
//        totalValue -= withdrawal.value;
//        withdrawal.complete = true;
//    }
}