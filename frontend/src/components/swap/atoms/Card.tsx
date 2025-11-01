import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'hover';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
    const baseClasses = 'bg-gradient-to-br backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300';

    const variantClasses = {
        default: 'from-slate-700/40 to-slate-800/40 border-slate-600/30',
        hover: 'from-slate-700/40 to-slate-800/40 border-slate-600/30 group-hover:border-blue-500/50'
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </div>
    );
}
