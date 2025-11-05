// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SimpleSwap is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable TOKEN_A;
    IERC20 public immutable TOKEN_B;

    uint256 public reserveA;
    uint256 public reserveB;

    event Swap(
        address indexed user,
        uint256 amountIn,
        uint256 amountOut,
        bool isAtoB
    );
    event LiquidityAdded(
        address indexed user,
        uint256 amountA,
        uint256 amountB
    );

    constructor(address _tokenA, address _tokenB) {
        require(_tokenA != address(0), "Invalid tokenA address");
        require(_tokenB != address(0), "Invalid tokenB address");
        require(_tokenA != _tokenB, "Tokens must be different");

        TOKEN_A = IERC20(_tokenA);
        TOKEN_B = IERC20(_tokenB);
    }

    // Add initial liquidity
    function addLiquidity(
        uint256 amountA,
        uint256 amountB
    ) external nonReentrant {
        require(amountA > 0, "Amount A must be > 0");
        require(amountB > 0, "Amount B must be > 0");

        TOKEN_A.safeTransferFrom(msg.sender, address(this), amountA);
        TOKEN_B.safeTransferFrom(msg.sender, address(this), amountB);

        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    // Swap Token A for Token B
    function swapAforB(
        uint256 amountIn
    ) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be > 0");

        // x * y = k formula
        // (x + amountIn) * (y - amountOut) = x * y
        // amountOut = (amountIn * y) / (x + amountIn)

        amountOut = (amountIn * reserveB) / (reserveA + amountIn);
        require(amountOut > 0, "Insufficient liquidity");
        require(amountOut <= reserveB, "Insufficient reserve B");

        TOKEN_A.safeTransferFrom(msg.sender, address(this), amountIn);
        TOKEN_B.safeTransfer(msg.sender, amountOut);

        reserveA += amountIn;
        reserveB -= amountOut;

        emit Swap(msg.sender, amountIn, amountOut, true);
    }

    // Swap Token B for Token A
    function swapBforA(
        uint256 amountIn
    ) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be > 0");

        amountOut = (amountIn * reserveA) / (reserveB + amountIn);
        require(amountOut > 0, "Insufficient liquidity");
        require(amountOut <= reserveA, "Insufficient reserve A");

        TOKEN_B.safeTransferFrom(msg.sender, address(this), amountIn);
        TOKEN_A.safeTransfer(msg.sender, amountOut);

        reserveB += amountIn;
        reserveA -= amountOut;

        emit Swap(msg.sender, amountIn, amountOut, false);
    }

    // Get output amount for Token A to B
    function getAmountOut(
        uint256 amountIn,
        bool isAtoB
    ) external view returns (uint256) {
        require(amountIn > 0, "Amount must be > 0");

        if (isAtoB) {
            require(reserveA + amountIn > 0, "Invalid calculation");
            return (amountIn * reserveB) / (reserveA + amountIn);
        } else {
            require(reserveB + amountIn > 0, "Invalid calculation");
            return (amountIn * reserveA) / (reserveB + amountIn);
        }
    }

    // Get current reserves
    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    // Getter functions for immutable variables (optional, for better access)
    function tokenA() external view returns (IERC20) {
        return TOKEN_A;
    }

    function tokenB() external view returns (IERC20) {
        return TOKEN_B;
    }
}
