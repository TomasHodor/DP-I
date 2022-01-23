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

    string public campaignName;

    struct Contribution {
        uint value;
        address payable contributor;
        string description;
    }

    bool public status = false;
    uint public totalValue;
    uint public goalValue;
    Contribution [] public contributions;
    address payable public ownerAddress;
    mapping(address => bool) contributors;

    constructor(string memory name, uint goal, address payable creator) public {
        campaignName = name ;
        goalValue = goal;
        ownerAddress = creator;
        totalValue = 0;
        status = true;
    }

    event contributeMoney(address indexed _from, uint _value);
    event returnContribution(address indexed _from, uint _value);

    function cancelCampaign() public {
        status = false;
        for (uint i = 0; i < contributions.length; i++) {
            Contribution storage contribution = contributions[i];
            emit returnContribution(ownerAddress, contribution.value);
            bool success = contribution.contributor.send(contribution.value);
            require(success);
        }
    }

    function contribute(string memory description) public payable returns(bool) {
        Contribution memory newContribution = Contribution({
            description: description,
            value: msg.value,
            contributor: msg.sender
        });
        emit contributeMoney(msg.sender, msg.value);
        bool success = ownerAddress.send(msg.value);
        if (success) {
            contributions.push(newContribution);
            contributors[msg.sender] = true;
            totalValue += msg.value;
        }
        return success;
    }

    function contribute2(string memory description, address payable fromAddress) public payable returns(bool) {
        contributions.push(Contribution({
            description: description,
            value: msg.value,
            contributor: fromAddress
        }));

        contributors[fromAddress] = true;
        totalValue += msg.value;
        emit contributeMoney(fromAddress, msg.value);
        ownerAddress.transfer(msg.value);
        bool success = ownerAddress.send(msg.value);
        return success;
    }

    function contribute3(
        uint256 contribValue,
        address payable fromAddress,
        string memory description
    ) public payable returns(bool, string memory) {
        Contribution memory newContribution = Contribution({
            description: description,
            value: contribValue,
            contributor: fromAddress
        });
        contributions.push(newContribution);

        contributors[fromAddress] = true;
        totalValue += contribValue;
        emit contributeMoney(fromAddress, contribValue);
        (bool success, bytes memory data) =  ownerAddress.call.value(contribValue)("");
        //require(success, "Failed to send Ether");
        return (success, string(data));
    }

    function retrieveContribution(uint index) public payable returns(bool) {
        Contribution memory contribution = contributions[index];

        delete contributions[index];
        contributors[contribution.contributor] = false;
        totalValue -= contribution.value;
        address payable contributorAddress = contribution.contributor;

        emit contributeMoney(ownerAddress, contribution.value);
        bool success = contributorAddress.send(contribution.value);
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