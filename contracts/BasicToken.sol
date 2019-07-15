pragma solidity ^0.4.24;

contract BasicToken {
    address public issuer;
    mapping (address => uint256) private _allocationTable;

    constructor() public {
        issuer = msg.sender;
        _allocationTable[msg.sender] = 100;
    }

    // 2
    function allocate(address recipient, uint256 amount) public returns (bool) {
        //require(msg.value > .0001 ether);
        _allocationTable[msg.sender] = _allocationTable[msg.sender] - amount;
        _allocationTable[recipient] = _allocationTable[recipient] + amount;
        return true;
    }

    // 1
    function balanceOf(address account) public view returns (uint256) {
        return _allocationTable[account];
    }

    // 3
    function mint(uint256 amount) public returns (bool) {
       // 4 require(msg.sender==issuer);
        _allocationTable[msg.sender] = _allocationTable[msg.sender] + amount;
        return true;
    }

    // 4
    function burn(uint256 amount) public returns (bool) {
        _allocationTable[msg.sender] = _allocationTable[msg.sender] - amount;
        return true;
    }

}