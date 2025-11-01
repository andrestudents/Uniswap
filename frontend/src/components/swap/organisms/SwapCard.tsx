import { AmountInput } from '../molecules/AmountInput';
import { SwapDirectionButton } from '../molecules/SwapDirectionButton';
import { ExchangeRate } from '../molecules/ExchangeRate';
import { SwapButton } from '../molecules/SwapButton';
import { TransactionStatus } from '../molecules/TransactionStatus';
import { Token, SwapStep } from '@/utils/swap/types';

interface SwapCardProps {
    // Tokens
    fromToken: Token;
    toToken: Token;

    // Amounts
    amountIn: string;
    amountOut: string;
    onAmountInChange: (value: string) => void;

    // Balances
    fromBalance?: string;

    // Direction
    onDirectionSwap: () => void;

    // Actions
    onMaxClick: () => void;
    onSwap: () => void;

    // Status
    step: SwapStep;
    isLoading: boolean;
    buttonText: string;

    // Rate
    rate: string;

    // Transaction
    approveHash?: `0x${string}`;
    swapHash?: `0x${string}`;
    isApproveSuccess: boolean;
}

export function SwapCard({
    fromToken,
    toToken,
    amountIn,
    amountOut,
    onAmountInChange,
    fromBalance,
    onDirectionSwap,
    onMaxClick,
    onSwap,
    step,
    isLoading,
    buttonText,
    rate,
    approveHash,
    swapHash,
    isApproveSuccess
}: SwapCardProps) {
    return (
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-2xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
                    Exchange
                </h2>
                <p className="text-sm text-slate-400">Swap tokens instantly</p>
            </div>

            {/* From Token Section */}
            <div className="mb-4">
                <AmountInput
                    token={fromToken}
                    balance={fromBalance}
                    amount={amountIn}
                    onAmountChange={onAmountInChange}
                    onMaxClick={onMaxClick}
                    label="From"
                    variant="blue"
                />
            </div>

            <br />

            {/* Swap Direction Button */}
            <SwapDirectionButton onSwap={onDirectionSwap} />

            {/* To Token Section */}
            <div className="mb-6">
                <AmountInput
                    token={toToken}
                    amount={parseFloat(amountOut).toFixed(6)}
                    onAmountChange={() => {}}
                    label="To"
                    variant="teal"
                    readOnly
                    showMaxButton={false}
                />
            </div>

            {/* Exchange Rate */}
            {amountIn && parseFloat(amountIn) > 0 && (
                <ExchangeRate
                    fromSymbol={fromToken.symbol}
                    toSymbol={toToken.symbol}
                    rate={rate}
                />
            )}

            <br />
            <br />

            {/* Swap Button */}
            <SwapButton
                onClick={onSwap}
                disabled={!amountIn || parseFloat(amountIn) <= 0 || isLoading}
                isLoading={isLoading}
                text={buttonText}
            />

            {/* Transaction Status */}
            <TransactionStatus
                approveHash={approveHash}
                swapHash={swapHash}
                isApproveSuccess={isApproveSuccess}
                step={step}
            />
        </div>
    );
}
