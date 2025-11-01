import { useReadContract } from 'wagmi';
import { type Address, formatUnits } from 'viem';
import { SIMPLE_SWAP_ADDRESS } from '@/constants/contracts';
import SimpleSwapABI from '@/abis/SimpleSwap.json';

export function usePoolReserves() {
    const { data: reserves } = useReadContract({
        address: SIMPLE_SWAP_ADDRESS as Address,
        abi: SimpleSwapABI,
        functionName: 'getReserves',
    });

    const reserveAFormatted = reserves ? formatUnits((reserves as [bigint, bigint])[0], 18) : '0';
    const reserveBFormatted = reserves ? formatUnits((reserves as [bigint, bigint])[1], 18) : '0';

    return {
        reserves,
        reserveA: reserveAFormatted,
        reserveB: reserveBFormatted
    };
}
