'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { type Address } from 'viem';
import { TOKENS } from '@/constants/contracts';
import { ConnectWalletPrompt } from './organisms/ConnectWalletPrompt';
import { SwapCard } from './organisms/SwapCard';
import { PoolInfoCard } from './organisms/PoolInfoCard';
import { useSwap } from '@/hooks/swap/useSwap';
import { useTokenBalance } from '@/hooks/swap/useTokenBalance';
import { usePoolReserves } from '@/hooks/swap/usePoolReserves';
import { calculateExchangeRate } from '@/utils/swap/calculations';

export function SwapInterface() {
    const { address, isConnected } = useAccount();
    const [isAtoB, setIsAtoB] = useState(true);

    const fromToken = isAtoB ? TOKENS.TOKEN_A : TOKENS.TOKEN_B;
    const toToken = isAtoB ? TOKENS.TOKEN_B : TOKENS.TOKEN_A;

    // Custom hooks
    const { balance: fromBalance } = useTokenBalance(address, fromToken.address as Address);
    const { reserveA, reserveB } = usePoolReserves();
    const {
        amountIn,
        amountOut,
        step,
        setAmountIn,
        handleSwap,
        isLoading,
        buttonText,
        approveHash,
        swapHash,
        isApproveSuccess,
    } = useSwap({
        fromTokenAddress: fromToken.address as Address,
        isAtoB,
        userAddress: address,
    });

    // Handlers
    const handleMax = () => {
        if (fromBalance) {
            setAmountIn(fromBalance);
        }
    };

    const handleDirectionSwap = () => {
        setIsAtoB(!isAtoB);
    };

    // Calculate rate
    const rate = calculateExchangeRate(amountIn, amountOut);

    // If not connected
    if (!isConnected) {
        return <ConnectWalletPrompt />;
    }

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Main Swap Card */}
            <SwapCard
                fromToken={fromToken}
                toToken={toToken}
                amountIn={amountIn}
                amountOut={amountOut}
                onAmountInChange={setAmountIn}
                fromBalance={fromBalance}
                onDirectionSwap={handleDirectionSwap}
                onMaxClick={handleMax}
                onSwap={handleSwap}
                step={step}
                isLoading={isLoading}
                buttonText={buttonText}
                rate={rate}
                approveHash={approveHash}
                swapHash={swapHash}
                isApproveSuccess={isApproveSuccess}
            />

            {/* Bottom Spacer */}
            <br />
            <br />
            <br />

            {/* Pool Info Card */}
            <PoolInfoCard reserveA={reserveA} reserveB={reserveB} />
        </div>
    );
}
