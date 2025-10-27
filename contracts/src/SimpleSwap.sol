// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract SimpleSwap {
    IERC20 public tokenA;
    IERC20 public tokenB;
    
    uint256 public reserveA;
    uint256 public reserveB;
    
    event Swap(address indexed user, uint256 amountIn, uint256 amountOut, bool isAtoB);
    event LiquidityAdded(address indexed user, uint256 amountA, uint256 amountB);

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    // Add initial liquidity
    function addLiquidity(uint256 amountA, uint256 amountB) external {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        
        reserveA += amountA;
        reserveB += amountB;
        
        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    // Swap Token A for Token B
    function swapAforB(uint256 amountIn) external returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be > 0");
        
        // x * y = k formula
        // (x + amountIn) * (y - amountOut) = x * y
        // amountOut = (amountIn * y) / (x + amountIn)
        
        amountOut = (amountIn * reserveB) / (reserveA + amountIn);
        require(amountOut > 0, "Insufficient liquidity");
        
        tokenA.transferFrom(msg.sender, address(this), amountIn);
        tokenB.transfer(msg.sender, amountOut);
        
        reserveA += amountIn;
        reserveB -= amountOut;
        
        emit Swap(msg.sender, amountIn, amountOut, true);
    }

    // Swap Token B for Token A
    function swapBforA(uint256 amountIn) external returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be > 0");
        
        amountOut = (amountIn * reserveA) / (reserveB + amountIn);
        require(amountOut > 0, "Insufficient liquidity");
        
        tokenB.transferFrom(msg.sender, address(this), amountIn);
        tokenA.transfer(msg.sender, amountOut);
        
        reserveB += amountIn;
        reserveA -= amountOut;
        
        emit Swap(msg.sender, amountIn, amountOut, false);
    }

    // Get output amount for Token A to B
    function getAmountOut(uint256 amountIn, bool isAtoB) external view returns (uint256) {
        if (isAtoB) {
            return (amountIn * reserveB) / (reserveA + amountIn);
        } else {
            return (amountIn * reserveA) / (reserveB + amountIn);
        }
    }

    // Get current reserves
    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }
}