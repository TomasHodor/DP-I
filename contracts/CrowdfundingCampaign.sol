pragma solidity >=0.4.21 <0.8.0;

contract CrowdfundingCampaign {

    string public campaignName;

    struct Contribution {
        uint256 value;
        string description;
    }

    string public campaignStatus = "nonactive";
    uint256 public totalValue;
    uint256 public goalValue;
    address [] public contributors;
    mapping (address => bool) public addressMapping;
    mapping (address => Contribution[]) public contributions;
    address payable public ownerAddress;

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

    function contributeCampaign(string memory description) public payable returns(bool) {
        if (keccak256(bytes(campaignStatus)) == keccak256(bytes("active"))) {
            Contribution memory newContribution = Contribution({
                description: description,
                value: msg.value
            });
            emit logContributions2length(contributions[msg.sender].length);
            contributions[msg.sender].push(newContribution);

            if (!addressMapping[msg.sender]) {
                addressMapping[msg.sender] = true;
                contributors.push(msg.sender);
            }

            totalValue += msg.value;
            emit logContributeMoney(msg.sender, address(this), msg.value);
            return true;
        } else {
            msg.sender.transfer(msg.value);
            return false;
        }
    }

    function withdrawContribution(uint index) public payable returns(bool) {
        if (addressMapping[msg.sender]) {
            Contribution[] memory contributionsArray = contributions[msg.sender];
            if (contributionsArray.length > 0 && contributionsArray.length > index) {
                Contribution memory contribution = contributionsArray[index];

                bool success = msg.sender.send(contribution.value);
                emit logWithdrawalTransferSuccess(success, msg.sender);
                if (success) {
                    emit logReturnContribution(address(this), msg.sender, contribution.value);
                    uint contributorsContributions = contributions[msg.sender].length - 1;
                    for (uint i = index; i < contributorsContributions; i++){
                        contributions[msg.sender][i] = contributions[msg.sender][i + 1];
                    }
                    delete contributions[msg.sender][contributorsContributions];
                    contributions[msg.sender].length--;
                    totalValue -= contribution.value;
                }
                return success;
            }
        }
        return false;
    }

    function cancelCampaign() public payable {
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

    function finishCampaign() public payable returns(bool) {
        uint256 contractBalance = address(this).balance;
        emit logContractBalance(contractBalance);
        if (keccak256(bytes(campaignStatus)) == keccak256(bytes("active")) && address(this).balance >= goalValue) {
            bool success = ownerAddress.send(totalValue);
            if (success) {
                campaignStatus = "finished";
                emit logContributeMoney(address(this), ownerAddress, totalValue);
                contractBalance = address(this).balance;
                emit logContractBalance(contractBalance);
                return success;
            }
        }
        return false;
    }

    function getNumberOfContributors() public view returns(uint) {
        return contributors.length;
    }

    function getNumberOfAddressContribution(address contributorAddress) public view returns(uint) {
        return contributions[contributorAddress].length;
    }

    modifier onlyCreator() {
        require(msg.sender == ownerAddress);
        _;
    }

    modifier onlyContributor() {
        require(addressMapping[msg.sender]);
        _;
    }
}