import { useBalance } from 'wagmi';
import { type Address } from 'viem';

export function useTokenBalance(address: Address | undefined, tokenAddress: Address) {
    const { data: balance } = useBalance({
        address: address,
        token: tokenAddress,
    });

    return {
        balance: balance?.formatted,
        balanceData: balance
    };
}
