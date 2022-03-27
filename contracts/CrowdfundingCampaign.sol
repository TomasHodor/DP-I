pragma solidity >=0.4.21 <0.8.0;

contract CrowdfundingCampaign {

    string public campaignName;

    struct Contribution {
        uint256 value;
        address payable contributor;
        string description;
    }

    struct Contribution2 {
        uint256 value;
        uint index;
        string description;
    }

    string public campaignStatus = "nonactive";
    uint256 public totalValue;
    uint256 public goalValue;
    Contribution [] public contributions;
    mapping (address => Contribution2[]) public contributions2;
    address payable public ownerAddress;
    mapping (address => uint256) public balances;

    constructor(string memory name, uint256 goal, address payable creator) public {
        campaignName = name ;
        goalValue = goal;
        ownerAddress = creator;
        totalValue = 0;
        campaignStatus = "active";
    }

    function () external payable {
        contributeCampaign("");
    }

    event logContributeMoney(address indexed _from,  address indexed _to, uint256 _value);
    event logReturnContribution(address indexed _from, address indexed _to, uint256 _value);
    event logWithdrawalTransferSuccess(bool success, address payable _to);
    event logContractBalance(uint256 balance);
    event logAddress(address add);
    event logContributions2length(uint length);

    function contribute(string memory description) public payable returns(bool) {
        Contribution memory newContribution = Contribution({
            description: description,
            value: msg.value,
            contributor: msg.sender
        });
        emit logContributeMoney(msg.sender, ownerAddress, msg.value);
        bool success = ownerAddress.send(msg.value);
        if (success) {
            contributions.push(newContribution);
            totalValue += msg.value;
        }
        return success;
    }

    function contributeCampaign(string memory description) public payable returns(bool) {
        if (keccak256(bytes(campaignStatus)) == keccak256(bytes("active"))) {
            Contribution memory newContribution = Contribution({
                description: description,
                value: msg.value,
                contributor: msg.sender
            });
            contributions.push(newContribution);

            Contribution2 memory newContribution2 = Contribution2({
                index: contributions2[msg.sender].length,
                description: description,
                value: msg.value
            });
            emit logContributions2length(contributions2[msg.sender].length);
            contributions2[msg.sender].push(newContribution2);

            balances[msg.sender] += msg.value;
            totalValue += msg.value;
            emit logContributeMoney(msg.sender, address(this), msg.value);
            return true;
        } else {
            return false;
        }
    }

    function withdrawContribution(uint index) public payable returns(bool) {
        Contribution memory contribution = contributions[index];

        address payable contributorAddress = contribution.contributor;

        bool success = contributorAddress.send(contribution.value);
        emit logWithdrawalTransferSuccess(success, contributorAddress);
        if (success) {
            emit logReturnContribution(address(this), contributorAddress, contribution.value);

            delete contributions[index];
            totalValue -= contribution.value;
        }
        return success;
    }

    function withdrawContribution2(uint index) public payable returns(bool) {
        Contribution2[] memory contributions2array = contributions2[msg.sender];
        if (contributions2array.length > 0 && contributions2array.length > index) {
            Contribution2 memory contribution = contributions2array[index];

            bool success = msg.sender.send(contribution.value);
            emit logWithdrawalTransferSuccess(success, msg.sender);
            if (success) {
                emit logReturnContribution(address(this), msg.sender, contribution.value);

                for (uint i = index; i < contributions2[msg.sender].length - 1; i++){
                    contributions2[msg.sender][i] = contributions2[msg.sender][i + 1];
                }
                delete contributions2[msg.sender][contributions2[msg.sender].length - 1];
                contributions2[msg.sender].length--;
                totalValue -= contribution.value;
            }
            return success;
        }
        return false;
    }

    function cancelCampaign() public {
        campaignStatus = "canceled";
        for (uint i = 0; i < contributions.length; i++) {
            uint256 contractBalance = address(this).balance;
            emit logContractBalance(contractBalance);
            Contribution storage contribution = contributions[i];
            bool success = contribution.contributor.send(contribution.value);
            emit logReturnContribution(address(this), contribution.contributor, contribution.value);
            require(success);
        }
    }

    function finishCampaign() public returns(bool) {
        uint256 contractBalance = address(this).balance;
        emit logContractBalance(contractBalance);
        if (keccak256(bytes(campaignStatus)) == keccak256(bytes("active")) && address(this).balance >= goalValue) {
            bool success = msg.sender.send(totalValue);
            if (success) {
                campaignStatus = "finished";
                emit logContributeMoney(address(this), msg.sender, totalValue);
                contractBalance = address(this).balance;
                emit logContractBalance(contractBalance);
                return success;
            }
        }
        return false;
    }

    function getNumberOfContributions() public view returns(uint) {
        return contributions.length;
    }

    function getNumberOfAddressContribution(address contributorAddress) public view returns(uint) {
        return contributions2[contributorAddress].length;
    }

    function activateCampaign() public {
        if (keccak256(bytes(campaignStatus)) == keccak256(bytes("canceled"))) {
            campaignStatus = "active";
        }
    }
}