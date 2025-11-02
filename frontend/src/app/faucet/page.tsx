'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Sparkles, ArrowLeftRight, Droplet } from 'lucide-react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CONTRACTS, TOKEN_A_ABI, TOKEN_B_ABI } from '@/constants/contracts';

export default function FaucetPage() {
    const pathname = usePathname();
    const { address, isConnected } = useAccount();
    const [claimingTokenA, setClaimingTokenA] = useState(false);
    const [claimingTokenB, setClaimingTokenB] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },

        { name: 'Transaction', path: '/transaction', icon: ArrowLeftRight },
        { name: 'Faucet', path: '/faucet', icon: Droplet },
    ];

    // Token A faucet
    const { writeContract: claimTokenA, data: hashA, error: errorA, isPending: isPendingA } = useWriteContract();
    const { isLoading: isConfirmingA, isSuccess: isConfirmedA } = useWaitForTransactionReceipt({
        hash: hashA,
    });

    // Token B faucet
    const { writeContract: claimTokenB, data: hashB, error: errorB, isPending: isPendingB } = useWriteContract();
    const { isLoading: isConfirmingB, isSuccess: isConfirmedB } = useWaitForTransactionReceipt({
        hash: hashB,
    });

    // Read next faucet time for Token A
    const { data: nextFaucetTimeA, refetch: refetchA } = useReadContract({
        address: CONTRACTS.TOKEN_A,
        abi: TOKEN_A_ABI,
        functionName: 'getNextFaucetTime',
        args: address ? [address] : undefined,
    });

    // Read next faucet time for Token B
    const { data: nextFaucetTimeB, refetch: refetchB } = useReadContract({
        address: CONTRACTS.TOKEN_B,
        abi: TOKEN_B_ABI,
        functionName: 'getNextFaucetTime',
        args: address ? [address] : undefined,
    });

    // Refetch cooldowns after successful claims
    useEffect(() => {
        if (isConfirmedA) {
            refetchA();
            setClaimingTokenA(false);
        }
    }, [isConfirmedA, refetchA]);

    useEffect(() => {
        if (isConfirmedB) {
            refetchB();
            setClaimingTokenB(false);
        }
    }, [isConfirmedB, refetchB]);

    // Reset state if there's an error
    useEffect(() => {
        if (errorA) {
            console.error('Error claiming Token A:', errorA);
            setClaimingTokenA(false);
        }
    }, [errorA]);

    useEffect(() => {
        if (errorB) {
            console.error('Error claiming Token B:', errorB);
            setClaimingTokenB(false);
        }
    }, [errorB]);

    const handleClaimTokenA = () => {
        if (!isConnected) return;
        setClaimingTokenA(true);

        claimTokenA({
            address: CONTRACTS.TOKEN_A as `0x${string}`,
            abi: TOKEN_A_ABI,
            functionName: 'faucet',
        });
    };

    const handleClaimTokenB = () => {
        if (!isConnected) return;
        setClaimingTokenB(true);

        claimTokenB({
            address: CONTRACTS.TOKEN_B as `0x${string}`,
            abi: TOKEN_B_ABI,
            functionName: 'faucet',
        });
    };

    const formatCooldown = (seconds: unknown) => {
        if (!seconds || Number(seconds) === 0) return 'Available Now ✅';
        const num = Number(seconds);
        const hours = Math.floor(num / 3600);
        const minutes = Math.floor((num % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const canClaimA = !nextFaucetTimeA || Number(nextFaucetTimeA) === 0;
    const canClaimB = !nextFaucetTimeB || Number(nextFaucetTimeB) === 0;

    const isClaimingA = claimingTokenA || isPendingA || isConfirmingA;
    const isClaimingB = claimingTokenB || isPendingB || isConfirmingB;

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Navigation Bar */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
                <div className="relative backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>

                    <div className="relative flex items-center justify-between gap-2 p-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`
                                        relative flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all duration-300 group
                                        ${isActive
                                            ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-white shadow-lg scale-105'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5 hover:scale-105'
                                        }
                                    `}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
                                    )}

                                    <Icon
                                        className={`relative w-5 h-5 transition-all duration-300 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'
                                            }`}
                                    />
                                    <span className="relative text-sm whitespace-nowrap">{item.name}</span>

                                    {isActive && (
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <div className="flex items-center justify-center min-h-screen px-4 pt-32">
                <div className="relative z-10 w-full max-w-5xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-6xl font-bold mb-4">
                            Token <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">Faucet</span>
                        </h1>
                        <p className="text-gray-400 text-xl">Claim free testnet tokens to start trading</p>
                    </div>

                    {/* Connect Wallet Section */}
                    {!isConnected && (
                        <div className="mb-8 backdrop-blur-xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border border-yellow-500/30 rounded-3xl p-8 text-center">
                            <div className="text-5xl mb-4">⚠️</div>
                            <h3 className="text-2xl font-bold mb-2 text-yellow-200">Connect Your Wallet</h3>
                            <p className="text-gray-400 mb-6">Please connect your wallet to claim tokens</p>
                            <div className="flex justify-center">
                                <ConnectButton />
                            </div>
                        </div>
                    )}

                    {/* Faucet Cards */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Token A Faucet */}
                        <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-3xl font-bold">Token A</h2>
                                        <p className="text-gray-400">TKA</p>
                                    </div>
                                    <div className="text-5xl">🪙</div>
                                </div>

                                <div className="space-y-4">
                                    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-5 border border-white/10">
                                        <p className="text-sm text-gray-400 mb-1">Claim Amount</p>
                                        <p className="text-3xl font-bold text-blue-400">100 TKA</p>
                                    </div>

                                    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-5 border border-white/10">
                                        <p className="text-sm text-gray-400 mb-1">Cooldown Status</p>
                                        <p className="text-xl font-semibold">
                                            {formatCooldown(nextFaucetTimeA)}
                                        </p>
                                    </div>

                                    {errorA && (
                                        <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                                            <p className="text-red-400 text-sm">❌ Transaction failed. Please try again.</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleClaimTokenA}
                                        disabled={!isConnected || !canClaimA || isClaimingA}
                                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${!isConnected || !canClaimA || isClaimingA
                                            ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white hover:shadow-blue-500/50 hover:scale-105'
                                            }`}
                                    >
                                        {!isConnected
                                            ? '🔐 Connect Wallet'
                                            : isPendingA
                                                ? '⏳ Check Your Wallet...'
                                                : isConfirmingA
                                                    ? '⏳ Confirming...'
                                                    : isConfirmedA
                                                        ? '✅ Claimed Successfully!'
                                                        : !canClaimA
                                                            ? '⏱️ Cooldown Active'
                                                            : '💧 Claim Token A'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Token B Faucet */}
                        <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-3xl font-bold">Token B</h2>
                                        <p className="text-gray-400">TKB</p>
                                    </div>
                                    <div className="text-5xl">💎</div>
                                </div>

                                <div className="space-y-4">
                                    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-5 border border-white/10">
                                        <p className="text-sm text-gray-400 mb-1">Claim Amount</p>
                                        <p className="text-3xl font-bold text-purple-400">100 TKB</p>
                                    </div>

                                    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-5 border border-white/10">
                                        <p className="text-sm text-gray-400 mb-1">Cooldown Status</p>
                                        <p className="text-xl font-semibold">
                                            {formatCooldown(nextFaucetTimeB)}
                                        </p>
                                    </div>

                                    {errorB && (
                                        <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                                            <p className="text-red-400 text-sm">❌ Transaction failed. Please try again.</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleClaimTokenB}
                                        disabled={!isConnected || !canClaimB || isClaimingB}
                                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${!isConnected || !canClaimB || isClaimingB
                                            ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white hover:shadow-purple-500/50 hover:scale-105'
                                            }`}
                                    >
                                        {!isConnected
                                            ? '🔐 Connect Wallet'
                                            : isPendingB
                                                ? '⏳ Check Your Wallet...'
                                                : isConfirmingB
                                                    ? '⏳ Confirming...'
                                                    : isConfirmedB
                                                        ? '✅ Claimed Successfully!'
                                                        : !canClaimB
                                                            ? '⏱️ Cooldown Active'
                                                            : '💧 Claim Token B'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/20 rounded-3xl p-8">
                        <h3 className="font-bold text-2xl mb-4 flex items-center gap-2">
                            <span>ℹ️</span> Faucet Rules
                        </h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-400">•</span>
                                <span>Each claim gives you <strong className="text-white">100 tokens</strong></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-400">•</span>
                                <span><strong className="text-white">24-hour cooldown</strong> between claims per token</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-400">•</span>
                                <span>Free testnet tokens for <strong className="text-white">Base Sepolia network</strong></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-400">•</span>
                                <span>Use these tokens to test the <strong className="text-white">swap feature</strong></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Decorative grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
        </main>
    );
}