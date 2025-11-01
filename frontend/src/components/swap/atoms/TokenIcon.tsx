interface TokenIconProps {
    symbol: string;
    variant?: 'blue' | 'teal';
}

export function TokenIcon({ symbol, variant = 'blue' }: TokenIconProps) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
        teal: 'from-teal-500 to-teal-600 shadow-teal-500/30'
    };

    return (
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorClasses[variant]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {symbol.charAt(0)}
        </div>
    );
}
