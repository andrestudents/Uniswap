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

        // Deploy Token B
        TestToken tokenB = new TestToken("Token B", "TKB", 1000000);

        // Deploy SimpleSwap
        SimpleSwap simpleSwap = new SimpleSwap(
            address(tokenA),
            address(tokenB)
        );

        // Approve and add initial liquidity
        tokenA.approve(address(simpleSwap), 100000 * 10 ** 18);
        tokenB.approve(address(simpleSwap), 100000 * 10 ** 18);
        simpleSwap.addLiquidity(100000 * 10 ** 18, 100000 * 10 ** 18);

        vm.stopBroadcast();

        // Log addresses
        console2.log("Token A:", address(tokenA));
        console2.log("Token B:", address(tokenB));
        console2.log("SimpleSwap:", address(simpleSwap));
    }
}
