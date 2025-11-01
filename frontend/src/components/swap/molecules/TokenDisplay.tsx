import { TokenIcon } from '../atoms/TokenIcon';
import { Token } from '@/utils/swap/types';

interface TokenDisplayProps {
    token: Token;
    balance?: string;
    variant?: 'blue' | 'teal';
    showBalance?: boolean;
}

export function TokenDisplay({ token, balance, variant = 'blue', showBalance = true }: TokenDisplayProps) {
    return (
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
                <TokenIcon symbol={token.symbol} variant={variant} />
                <div>
                    <p className="font-semibold text-white">{token.symbol}</p>
                    <p className="text-xs text-slate-400">{token.name}</p>
                </div>
            </div>
            {showBalance && balance !== undefined && (
                <div className="text-right">
                    <p className="text-xs text-slate-400">Balance</p>
                    <p className="text-sm font-semibold text-white">
                        {parseFloat(balance || '0').toFixed(4)}
                    </p>
                </div>
            )}
        </div>
    );
}
