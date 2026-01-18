
import { Card } from '../../ui/Card';
import { modules } from '../../data/learningData';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

// Color mapping for modules to give them distinct visual identities
const moduleStyles: Record<string, { bg: string; text: string; iconBg: string; border: string }> = {
    'alphabets': {
        bg: 'hover:bg-blue-50',
        text: 'text-blue-600',
        iconBg: 'bg-blue-100',
        border: 'hover:border-blue-200'
    },
    'numbers': {
        bg: 'hover:bg-green-50',
        text: 'text-green-600',
        iconBg: 'bg-green-100',
        border: 'hover:border-green-200'
    },
    'greetings-verbs': {
        bg: 'hover:bg-purple-50',
        text: 'text-purple-600',
        iconBg: 'bg-purple-100',
        border: 'hover:border-purple-200'
    },
    'emergency': {
        bg: 'hover:bg-red-50',
        text: 'text-red-600',
        iconBg: 'bg-red-100',
        border: 'hover:border-red-200'
    },
    'emotions': {
        bg: 'hover:bg-amber-50',
        text: 'text-amber-600',
        iconBg: 'bg-amber-100',
        border: 'hover:border-amber-200'
    }
};

export function Dashboard() {
    const navigate = useNavigate();

    const handleModuleClick = (moduleId: string) => {
        navigate(`/app/learn/module/${moduleId}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Start Learning Today</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Master <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Indian Sign Language</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Interactive lessons, flashcards, and quizzes designed to help you communicate with confidence.
                </p>
            </div>

            {/* Module Cards Grid (Responsive Dashboard Layout) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {modules.map((module) => {
                    const style = moduleStyles[module.id] || moduleStyles['alphabets'];
                    return (
                        <Card
                            key={module.id}
                            className={clsx(
                                "cursor-pointer group relative overflow-hidden border border-slate-100 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                                style.border
                            )}
                            onClick={() => handleModuleClick(module.id)}
                        >
                            <div className="flex flex-col md:flex-row items-center md:items-stretch p-6 gap-6">
                                {/* Left Section: Icon & Text */}
                                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 flex-1">
                                    <div className={clsx("w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center text-4xl shadow-sm", style.iconBg)}>
                                        {module.icon}
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {module.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                                            {module.description}
                                        </p>

                                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-xs font-medium pt-1">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{module.items.length} Lessons</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider (Mobile Only) */}
                                <div className="w-full h-px bg-slate-100 md:hidden" />

                                {/* Right Section: Progress & Action */}
                                <div className="w-full md:w-64 flex flex-col justify-between gap-4 md:border-l md:border-slate-100 md:pl-6">
                                    {/* Progress Bar */}
                                    <div className="space-y-2 w-full">
                                        <div className="flex justify-between text-xs font-medium text-slate-400">
                                            <span>Progress</span>
                                            <span>0%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-0 transition-all duration-500" />
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className={clsx(
                                        "flex items-center justify-center md:justify-end gap-2 text-sm font-bold bg-white p-2 rounded-xl transition-all group-hover:gap-3",
                                        style.text
                                    )}>
                                        <span>Start Learning</span>
                                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center transition-colors", style.iconBg)}>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
