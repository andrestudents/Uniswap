// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, Ownable {
    // Faucet mappings
    mapping(address => uint256) public lastFaucetTime;
    uint256 public constant FAUCET_AMOUNT = 100 * 10 ** 18; // 100 tokens
    uint256 public constant FAUCET_COOLDOWN = 1 days; // 24 hours cooldown

    event FaucetClaimed(
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 initialSupply
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // Faucet function - anyone can claim tokens
    function faucet() external {
        require(
            block.timestamp >= lastFaucetTime[msg.sender] + FAUCET_COOLDOWN,
            "Faucet cooldown not met. Wait 24 hours between claims."
        );

        lastFaucetTime[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);

        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
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

    // Optional: Allow owner to mint more tokens if needed
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
