// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {TestToken} from "../src/TestToken.sol";
import {SimpleSwap} from "../src/SimpleSwap.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Token A
        TestToken tokenA = new TestToken("Token A", "TKA", 1000000);
        console2.log("Token A deployed at:", address(tokenA));

        // Deploy Token B
        TestToken tokenB = new TestToken("Token B", "TKB", 1000000);
        console2.log("Token B deployed at:", address(tokenB));

        // Deploy SimpleSwap
        SimpleSwap simpleSwap = new SimpleSwap(
            address(tokenA),
            address(tokenB)
        );
        console2.log("SimpleSwap deployed at:", address(simpleSwap));

        // Approve and add initial liquidity
        uint256 liquidityAmount = 100000 * 10 ** 18;

        tokenA.approve(address(simpleSwap), liquidityAmount);
        console2.log("Token A approved");

        tokenB.approve(address(simpleSwap), liquidityAmount);
        console2.log("Token B approved");

        simpleSwap.addLiquidity(liquidityAmount, liquidityAmount);
        console2.log("Initial liquidity added: 100,000 TKA and 100,000 TKB");

        vm.stopBroadcast();

        // Final summary
        console2.log("\n=== DEPLOYMENT SUMMARY ===");
        console2.log("Token A:", address(tokenA));
        console2.log("Token B:", address(tokenB));
        console2.log("SimpleSwap:", address(simpleSwap));
        console2.log("========================\n");
    }
}
