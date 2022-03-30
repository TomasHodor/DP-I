pragma solidity >=0.4.21 <0.8.0;

contract CrowdfundingCampaign {

    string public campaignName;

    struct Contribution {
        uint256 value;
        string description;
    }

    string public campaignStatus = "nonactive";
    uint256 public totalValue;
    uint256 [] public goalValues;
    bool [] public campaignCaps;
    address [] public contributors;
    mapping (address => bool) public addressMapping;
    mapping (address => Contribution[]) public contributions;
    mapping (address => Contribution[]) public paidContributions;
    address payable public ownerAddress;

    constructor(string memory name, uint256[] memory goals, address payable creator) public {
        campaignName = name;
        goalValues = goals;
        ownerAddress = creator;
        totalValue = 0;
        campaignStatus = "active";
        for (uint i = 0; i < goalValues.length; i++) {
            campaignCaps.push(false);
        }
    }

    function () external payable {
        contributeCampaign("");
    }

    event logContributeMoney(address indexed _from,  address indexed _to, uint256 _value, uint256 sender_balance);
    event logReturnContribution(address indexed _from, address indexed _to, uint256 _value);
    event logWithdrawalTransferSuccess(bool success, address payable _to);
    event logContractBalance(uint256 balance);
    event logAddress(address add);
    event logContributionslength(uint length);
    event logContributionValue(uint value);

    function contributeCampaign(string memory description) public payable returns(bool) {
        if (keccak256(bytes(campaignStatus)) == keccak256(bytes("active"))) {
            Contribution memory newContribution = Contribution({
                description: description,
                value: msg.value
            });
            emit logContributionslength(contributions[msg.sender].length);
            contributions[msg.sender].push(newContribution);
            if (!addressMapping[msg.sender]) {
                addressMapping[msg.sender] = true;
                contributors.push(msg.sender);
            }
            totalValue += msg.value;
            emit logContributeMoney(msg.sender, address(this), msg.value, msg.sender.balance);
            return true;
        } else {
            msg.sender.transfer(msg.value);
        }
        return false;
    }

    function cancelCampaign() public {
        campaignStatus = "canceled";
        for (uint i = 0; i < contributors.length; i++) {
            emit logContractBalance(address(this).balance);

            for (uint j = 0; j < contributions[contributors[i]].length; j++) {
                Contribution storage contribution = contributions[contributors[i]][j];
                address payable contributorWallet = address(uint160(contributors[i]));
                bool success = contributorWallet.send(contribution.value);
                emit logReturnContribution(address(this), contributors[i], contribution.value);
                require(success);
            }
        }
    }

    function transferCapital() public payable returns(bool) {
        uint256 contractBalance = address(this).balance;
        emit logContractBalance(contractBalance);
        if (keccak256(bytes(campaignStatus)) == keccak256(bytes("active"))) {
            for (uint i = 0; i < goalValues.length; i++) {
                emit logContractBalance(i);
                if (!campaignCaps[i] && totalValue >= goalValues[i]) {
                    emit logContractBalance(contractBalance);
                    bool success = msg.sender.send(contractBalance);
                    if (success) {
                        campaignCaps[i] = true;
                        emit logContributeMoney(address(this), msg.sender, contractBalance, address(this).balance);
                        if (i + 1 == campaignCaps.length || totalValue >= goalValues[goalValues.length - 1]) {
                            campaignStatus = "finished";
                        }
                        for (uint j = 0; j < contributors.length; j++) {
                            emit logAddress(contributors[j]);
                            uint maxIndex = contributions[contributors[j]].length;
                            for (uint k = 0; k < maxIndex; k++) {
                                Contribution memory contribution = contributions[contributors[j]][maxIndex - k - 1];
                                emit logContributionValue(contribution.value);
                                paidContributions[contributors[j]].push(contribution);

                                delete contributions[contributors[j]][maxIndex - k - 1];
                                contributions[contributors[j]].length--;
                            }
                        }
                        return success;
                    }
                } else {
                    continue;
                }
            }
        }
        return false;
    }

    function withdrawContribution(uint index) public payable returns(bool) {
        Contribution[] memory contributionsArray = contributions[msg.sender];
        if (contributionsArray.length > 0 && contributionsArray.length > index) {
            Contribution memory contribution = contributionsArray[index];

            bool success = msg.sender.send(contribution.value);
            emit logWithdrawalTransferSuccess(success, msg.sender);
            if (success) {
                emit logReturnContribution(address(this), msg.sender, contribution.value);

                uint contributionLength = contributions[msg.sender].length;
                for (uint i = index; i < contributionLength - 1; i++){
                    contributions[msg.sender][i] = contributions[msg.sender][i + 1];
                }
                delete contributions[msg.sender][contributionLength - 1];
                contributions[msg.sender].length--;
                totalValue -= contribution.value;
            }
            return success;
        }
        return false;
    }


    function getNumberOfAddressContribution(address contributorAddress) public view returns(uint) {
        return contributions[contributorAddress].length;
    }

    function getNumberOfContributors() public view returns(uint) {
        return contributors.length;
    }
}