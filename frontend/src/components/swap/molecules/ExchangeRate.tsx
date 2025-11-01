interface ExchangeRateProps {
    fromSymbol: string;
    toSymbol: string;
    rate: string;
}

export function ExchangeRate({ fromSymbol, toSymbol, rate }: ExchangeRateProps) {
    return (
        <div className="mb-6 p-3 bg-slate-700/20 rounded-lg border border-slate-600/30">
            <div className="flex justify-between text-sm">
                <span className="text-slate-400">Rate</span>
                <span className="text-white font-medium">
                    1 {fromSymbol} = {rate} {toSymbol}
                </span>
            </div>
        </div>
    );
}
