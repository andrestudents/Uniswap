import { LoadingSpinner } from '../atoms/LoadingSpinner';

interface SwapButtonProps {
    onClick: () => void;
    disabled: boolean;
    isLoading: boolean;
    text: string;
}

export function SwapButton({ onClick, disabled, isLoading, text }: SwapButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-4 rounded-lg font-semibold text-lg ${
                disabled
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
            <div className="flex items-center justify-center gap-2">
                {isLoading && <LoadingSpinner />}
                {text}
            </div>
        </button>
    );
}
