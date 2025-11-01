import { Card } from '../atoms/Card';
import { TokenDisplay } from './TokenDisplay';
import { Token } from '@/utils/swap/types';

interface AmountInputProps {
    token: Token;
    balance?: string;
    amount: string;
    onAmountChange: (value: string) => void;
    onMaxClick?: () => void;
    label: string;
    variant?: 'blue' | 'teal';
    readOnly?: boolean;
    showMaxButton?: boolean;
}

export function AmountInput({
    token,
    balance,
    amount,
    onAmountChange,
    onMaxClick,
    label,
    variant = 'blue',
    readOnly = false,
    showMaxButton = true
}: AmountInputProps) {
    return (
        <div className="relative group">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {label}
            </label>
            <br />
            <Card variant={variant === 'blue' ? 'hover' : 'default'}>
                <TokenDisplay
                    token={token}
                    balance={balance}
                    variant={variant}
                    showBalance={!readOnly}
                />
                <br />
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => onAmountChange(e.target.value)}
                    placeholder="0.0"
                    readOnly={readOnly}
                    className="w-full bg-transparent text-3xl text-white text-center placeholder-slate-500 outline-none font-semibold"
                />

                {showMaxButton && onMaxClick && !readOnly && (
                    <button
                        onClick={onMaxClick}
                        className="absolute right-4 top-12 text-xs font-bold px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all duration-200"
                    >
                        MAX
                    </button>
                )}
            </Card>
        </div>
    );
}
