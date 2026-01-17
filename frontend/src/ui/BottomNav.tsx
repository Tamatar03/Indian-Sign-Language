import React from 'react';
import { Home, Book, Zap, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

export function BottomNav() {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { icon: Home, label: 'Home', path: '/app' },
        { icon: Book, label: 'Dictionary', path: '/app/dictionary' },
        { icon: Zap, label: 'Practice', path: '/app/practice' },
        { icon: User, label: 'Profile', path: '/app/profile' },
    ];

    return (
        <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 safe-area-bottom z-50">
            <div className="max-w-md mx-auto grid grid-cols-4 h-16">
                {navItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
                        >
                            <item.icon
                                className={clsx(
                                    "w-6 h-6 transition-colors",
                                    isActive ? "text-primary fill-primary/20" : "text-slate-400"
                                )}
                            />
                            <span
                                className={clsx(
                                    "text-[10px] font-medium transition-colors",
                                    isActive ? "text-primary" : "text-slate-400"
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
