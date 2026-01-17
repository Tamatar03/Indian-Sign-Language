import React from 'react';
import { Flame, User } from 'lucide-react';

interface StickyHeaderProps {
    streak?: number;
}

export function StickyHeader({ streak = 0 }: StickyHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 border-b border-slate-100">
            <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">ISL</span>
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Learn</span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-100">
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                        <span className="text-sm font-bold text-orange-600">{streak}</span>
                    </div>
                    <button className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                        <User className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            </div>
        </header>
    );
}
