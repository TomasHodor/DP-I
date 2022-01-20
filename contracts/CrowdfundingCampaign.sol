pragma solidity >=0.4.21 <0.8.0;

contract CrowdfundingCampaign {
    
//    struct Withdrawal {
//        string description;
//        uint value;
//        address recipient;
//        bool complete;
//        uint approvalCount;
//        mapping(address => bool) approvals;
//    }
//    Withdrawal [] public withdrawals;

    string public name;

    struct Contribution {
        uint value;
        address contributor;
        string description;
    }

    Contribution [] public contributions;
    address payable public ownerAddress;
    mapping(address => bool) contributors;
    uint public minimumContribution;
    uint public totalValue;

    constructor(string memory campaignName, uint minimum, address payable creator) public {
        name = campaignName;
        ownerAddress = creator;
        minimumContribution = minimum;
        totalValue = 0;
    }

    event contributeMoney(address indexed _from, uint256 _value);
    
    function contribute(string memory description) public payable returns(bool) {
        require(msg.value >= minimumContribution);

        Contribution memory newContribution = Contribution({
            description: description,
            value: msg.value,
            contributor: msg.sender
        });
        contributions.push(newContribution);

        contributors[msg.sender] = true;
        totalValue += msg.value;
        bool success = ownerAddress.send(msg.value);
        return success;
    }

    function contribute2(uint money) public payable {
        require(money >= minimumContribution);

        contributions.push(Contribution({
            description: "",
            value: money,
            contributor: msg.sender
        }));

        contributors[msg.sender] = true;
        totalValue += money;
        emit contributeMoney(msg.sender, money);
        ownerAddress.transfer(msg.value);
    }

    function contribute3(uint money, address toAddress, string memory description) public payable returns(bool) {
        require(money >= minimumContribution);

        contributions.push(Contribution({
            description: description,
            value: money,
            contributor: toAddress
        }));

        contributors[toAddress] = true;
        totalValue += money;
        emit contributeMoney(toAddress, money);
        (bool success, ) =  ownerAddress.call.value(money)("");
        return success;
    }

    function retrieveContribution(uint index) public payable returns(bool) {
        Contribution memory contribution = contributions[index];
        (bool success, ) = contribution.contributor.call.value(contribution.value)("");

        delete contributions[index];
        contributors[contribution.contributor] = false;
        totalValue -= contribution.value;

        return success;
    }

    function getContribution(address addr) public view returns(bool) {
        return contributors[addr];
    }

    function getNumberOfContributions() public view returns(uint) {
        return contributions.length;
    }


    modifier onlyOwner() {
        require(msg.sender == ownerAddress);
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