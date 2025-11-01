import Link from 'next/link';
import { MyButton } from '@/components/MyButton';

export function ConnectWalletPrompt() {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 text-center bg-slate-300">
                <div className="text-6xl mb-4">💀</div>
                <p className="text-lg text-slate-300">Connect wallet to get started</p>
            </div>
            <br />
            <div className="mt-6 flex justify-center">
                <MyButton color="olive" size="xl" className="hover:scale-105 rounded-lg transition-transform">
                    <Link href="/try">
                        GO TO TRY
                    </Link>
                </MyButton>
            </div>
        </div>
    );
}
