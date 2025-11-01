interface PoolInfoCardProps {
    reserveA: string;
    reserveB: string;
}

export function PoolInfoCard({ reserveA, reserveB }: PoolInfoCardProps) {
    return (
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
                        {parseFloat(reserveA).toLocaleString('en-US', {
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
                        {parseFloat(reserveB).toLocaleString('en-US', {
                            maximumFractionDigits: 0,
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
