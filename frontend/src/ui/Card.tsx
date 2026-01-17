import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export function Card({ children, className, hoverEffect = false, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "bg-surface-white rounded-xl shadow-sm border border-slate-100 p-4",
                hoverEffect && "transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
