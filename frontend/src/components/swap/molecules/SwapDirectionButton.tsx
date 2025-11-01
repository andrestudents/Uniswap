interface SwapDirectionButtonProps {
    onSwap: () => void;
}

export function SwapDirectionButton({ onSwap }: SwapDirectionButtonProps) {
    return (
        <div className="flex justify-center -my-3 relative z-10 mb-4">
            <button
                onClick={onSwap}
                className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 hover:from-blue-600/40 hover:to-cyan-600/40 border border-slate-600/50 hover:border-blue-500/50 rounded-xl p-2.5 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-blue-500/20"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M7 10l5 5 5-5M7 16l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}
