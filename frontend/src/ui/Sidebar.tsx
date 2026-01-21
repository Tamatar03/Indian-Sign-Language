
import { Home, Book, Zap, User, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useUser } from '../shared/UserContext';

export function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useUser();

    const navItems = [
        { icon: Home, label: 'Home', path: '/app' },
        { icon: Book, label: 'Dictionary', path: '/app/dictionary' },
        { icon: Zap, label: 'Practice', path: '/app/practice' },
        { icon: User, label: 'Profile', path: '/app/profile' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
            {/* Logo */}
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <span className="text-white font-bold text-xl">ISL</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-lg leading-tight">Learn ISL</span>
                    <span className="text-xs text-slate-500 font-medium">Interactive Platform</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/app'}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                            isActive
                                ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
