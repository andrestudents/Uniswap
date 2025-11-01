import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits, type Address } from 'viem';
import { SIMPLE_SWAP_ADDRESS } from '@/constants/contracts';
import SimpleSwapABI from '@/abis/SimpleSwap.json';
import TestTokenABI from '@/abis/TestToken.json';
import { SwapStep } from '@/utils/swap/types';

interface UseSwapProps {
    fromTokenAddress: Address;
    isAtoB: boolean;
    userAddress?: Address;
}

export function useSwap({ fromTokenAddress, isAtoB, userAddress }: UseSwapProps) {
    const [amountIn, setAmountIn] = useState('');
    const [amountOut, setAmountOut] = useState('0');
    const [step, setStep] = useState<SwapStep>('idle');

    // Get amount out calculation
    const { data: calculatedAmountOut } = useReadContract({
        address: SIMPLE_SWAP_ADDRESS as Address,
        abi: SimpleSwapABI,
        functionName: 'getAmountOut',
        args: amountIn ? [parseUnits(amountIn, 18), isAtoB] : undefined,
        query: { enabled: !!amountIn && parseFloat(amountIn) > 0 },
    });

    // Get allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: fromTokenAddress,
        abi: TestTokenABI,
        functionName: 'allowance',
        args: [userAddress as Address, SIMPLE_SWAP_ADDRESS as Address],
        query: { enabled: !!userAddress },
    });

    // Approval
    const { writeContract: approve, data: approveHash } = useWriteContract();
    const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
        hash: approveHash,
    });

    // Swap
    const { writeContract: swap, data: swapHash } = useWriteContract();
    const { isLoading: isSwapLoading, isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({
        hash: swapHash,
    });

    // Update amount out when calculated
    useEffect(() => {
        if (calculatedAmountOut) {
            setAmountOut(formatUnits(calculatedAmountOut as bigint, 18));
        }
    }, [calculatedAmountOut]);

    // Reset after successful swap
    useEffect(() => {
        if (isSwapSuccess) {
            setAmountIn('');
            setAmountOut('0');
            setStep('idle');
            refetchAllowance();
        }
    }, [isSwapSuccess, refetchAllowance]);

    // Auto-swap after approval
    useEffect(() => {
        if (isApproveSuccess && step === 'approving') {
            setTimeout(() => {
                const functionName = isAtoB ? 'swapAforB' : 'swapBforA';
                swap({
                    address: SIMPLE_SWAP_ADDRESS as Address,
                    abi: SimpleSwapABI,
                    functionName,
                    args: [parseUnits(amountIn, 18)],
                });
                setStep('swapping');
            }, 1000);
        }
    }, [isApproveSuccess, step, amountIn, isAtoB, swap]);

    const handleSwap = () => {
        if (!amountIn || parseFloat(amountIn) <= 0) return;

        const amountInWei = parseUnits(amountIn, 18);
        const needsApproval = !allowance || amountInWei > (allowance as bigint);

        if (needsApproval) {
            setStep('approving');
            approve({
                address: fromTokenAddress,
                abi: TestTokenABI,
                functionName: 'approve',
                args: [SIMPLE_SWAP_ADDRESS as Address, amountInWei],
            });
        } else {
            setStep('swapping');
            const functionName = isAtoB ? 'swapAforB' : 'swapBforA';
            swap({
                address: SIMPLE_SWAP_ADDRESS as Address,
                abi: SimpleSwapABI,
                functionName,
                args: [amountInWei],
            });
        }
    };

    const isLoading = isApproveLoading || isSwapLoading;
    const buttonText =
        step === 'approving'
            ? 'Approving...'
            : step === 'swapping'
                ? 'Swapping...'
                : !amountIn || parseFloat(amountIn) <= 0
                    ? 'Enter Amount'
                    : 'Swap';

    return {
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
    };
}
