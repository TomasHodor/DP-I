pragma solidity >=0.4.21 <0.8.0;

contract CrowdfundingCampaign {

    string public campaignName;

    struct Contribution {
        uint value;
        address payable contributor;
        string description;
    }

    bool public campaignStatus = false;
    uint public totalValue;
    uint public goalValue;
    Contribution [] public contributions;
    address payable public ownerAddress;
    mapping(address => bool) contributors;
    mapping (address => uint256) public balances;

    constructor(string memory name, uint goal, address payable creator) public {
        campaignName = name ;
        goalValue = goal;
        ownerAddress = creator;
        totalValue = 0;
        campaignStatus = true;
    }

    function () external payable {
        contributeCampaign("");
    }

    event contributeMoney(address indexed _from,  address indexed _to, uint _value);
    event returnContribution(address indexed _from, address indexed _to, uint _value);
    event transferSuccess(bool success, address payable _to);
    event logContractBalance(uint balance);
    event logAddress(address add);

    function contribute(string memory description) public payable returns(bool) {
        Contribution memory newContribution = Contribution({
            description: description,
            value: msg.value,
            contributor: msg.sender
        });
        emit contributeMoney(msg.sender, ownerAddress, msg.value);
        bool success = ownerAddress.send(msg.value);
        if (success) {
            contributions.push(newContribution);
            contributors[msg.sender] = true;
            totalValue += msg.value;
        }
        return success;
    }

    function contributeCampaign(string memory description) public payable returns(bool) {
        Contribution memory newContribution = Contribution({
            description: description,
            value: msg.value,
            contributor: msg.sender
        });
        // address payable campaignPayableAddress = address(uint160(address(this)));
        // bool success = campaignPayableAddress.send(msg.value);

        balances[msg.sender] += msg.value;
        contributions.push(newContribution);
        contributors[msg.sender] = true;
        totalValue += msg.value;
        emit contributeMoney(msg.sender, address(this), msg.value);
        return true;
    }

    function withdrawContribution(uint index) public payable returns(bool) {
        Contribution memory contribution = contributions[index];

        address payable contributorAddress = contribution.contributor;

        bool success = contributorAddress.send(contribution.value);
        emit transferSuccess(success, contributorAddress);
        if (success) {
            emit returnContribution(address(this), contributorAddress, contribution.value);

            delete contributions[index];
            contributors[contribution.contributor] = false;
            totalValue -= contribution.value;
        }
        return success;
    }

    function cancelCampaign() public payable {
        campaignStatus = false;
        for (uint i = 0; i < contributions.length; i++) {
            Contribution storage contribution = contributions[i];
            emit returnContribution(address(this), contribution.contributor, contribution.value);
            bool success = contribution.contributor.send(contribution.value);
            require(success);
        }
    }

    function finishCampaign() payable external returns(bool) {
        uint contractBalance = address(this).balance;
        emit logContractBalance(contractBalance);
        emit logAddress(tx.origin);
        //require(msg.sender == address(this));

        if (address(this).balance > goalValue) {
            campaignStatus = false;
//            for (uint i = 0; i < contributions.length; i++) {
//                msg.sender = address(this);
//                Contribution storage contribution = contributions[i];
//                balances[contribution.contributor] -= contribution.value;
//                bool success = ownerAddress.send(contribution.value);
//                emit returnContribution(msg.sender, ownerAddress, contribution.value);
//            }
            bool success = ownerAddress.send(contractBalance);
            emit contributeMoney(msg.sender, ownerAddress, contractBalance);
            return success;
        }
        return false;
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
}