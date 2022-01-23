pragma solidity >=0.4.21 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Token Prototype WIP
contract HodorToken is ERC20{
    // Name
    string public name = "HodorToken";
    // Symbol
    string public symbol = 'HTK';

    mapping(address => uint256) public balances;

    event Transfer(address indexed from, address indexed to, uint256 _value);

    constructor() public{

    }

    function transfer(address from, address to, uint256 value) public returns (bool success) {
        require(value <= balances[from]);

        balances[from] -= value;
        balances[to] += value;
        emit Transfer(from, to, value);

        return true;
    }
}
