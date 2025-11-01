interface BadgeProps {
    children: React.ReactNode;
    variant?: 'blue' | 'green' | 'cyan';
    pulse?: boolean;
}

export function Badge({ children, variant = 'blue', pulse = false }: BadgeProps) {
    const variantClasses = {
        blue: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
        green: 'bg-green-500/10 border-green-500/30 text-green-300',
        cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
    };

    return (
        <div className={`p-4 backdrop-blur-sm rounded-xl border ${variantClasses[variant]} ${pulse ? 'animate-pulse' : ''}`}>
            {children}
        </div>
    );
}
