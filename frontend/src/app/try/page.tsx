"use client";
import React, { use, useState } from 'react';
import { ArrowRightLeft, Send, Clock } from 'lucide-react';

export default function TransactionTab() {
    const [activeTab, setActiveTab] = useState("swap");

    // Mock data
    const swaps = [
        { id: 1, from: 'ETH', to: 'USDC', amount: 2.5, rate: 3800, date: '2025-01-15', status: 'completed' },
        { id: 2, from: 'BTC', to: 'ETH', amount: 0.5, rate: 18.2, date: '2025-01-14', status: 'completed' },
    ];

    const transfers = [
        { id: 1, type: 'send', token: 'USDC', amount: 500, address: '0x742d...', date: '2025-01-15', status: 'completed' },
        { id: 2, type: 'receive', token: 'ETH', amount: 1.5, address: '0x891a...', date: '2025-01-14', status: 'completed' },
    ];

    const history = [
        { id: 1, action: 'Swap', from: 'ETH', to: 'USDC', amount: 2.5, date: '2025-01-15', status: 'completed' },
        { id: 2, action: 'Transfer', token: 'USDC', amount: 500, date: '2025-01-14', status: 'completed' },
        { id: 3, action: 'Stake', token: 'SOL', amount: 100, date: '2025-01-13', status: 'pending' },
    ];

    const tabs = [
        { key: "swap", title: "Swap", icon: ArrowRightLeft },
        { key: "transfer", title: "Transfer", icon: Send },
        { key: "history", title: "History", icon: Clock },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'swap':
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white mb-4">Swap Transactions</h2>
                        {swaps.map((swap) => (
                            <div key={swap.id} className="bg-slate-700/30 backdrop-blur p-4 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600/30">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-500/20 p-3 rounded-full border border-blue-500/30">
                                            <ArrowRightLeft className="text-blue-400" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{swap.from} → {swap.to}</p>
                                            <p className="text-gray-400 text-sm">{swap.amount} {swap.from}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-semibold">{swap.rate} {swap.to}</p>
                                        <p className="text-gray-500 text-sm">{swap.date}</p>
                                        <span className="inline-block mt-1 bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-semibold border border-green-500/30">{swap.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'transfer':
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white mb-4">Transfers</h2>
                        {transfers.map((transfer) => (
                            <div key={transfer.id} className="bg-slate-700/30 backdrop-blur p-4 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-600/30">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full border ${transfer.type === 'send' ? 'bg-red-500/20 border-red-500/30' : 'bg-green-500/20 border-green-500/30'}`}>
                                            <Send className={transfer.type === 'send' ? 'text-red-400' : 'text-green-400'} size={20} />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{transfer.type === 'send' ? 'Sent' : 'Received'} {transfer.token}</p>
                                            <p className="text-gray-400 text-sm">{transfer.address}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${transfer.type === 'send' ? 'text-red-400' : 'text-green-400'}`}>
                                            {transfer.type === 'send' ? '-' : '+'}{transfer.amount} {transfer.token}
                                        </p>
                                        <p className="text-gray-500 text-sm">{transfer.date}</p>
                                        <span className="inline-block mt-1 bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-semibold border border-green-500/30">{transfer.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'history':
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white mb-4">Transaction History</h2>
                        <div className="bg-slate-700/30 backdrop-blur rounded-lg overflow-hidden border border-slate-600/30">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-600/30 bg-slate-800/30">
                                        <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">Action</th>
                                        <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">Token/Pair</th>
                                        <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">Amount</th>
                                        <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">Date</th>
                                        <th className="text-left px-4 py-3 text-gray-400 font-semibold text-sm">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-600/30 hover:bg-slate-700/30 transition-colors">
                                            <td className="px-4 py-3 text-white font-semibold text-sm">{item.action}</td>
                                            <td className="px-4 py-3 text-gray-400 text-sm">{item.from ? `${item.from}/${item.to}` : item.token}</td>
                                            <td className="px-4 py-3 text-white text-sm">{item.amount}</td>
                                            <td className="px-4 py-3 text-gray-500 text-sm">{item.date}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold border ${item.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="flex items-center justify-center mt-20 relative z-10">
                <div className="flex flex-col gap-6 items-center">
                    {/* Custom Tabs Component */}
                    <div className="w-full max-w-4xl">
                        {/* Tab Buttons */}
                        <div className="flex gap-2 border-b border-gray-700/50 mb-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm uppercase tracking-wider transition-all duration-300 relative ${activeTab === tab.key
                                            ? "text-blue-400"
                                            : "text-gray-400 hover:text-gray-300"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {tab.title}
                                        {activeTab === tab.key && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content Card */}
                        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-2xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}