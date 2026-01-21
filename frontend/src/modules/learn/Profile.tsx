
import { useUser } from '../../shared/UserContext';
import { modules } from '../../data/learningData';
import { Trophy, Star, Zap, RotateCcw } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

export function Profile() {
    const { user, getQuizScore, resetQuizScore } = useUser();

    // Determine Level based on total mastered modules
    const calculateStats = () => {
        let totalMastered = 0;
        let totalPercentage = 0;

        modules.forEach(m => {
            const bestScore = getQuizScore(m.id);
            const total = Math.min(10, m.items.length); // Logic matches Practice.tsx
            const percent = Math.min(100, Math.round((bestScore / total) * 100));

            if (percent === 100) totalMastered++;
            totalPercentage += percent;
        });

        const avgProgress = Math.round(totalPercentage / modules.length);

        let level = "Beginner";
        if (avgProgress > 30) level = "Intermediate";
        if (avgProgress > 70) level = "Advanced";
        if (avgProgress > 95) level = "Expert";

        return { totalMastered, avgProgress, level };
    };

    const { totalMastered, avgProgress, level } = calculateStats();

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
                            <div className="text-3xl font-bold">{totalMastered}</div>
                            <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Mastered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{modules.length}</div>
                            <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Total Modules</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{avgProgress}%</div>
                            <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Avg. Progress</div>
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
                        Module Mastery
                    </h2>

                    <div className="space-y-4">
                        {modules.map(module => {
                            const bestScore = getQuizScore(module.id);
                            // We use the same 'smart quiz length' logic: min(10, totalItems)
                            const maxScore = Math.min(10, module.items.length);
                            const percentage = Math.min(100, Math.round((bestScore / maxScore) * 100));
                            const isMastered = percentage === 100;

                            return (
                                <Card
                                    key={module.id}
                                    className={`p-5 transition-all ${isMastered ? 'bg-yellow-50/50 border-yellow-200' : 'hover:shadow-md'}`}
                                >
                                    {isMastered ? (
                                        // STATE B: Completed / Mastered
                                        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                                            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-3xl shadow-sm border-2 border-yellow-200">
                                                🏆
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h3 className="font-bold text-slate-800 text-lg">{module.name} Mastered!</h3>
                                                <p className="text-yellow-700 font-medium text-sm animate-pulse">
                                                    Congratulations! You have completed this module.
                                                </p>
                                            </div>
                                            <Button
                                                variant="secondary"
                                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs py-2 h-auto"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to reset your progress for this module?')) {
                                                        resetQuizScore(module.id);
                                                    }
                                                }}
                                            >
                                                <RotateCcw className="w-3 h-3 mr-1" />
                                                Reset Progress
                                            </Button>
                                        </div>
                                    ) : (
                                        // STATE A: In Progress
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl">
                                                {module.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-2">
                                                    <h3 className="font-bold text-slate-800">{module.name}</h3>
                                                    <span className="text-sm font-medium text-slate-600">
                                                        {bestScore} / {maxScore} pts
                                                    </span>
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
                                        </div>
                                    )}
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

                    <Card className={`p-6 text-center space-y-4 transition-all border outline-2 ${totalMastered >= 3 ? 'bg-white border-purple-200 shadow-md' : 'opacity-75 grayscale border-slate-100'}`}>
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-3xl">
                            🎓
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Trifecta Master</h3>
                            <p className="text-sm text-slate-500">
                                {totalMastered >= 3 ? "Unlocked! You mastered 3 modules." : `Locked: Master ${3 - totalMastered} more modules`}
                            </p>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
}
