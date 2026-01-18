
import { useUser } from '../../shared/UserContext';
import { modules } from '../../data/learningData';
import { Trophy, Star, Zap } from 'lucide-react';
import { Card } from '../../ui/Card';

export function Profile() {
    const { user, progress } = useUser();

    // Calculate Stats
    const totalItems = modules.reduce((acc, module) => acc + module.items.length, 0);
    const totalCompleted = Object.values(progress).reduce((acc, count) => acc + count, 0);
    const completionPercentage = Math.round((totalCompleted / Math.max(totalItems, 1)) * 100);

    // Calculate Modules Completed (100% finished)
    const modulesCompleted = modules.filter(m => (progress[m.id] || 0) >= m.items.length).length;

    // Determine Level
    let level = "Beginner";
    if (completionPercentage > 30) level = "Intermediate";
    if (completionPercentage > 80) level = "Advanced";
    if (completionPercentage === 100) level = "Expert";

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* User Avatar Placeholder */}
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-4xl border-4 border-white/10 shadow-inner">
                        👤
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold">{user?.name || 'Guest User'}</h1>
                        <p className="text-blue-100 font-medium text-lg">{user?.email}</p>
                        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm mt-2">
                            <Trophy className="w-4 h-4 text-yellow-300" />
                            <span>Level: {level}</span>
                        </div>
                    </div>

                    {/* Quick Stats Grid (In Header) */}
                    <div className="flex gap-4 md:gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold">{modulesCompleted}</div>
                            <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Modules</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{totalCompleted}</div>
                            <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Lessons</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{completionPercentage}%</div>
                            <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Progress</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main: Module Progress */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        Module Progress
                    </h2>

                    <div className="space-y-4">
                        {modules.map(module => {
                            const completed = progress[module.id] || 0;
                            const total = module.items.length;
                            const percentage = Math.min(Math.round((completed / total) * 100), 100);

                            return (
                                <Card key={module.id} className="p-4 flex items-center gap-4 hover:shadow-md transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl">
                                        {module.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-2">
                                            <h3 className="font-bold text-slate-800">{module.name}</h3>
                                            <span className="text-sm font-medium text-slate-600">{completed}/{total}</span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-slate-400 w-12 text-right">
                                        {percentage}%
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* Sidebar: Achievements / Insights */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                        Achievements
                    </h2>

                    <Card className="p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-3xl">
                            🔥
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Day 1 Streak</h3>
                            <p className="text-sm text-slate-500">You're just getting started! Keep learning daily.</p>
                        </div>
                    </Card>

                    <Card className="p-6 text-center space-y-4 opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-3xl">
                            🎓
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Master Scholar</h3>
                            <p className="text-sm text-slate-500">Locked: Complete 50 lessons</p>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
}
