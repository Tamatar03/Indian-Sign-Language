import React from 'react';
import { Button } from '../../ui/Button';
import { User, Settings, Award, Clock } from 'lucide-react';

export function Profile() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-3xl font-bold text-white">
                    S
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Sanid</h1>
                    <p className="text-slate-500">Learning since Jan 2026</p>
                </div>
            </div>

            <section className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 grid grid-cols-2 gap-4">
                <div className="text-center p-2">
                    <div className="flex items-center justify-center gap-2 text-orange-500 mb-1">
                        <Award size={20} />
                        <span className="font-bold text-xl">12</span>
                    </div>
                    <p className="text-xs text-slate-400 uppercase">Day Streak</p>
                </div>
                <div className="text-center p-2 border-l border-slate-100">
                    <div className="flex items-center justify-center gap-2 text-blue-500 mb-1">
                        <Clock size={20} />
                        <span className="font-bold text-xl">45m</span>
                    </div>
                    <p className="text-xs text-slate-400 uppercase">Practice Time</p>
                </div>
            </section>

            <section className="space-y-2">
                <h2 className="font-bold text-slate-800 text-lg">Settings</h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left">
                        <span className="text-slate-700">Daily Goal</span>
                        <span className="text-slate-400 text-sm">10 mins ›</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left">
                        <span className="text-slate-700">Handedness</span>
                        <span className="text-slate-400 text-sm">Right ›</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left">
                        <span className="text-slate-700">Notifications</span>
                        <span className="text-slate-400 text-sm">On ›</span>
                    </button>
                </div>
            </section>

            <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50 hover:text-red-600">
                Sign Out
            </Button>
        </div>
    );
}
