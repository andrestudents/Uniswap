'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { parseUnits, formatUnits, type Address } from 'viem';
import { SIMPLE_SWAP_ADDRESS, TOKENS } from '@/constants/contracts';
import SimpleSwapABI from '@/abis/SimpleSwap.json';
import TestTokenABI from '@/abis/TestToken.json';

export function SwapInterface() {
    const { address, isConnected } = useAccount();
    const [amountIn, setAmountIn] = useState('');
    const [fromToken, setFromToken] = useState(TOKENS.TOKEN_A);
    const [toToken, setToToken] = useState(TOKENS.TOKEN_B);
    const [amountOut, setAmountOut] = useState('0');
    const [actionState, setActionState] = useState<'idle' | 'approving' | 'swapping'>('idle');
    const swapTriggered = useRef(false);

    const isAtoB = fromToken.address === TOKENS.TOKEN_A.address;

    // Get balances
    const { data: fromBalance, refetch: refetchFromBalance } = useBalance({
        address: address,
        token: fromToken.address as Address,
    });

    const { data: toBalance } = useBalance({
        address: address,
        token: toToken.address as Address,
    });

    // Read reserves
    const { data: reserves, error: reservesError } = useReadContract({
        address: SIMPLE_SWAP_ADDRESS as Address,
        abi: SimpleSwapABI,
        functionName: 'getReserves',
    });

    // Calculate output amount
    const { data: calculatedAmountOut, error: amountOutError } = useReadContract({
        address: SIMPLE_SWAP_ADDRESS as Address,
        abi: SimpleSwapABI,
        functionName: 'getAmountOut',
        args: amountIn ? [parseUnits(amountIn, 18), isAtoB] : undefined,
        query: { enabled: !!amountIn && parseFloat(amountIn) > 0 },
    });

    useEffect(() => {
        if (calculatedAmountOut) {
            setAmountOut(formatUnits(calculatedAmountOut as bigint, 18));
        } else {
            setAmountOut('0');
        }
    }, [calculatedAmountOut]);

    // Check allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: fromToken.address as Address,
        abi: TestTokenABI,
        functionName: 'allowance',
        args: [address as Address, SIMPLE_SWAP_ADDRESS as Address],
        query: { enabled: !!address },
    });

    // Write functions  
    const { writeContract: writeApprove, data: approveData, isPending: isApprovePending, error: approveError } = useWriteContract();
    const { writeContract: writeSwap, data: swapData, isPending: isSwapPending, error: swapError } = useWriteContract();

    const { isPending: isApproveTransactionPending, isSuccess: isApproveSuccess } =
        useWaitForTransactionReceipt({ hash: approveData });

    const { isPending: isSwapTransactionPending, isSuccess: isSwapSuccess } =
        useWaitForTransactionReceipt({ hash: swapData });

    // Calculate if approval is needed
    const needsApproval = useMemo(() => {
        if (!address || !amountIn || !allowance) return false;
        try {
            return parseUnits(amountIn, 18) > (allowance as bigint);
        } catch (error) {
            console.error('Error checking allowance:', error);
            return false;
        }
    }, [address, amountIn, allowance]);

    // Combined swap handler that handles both approval and swap
    const handleSwap = async () => {
        if (!address || !amountIn || parseFloat(amountIn) <= 0) return;
        if (isApprovePending || isApproveTransactionPending || isSwapPending || isSwapTransactionPending) return;

        try {
            const amountInWei = parseUnits(amountIn, 18);

            // Check if we're already in a valid state
            if (actionState !== 'idle') {
                console.log('Transaction in progress, please wait...');
                return;
            }

            if (needsApproval) {
                setActionState('approving');
                writeApprove({
                    address: fromToken.address as Address,
                    abi: TestTokenABI,
                    functionName: 'approve',
                    args: [SIMPLE_SWAP_ADDRESS as Address, amountInWei],
                });
            } else {
                setActionState('swapping');
                const functionName = isAtoB ? 'swapAforB' : 'swapBforA';
                writeSwap({
                    address: SIMPLE_SWAP_ADDRESS as Address,
                    abi: SimpleSwapABI,
                    functionName,
                    args: [amountInWei],
                });
            }
        } catch (error) {
            console.error('Swap initiation failed:', error);
            setActionState('idle');
            swapTriggered.current = false;
        }
    };

    // Auto-refetch allowance after approval
    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance();
        }
    }, [isApproveSuccess, refetchAllowance]);

    // Auto-trigger swap after approval succeeds
    useEffect(() => {
        let mounted = true;
        let timeoutId: NodeJS.Timeout;

        const handleSwapAfterApproval = async () => {
            if (!mounted) return;

            const shouldProceedWithSwap =
                isApproveSuccess &&
                actionState === 'approving' &&
                !isSwapPending &&
                amountIn &&
                parseFloat(amountIn) > 0 &&
                !swapTriggered.current;

            if (!shouldProceedWithSwap) return;

            try {
                swapTriggered.current = true;

                // Wait for blockchain to update
                await new Promise(resolve => setTimeout(resolve, 2000));
                if (!mounted) return;

                // Verify we're still in a valid state
                const newAllowance = await refetchAllowance();
                if (!mounted) return;

                if (!newAllowance?.data) {
                    throw new Error('Failed to verify allowance');
                }

                const amountInWei = parseUnits(amountIn, 18);
                const functionName = isAtoB ? 'swapAforB' : 'swapBforA';
                setActionState('swapping');

                writeSwap({
                    address: SIMPLE_SWAP_ADDRESS as Address,
                    abi: SimpleSwapABI,
                    functionName,
                    args: [amountInWei],
                });
            } catch (error) {
                if (!mounted) return;
                console.error('Swap after approval failed:', error);
                setActionState('idle');
                swapTriggered.current = false;
            }
        };

        handleSwapAfterApproval();

        return () => {
            mounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isApproveSuccess, actionState, isSwapPending, amountIn, isAtoB, writeSwap, refetchAllowance]);

    // Reset form on successful swap or when transaction fails
    useEffect(() => {
        const resetForm = async () => {
            setAmountIn('');
            setAmountOut('0');
            setActionState('idle');
            swapTriggered.current = false;

            // Wait a moment before refetching to ensure blockchain state is updated
            await new Promise(resolve => setTimeout(resolve, 1000));

            try {
                await Promise.all([
                    refetchFromBalance(),
                    refetchAllowance()
                ]);
            } catch (error) {
                console.error('Error refreshing balances:', error);
            }
        };

        // Reset on successful swap
        if (isSwapSuccess) {
            resetForm();
        }

        // Reset on any error
        if (approveError || swapError) {
            resetForm();
            console.error('Transaction error:', approveError || swapError);
        }

        // Reset if we're idle but still showing a pending state
        if (actionState !== 'idle' && !isApprovePending && !isSwapPending && !isApproveTransactionPending && !isSwapTransactionPending) {
            resetForm();
        }
    }, [
        isSwapSuccess,
        approveError,
        swapError,
        refetchFromBalance,
        refetchAllowance,
        actionState,
        isApprovePending,
        isSwapPending,
        isApproveTransactionPending,
        isSwapTransactionPending
    ]);

    // Swap token directions
    const handleSwapDirections = () => {
        const newFrom = toToken;
        const newTo = fromToken;
        setFromToken(newFrom);
        setToToken(newTo);
        setAmountIn('');
        setAmountOut('0');
    };

    const handleMax = () => {
        if (fromBalance?.formatted) {
            setAmountIn(fromBalance.formatted);
        }
    };

    // Calculate exchange rate
    const exchangeRate = amountIn && amountOut && parseFloat(amountOut) > 0 && parseFloat(amountIn) > 0
        ? (parseFloat(amountOut) / parseFloat(amountIn)).toFixed(6)
        : '0';

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <div className="text-5xl mb-4">💼</div>
                    <p className="text-xl text-gray-400">Please connect your wallet to start swapping</p>
                </div>
            </div>
        );
    }

    const reserveAFormatted = reserves ? formatUnits((reserves as [bigint, bigint])[0], 18) : '0';
    const reserveBFormatted = reserves ? formatUnits((reserves as [bigint, bigint])[1], 18) : '0';

    return (
        <div className="w-full max-w-2xl ">
            {/* Swap Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-6 border border-gray-700">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Swap</h2>
                    <p className="text-gray-400 text-sm">Trade tokens in an instant</p>
                </div>

                {/* Error Display */}
                {(reservesError || amountOutError) && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-sm text-red-400">
                            Network Error: {reservesError?.message || amountOutError?.message || 'Failed to fetch data'}
                        </p>
                    </div>
                )}

                {/* From Token */}
                <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-4 mb-4 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200 shadow-lg hover:shadow-xl group">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs text-gray-400 uppercase tracking-wide font-medium">From</label>
                        <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-2 py-1 group-hover:bg-gray-800 transition-all">
                            <span className="text-xs text-gray-400">Balance:</span>
                            <span className="text-xs text-white font-medium">
                                {fromBalance?.formatted ? parseFloat(fromBalance.formatted).toFixed(4) : '0.0000'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 px-4 py-3 rounded-xl min-w-[150px] transition-all duration-200 group cursor-default">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 transform group-hover:scale-110">
                                {fromToken.symbol.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">{fromToken.symbol}</p>
                                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{fromToken.name}</p>
                            </div>
                        </div>
                        <div className="flex-1 relative group">
                            <input
                                type="number"
                                value={amountIn}
                                onChange={(e) => setAmountIn(e.target.value)}
                                placeholder="0.0"
                                step="any"
                                className="w-full bg-transparent text-2xl text-white placeholder-gray-500 outline-none text-right focus:ring-2 focus:ring-blue-500/20 rounded-lg p-2 transition-all"
                            />
                            <div className="absolute inset-y-0 right-0 hidden group-hover:flex items-center pr-2">
                                <button
                                    onClick={handleMax}
                                    className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    MAX
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Swap Direction Button */}
                <div className="flex justify-center -my-2 relative z-10">
                    <button
                        onClick={handleSwapDirections}
                        className="bg-gray-800 hover:bg-gray-700 border-2 border-gray-700/50 hover:border-blue-500/50 rounded-xl p-2.5 transition-all duration-200 transform hover:scale-110 hover:rotate-180 shadow-lg hover:shadow-blue-500/20"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/90">
                            <path d="M7 13l5-5l5 5M7 17l5-5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* To Token */}
                <div className="bg-gray-900 rounded-2xl p-4 mb-6 border border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs text-gray-400 uppercase tracking-wide">To</label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Balance:</span>
                            <span className="text-xs text-white font-medium">
                                {toBalance?.formatted ? parseFloat(toBalance.formatted).toFixed(4) : '0.0000'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-800 px-4 py-3 rounded-xl min-w-[150px]">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
                                {toToken.symbol.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{toToken.symbol}</p>
                                <p className="text-xs text-gray-400">{toToken.name}</p>
                            </div>
                        </div>
                        <div className="flex-1 text-right">
                            <div className="text-2xl text-white">
                                {parseFloat(amountOut) > 0 ? parseFloat(amountOut).toFixed(6) : '0.00'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exchange Rate Info */}
                {/* {amountIn && parseFloat(amountIn) > 0 && (
                    <div className="mb-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Exchange Rate</span>
                            <span className="text-white font-medium">
                                1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}
                            </span>
                        </div>
                    </div>
                )} */}

                {/* Single Swap Button - handles both approval and swap automatically */}
                <button
                    onClick={handleSwap}
                    disabled={
                        !amountIn ||
                        parseFloat(amountIn) <= 0 ||
                        (isApprovePending || isApproveTransactionPending || isSwapPending || isSwapTransactionPending) ||
                        Boolean(fromBalance?.value && parseUnits(amountIn, 18) > fromBalance.value)
                    }
                    className={`
                        w-full py-4 relative overflow-hidden
                        bg-gradient-to-r from-blue-600 to-purple-600 
                        hover:from-blue-500 hover:to-purple-500
                        disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed
                        rounded-xl font-semibold text-white 
                        transition-all duration-300 transform hover:scale-[1.02]
                        shadow-lg hover:shadow-xl hover:shadow-purple-500/20
                        ${(isApprovePending || isApproveTransactionPending || isSwapPending || isSwapTransactionPending) ? 'animate-pulse' : ''}
                    `}
                >
                    {(isApprovePending || isApproveTransactionPending) ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Approving...
                        </span>
                    ) : (isSwapPending || isSwapTransactionPending) ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Swapping...
                        </span>
                    ) : parseFloat(amountIn) > parseFloat(fromBalance?.formatted || '0') ? (
                        'Insufficient Balance'
                    ) : !amountIn || parseFloat(amountIn) <= 0 ? (
                        'Enter Amount'
                    ) : needsApproval ? (
                        'Approve & Swap'
                    ) : (
                        'Swap'
                    )}
                </button>

                {/* Transaction Status */}
                {/* {approveData && isApproveTransactionPending && (
                    <div className="mt-4 p-4 bg-blue-500/5 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-lg animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-500/20 p-2">
                                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-400">
                                    Approval in progress
                                </p>
                                <a
                                    href={`https://sepolia.basescan.org/tx/${approveData}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-300 hover:text-blue-200 transition-colors mt-1 flex items-center gap-1"
                                >
                                    View on BaseScan
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                )} */}

                {/* {approveData && isApproveSuccess && !isSwapSuccess && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        <p className="text-sm text-yellow-400">
                            ✓ Approval successful! Proceeding to swap...
                        </p>
                    </div>
                )} */}

                {/* {swapData && isSwapTransactionPending && (
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <p className="text-sm text-blue-400">
                            ⏳ Swap pending:
                            <a
                                href={`https://sepolia.basescan.org/tx/${swapData}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 underline hover:text-blue-300"
                            >
                                View on BaseScan
                            </a>
                        </p>
                    </div>
                )} */}

                {/* {swapData && isSwapSuccess && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <p className="text-sm text-green-400">
                            ✓ Swap successful!
                            <a
                                href={`https://sepolia.basescan.org/tx/${swapData}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 underline hover:text-green-300"
                            >
                                View on BaseScan
                            </a>
                        </p>
                    </div>
                )} */}

                {/* {(approveError || swapError) && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-sm text-red-400">
                            Error: {(approveError || swapError)?.message}
                        </p>
                    </div>
                )} */}

            </div>
            <br />

            {/* Reserves Info */}
            <div className="mt-6 bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl p-6 border border-gray-700/40 shadow-lg backdrop-blur-sm transition-all hover:border-gray-600/60">
                <h3 className="text-base font-semibold text-gray-100 mb-6 tracking-wide text-center flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Pool Reserves
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                </h3>

                <div className="grid grid-cols-2 gap-6">
                    {/* Token A */}
                    <div className="space-y-1.5 text-center">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            {TOKENS.TOKEN_A.symbol}
                        </p>
                        <p className="text-2xl font-semibold text-white">
                            {parseFloat(reserveAFormatted).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Token B */}
                    <div className="space-y-1.5 text-center">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            {TOKENS.TOKEN_B.symbol}
                        </p>
                        <p className="text-2xl font-semibold text-white">
                            {parseFloat(reserveBFormatted).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>


        </div>
    );
}
