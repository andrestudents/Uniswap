'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SwapInterface } from '@/components/SwapInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Connect Wallet Button (top-right) */}
      <div className="absolute top-6 right-6 z-20">
        <ConnectButton />
      </div>

      {/* Centered Content */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative z-10 p-4 md:p-8 text-center">
          {/* Header (Centered) */}
          <header className="mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              SWAP DEX
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Trade tokens instantly with minimal slippage
            </p>
          </header>
          <br />
          {/* Swap Interface */}
          <div className="flex justify-center ">
            <SwapInterface />
          </div>
        </div>
      </div>
    </main>
  );
}
