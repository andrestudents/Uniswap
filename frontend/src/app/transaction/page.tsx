'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Sparkles, ArrowLeftRight, Droplet } from 'lucide-react';
import { SwapInterface } from '@/components/SwapInterface';
export default function TransactionPage() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Transaction', path: '/transaction', icon: ArrowLeftRight },
        { name: 'Faucet', path: '/faucet', icon: Droplet },
    ];

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
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="relative z-10 text-center">
                    <SwapInterface />
                </div>
            </div>

            {/* Decorative grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
        </main>
    );
}