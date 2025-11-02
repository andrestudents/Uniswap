'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi';
import { parseUnits, formatUnits, type Address } from 'viem';
import { SIMPLE_SWAP_ADDRESS } from '@/constants/contracts';
import { TOKENS } from '@/constants/tokens';
import SimpleSwapABI from '@/abis/SimpleSwap.json';
import TestTokenABI from '@/abis/TestToken.json';


export function SwapInterface() {
    const { address, isConnected } = useAccount();
    const [amountIn, setAmountIn] = useState('');
    const [isAtoB, setIsAtoB] = useState(true);
    const [amountOut, setAmountOut] = useState('0');
    const [step, setStep] = useState<'idle' | 'approving' | 'swapping'>('idle');

    const fromToken = isAtoB ? TOKENS.TOKEN_A : TOKENS.TOKEN_B;
    const toToken = isAtoB ? TOKENS.TOKEN_B : TOKENS.TOKEN_A;

    const { data: fromBalance } = useBalance({
        address: address,
        token: fromToken.address as Address,
    });

    const { data: reserves } = useReadContract({
        address: SIMPLE_SWAP_ADDRESS as Address,
        abi: SimpleSwapABI,
        functionName: 'getReserves',
    });

    const { data: calculatedAmountOut } = useReadContract({
        address: SIMPLE_SWAP_ADDRESS as Address,
        abi: SimpleSwapABI,
        functionName: 'getAmountOut',
        args: amountIn ? [parseUnits(amountIn, 18), isAtoB] : undefined,
        query: { enabled: !!amountIn && parseFloat(amountIn) > 0 },
    });

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: fromToken.address as Address,
        abi: TestTokenABI,
        functionName: 'allowance',
        args: [address as Address, SIMPLE_SWAP_ADDRESS as Address],
        query: { enabled: !!address },
    });

    const { writeContract: approve, data: approveHash } = useWriteContract();
    const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
        hash: approveHash,
    });

    const { writeContract: swap, data: swapHash } = useWriteContract();
    const { isLoading: isSwapLoading, isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({
        hash: swapHash,
    });

    useEffect(() => {
        if (calculatedAmountOut) {
            setAmountOut(formatUnits(calculatedAmountOut as bigint, 18));
        }
    }, [calculatedAmountOut]);

    useEffect(() => {
        if (isSwapSuccess) {
            setAmountIn('');
            setAmountOut('0');
            setStep('idle');
            refetchAllowance();
        }
    }, [isSwapSuccess, refetchAllowance]);

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
                address: fromToken.address as Address,
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

    const handleMax = () => {
        if (fromBalance?.formatted) {
            setAmountIn(fromBalance.formatted);
        }
    };

    // If not connected
    if (!isConnected) {
        return (
            <div className="w-full max-w-md mx-auto">
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 text-center">
                    <div className="text-6xl mb-4">🔗</div>
                    <p className="text-lg text-slate-300">Connect wallet to get started</p>
                </div>
            </div>
        );
    }

    const reserveAFormatted = reserves ? formatUnits((reserves as [bigint, bigint])[0], 18) : '0';
    const reserveBFormatted = reserves ? formatUnits((reserves as [bigint, bigint])[1], 18) : '0';

    const isLoading = isApproveLoading || isSwapLoading;
    const buttonText =
        step === 'approving'
            ? 'Approving...'
            : step === 'swapping'
                ? 'Swapping...'
                : !amountIn || parseFloat(amountIn) <= 0
                    ? 'Enter Amount'
                    : 'Swap';

    const rate = amountIn && amountOut && parseFloat(amountIn) > 0
        ? (parseFloat(amountOut) / parseFloat(amountIn)).toFixed(4)
        : '0';

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Main Swap Card */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-2xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
                        Exchange
                    </h2>
                    <p className="text-sm text-slate-400">Swap tokens instantly</p>
                </div>

                {/* From Token Section */}
                <div className="mb-4 relative group">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        From
                    </label>
                    <br />
                    <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/30 group-hover:border-blue-500/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                                    {fromToken.symbol.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{fromToken.symbol}</p>
                                    <p className="text-xs text-slate-400">{fromToken.name}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Balance</p>
                                <p className="text-sm font-semibold text-white">
                                    {parseFloat(fromBalance?.formatted || '0').toFixed(4)}
                                </p>
                            </div>
                        </div>
                        <br />
                        <input
                            type="number"
                            value={amountIn}
                            onChange={(e) => setAmountIn(e.target.value)}
                            placeholder="0.0"
                            className="w-full bg-transparent text-3xl text-white  text-center placeholder-slate-500 outline-none font-semibold"
                        />

                        {/* Max Balance Button */}
                        <button
                            onClick={handleMax}
                            className="absolute right-4 top-12 text-xs font-bold px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all duration-200"
                        >
                            MAX
                        </button>
                    </div>

                </div>
                <br />
                {/* Swap Direction Button */}
                <div className="flex justify-center -my-3 relative z-10 mb-4">
                    <button
                        onClick={() => setIsAtoB(!isAtoB)}
                        className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 hover:from-blue-600/40 hover:to-cyan-600/40 border border-slate-600/50 hover:border-blue-500/50 rounded-xl p-2.5 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-blue-500/20"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M7 10l5 5 5-5M7 16l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* To Token Section */}
                <div className="mb-6 relative group">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        To
                    </label>
                    <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/30 group-hover:border-teal-500/50 transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/30">
                                    {toToken.symbol.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{toToken.symbol}</p>
                                    <p className="text-xs text-slate-400">{toToken.name}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-3xl font-semibold text-white">
                            {parseFloat(amountOut).toFixed(6)}
                        </p>
                    </div>
                </div>

                {/* Exchange Rate */}
                {amountIn && parseFloat(amountIn) > 0 && (
                    <div className="mb-6 p-3 bg-slate-700/20 rounded-lg border border-slate-600/30">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Rate</span>
                            <span className="text-white font-medium">1 {fromToken.symbol} = {rate} {toToken.symbol}</span>
                        </div>
                    </div>
                )}

                <br />
                <br />

                {/* Swap Button */}
                <button
                    onClick={handleSwap}
                    disabled={!amountIn || parseFloat(amountIn) <= 0 || isLoading}
                    className={`w-full py-4 rounded-lg font-semibold text-lg ${isLoading || !amountIn || parseFloat(amountIn) <= 0
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        {isLoading && (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {buttonText}
                    </div>
                </button>

                {/* Transaction Status */}
                {/* Pending */}
                {approveHash && (
                    <div className="mt-4 p-4 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-500/30 animate-pulse">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                            <span className="text-sm text-blue-300">Approval pending...</span>
                        </div>
                    </div>
                )}
                {/* Success */}
                {isApproveSuccess && step === 'approving' && (
                    <div className="mt-4 p-4 bg-green-500/10 backdrop-blur-sm rounded-xl border border-green-500/30">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">✓</span>
                            <span className="text-sm text-green-300">Approved! Swapping...</span>
                        </div>
                    </div>
                )}
                {/* Confirmed */}
                {swapHash && (
                    <div className="mt-4 p-4 bg-cyan-500/10 backdrop-blur-sm rounded-xl border border-cyan-500/30">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                            <span className="text-sm text-cyan-300">Swap confirmed!</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Spacer */}
            <br />
            <br />
            <br />

            {/* Pool Info Card */}
            <div className="mt-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-2xl p-6">
                {/* Header - Centered */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-300 text-center">
                        Pool Status
                    </h3>
                </div>

                {/* Pool Data */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Token A Reserve */}
                    <div className="text-center">
                        <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">
                            TKA Reserve
                        </p>
                        <p className="text-2xl font-bold text-white">
                            {parseFloat(reserveAFormatted).toLocaleString("en-US", {
                                maximumFractionDigits: 0,
                            })}
                        </p>
                    </div>

                    {/* Token B Reserve */}
                    <div className="text-center">
                        <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">
                            TKB Reserve
                        </p>
                        <p className="text-2xl font-bold text-white">
                            {parseFloat(reserveBFormatted).toLocaleString("en-US", {
                                maximumFractionDigits: 0,
                            })}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}