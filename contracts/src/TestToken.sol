// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestToken {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Faucet mappings
    mapping(address => uint256) public lastFaucetTime;
    uint256 public constant FAUCET_AMOUNT = 100 * 10 ** 18; // 100 tokens
    uint256 public constant FAUCET_COOLDOWN = 1 days; // 24 hours cooldown

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event FaucetClaimed(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    // Faucet function - anyone can claim tokens
    function faucet() external {
        require(
            block.timestamp >= lastFaucetTime[msg.sender] + FAUCET_COOLDOWN,
            "Faucet cooldown not met. Wait 24 hours between claims."
        );

        lastFaucetTime[msg.sender] = block.timestamp;
        balanceOf[msg.sender] += FAUCET_AMOUNT;
        totalSupply += FAUCET_AMOUNT;

        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
        emit Transfer(address(0), msg.sender, FAUCET_AMOUNT);
    }

    // Check when user can claim again
    function getNextFaucetTime(address user) external view returns (uint256) {
        if (lastFaucetTime[user] == 0) {
            return 0; // Can claim immediately
        }
        uint256 nextTime = lastFaucetTime[user] + FAUCET_COOLDOWN;
        if (block.timestamp >= nextTime) {
            return 0; // Can claim now
        }
        return nextTime - block.timestamp; // Seconds until next claim
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Allowance exceeded");

        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;

        emit Transfer(from, to, value);
        return true;
    }
}
