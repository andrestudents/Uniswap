import { Badge } from '../atoms/Badge';
import { SwapStep } from '@/utils/swap/types';

interface TransactionStatusProps {
    approveHash?: `0x${string}`;
    swapHash?: `0x${string}`;
    isApproveSuccess: boolean;
    step: SwapStep;
}

export function TransactionStatus({ approveHash, swapHash, isApproveSuccess, step }: TransactionStatusProps) {
    return (
        <>
            {/* Approval Pending */}
            {approveHash && !isApproveSuccess && (
                <div className="mt-4">
                    <Badge variant="blue" pulse>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                            <span className="text-sm text-blue-300">Approval pending...</span>
                        </div>
                    </Badge>
                </div>
            )}

            {/* Approval Success */}
            {isApproveSuccess && step === 'approving' && (
                <div className="mt-4">
                    <Badge variant="green">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">✓</span>
                            <span className="text-sm text-green-300">Approved! Swapping...</span>
                        </div>
                    </Badge>
                </div>
            )}

            {/* Swap Confirmed */}
            {swapHash && (
                <div className="mt-4">
                    <Badge variant="cyan">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                            <span className="text-sm text-cyan-300">Swap confirmed!</span>
                        </div>
                    </Badge>
                </div>
            )}
        </>
    );
}
