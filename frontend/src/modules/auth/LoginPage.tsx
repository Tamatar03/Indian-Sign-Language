
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { useUser } from '../../shared/UserContext';
import { User, Mail } from 'lucide-react';

export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useUser();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name) return;

        setIsLoading(true);

        // Simulate API/Loading delay
        setTimeout(() => {
            login(name, email);
            navigate('/app');
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-xl">ISL</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome</h1>
                    <p className="text-slate-500 text-sm mt-1">Join the community to start learning</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-4 h-12 text-base"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Profile...' : 'Start Learning'}
                    </Button>
                </form>

                <p className="text-center text-slate-400 text-xs mt-6">
                    By confirming, you agree to our Terms of Service.
                </p>
            </div>
        </div>
    );
}
