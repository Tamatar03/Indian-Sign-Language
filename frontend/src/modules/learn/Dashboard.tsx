import React from 'react';
import { Card } from '../../ui/Card';
import { modules } from '../../data/learningData';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const navigate = useNavigate();

    const handleModuleClick = (moduleId: string) => {
        navigate(`/learn/module/${moduleId}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-4">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Learn ISL</h1>
                <p className="text-slate-600">Choose a module to start learning</p>
            </div>

            {/* Module Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {modules.map((module) => (
                    <Card
                        key={module.id}
                        hoverEffect
                        className="cursor-pointer group transition-all hover:shadow-xl border-2 border-slate-200 hover:border-blue-400"
                        onClick={() => handleModuleClick(module.id)}
                    >
                        <div className="flex flex-col items-center text-center p-6 space-y-4">
                            {/* Icon */}
                            <div className="text-6xl transition-transform group-hover:scale-110">
                                {module.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                {module.name}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-slate-500">
                                {module.description}
                            </p>

                            {/* Item Count */}
                            <div className="pt-2">
                                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                                    {module.items.length} items
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
