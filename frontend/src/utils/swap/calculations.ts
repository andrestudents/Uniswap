/**
 * Calculate the exchange rate between two tokens
 */
export function calculateExchangeRate(amountIn: string, amountOut: string): string {
    if (!amountIn || !amountOut || parseFloat(amountIn) <= 0) {
        return '0';
    }
    return (parseFloat(amountOut) / parseFloat(amountIn)).toFixed(4);
}
