import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import { Play, CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock Data for the prototype
const COURSE_PATH = [
    {
        id: 'basics',
        title: 'Basics & Greetings',
        progress: 75,
        lessons: [
            { id: 1, title: 'Introduction to ISL', locked: false, completed: true },
            { id: 2, title: 'Alphabet A-Z', locked: false, completed: true },
            { id: 3, title: 'Common Greetings', locked: false, completed: false },
            { id: 4, title: 'Family Members', locked: true, completed: false },
        ]
    },
    {
        id: 'emergency',
        title: 'Emergency Signs',
        progress: 0,
        lessons: [
            { id: 5, title: 'Medical Help', locked: true, completed: false },
            { id: 6, title: 'Police & Safety', locked: true, completed: false },
        ]
    }
];

export function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Your Learning Path</h1>
                <p className="text-slate-500 text-sm">Keep going! You're doing great.</p>
            </div>

            {COURSE_PATH.map((topic, index) => (
                <section key={topic.id} className="relative">
                    {/* Connector Line */}
                    {index !== COURSE_PATH.length - 1 && (
                        <div className="absolute left-6 top-10 bottom-[-40px] w-0.5 bg-slate-200 -z-10" />
                    )}

                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-700">{topic.title}</h2>
                        <span className="text-xs font-bold text-primary bg-primary-light/10 px-2 py-1 rounded-full">
                            {topic.progress}% Completed
                        </span>
                    </div>

                    <div className="space-y-4">
                        {topic.lessons.map((lesson) => (
                            <Card
                                key={lesson.id}
                                hoverEffect={!lesson.locked}
                                className={`flex items-center gap-4 ${lesson.locked ? 'opacity-60 bg-slate-50' : 'border-l-4 border-l-primary'}`}
                                onClick={() => !lesson.locked && navigate(`/app/learn/${lesson.id}`)}
                            >
                                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center shrink-0
                  ${lesson.completed ? 'bg-green-100 text-green-600' :
                                        lesson.locked ? 'bg-slate-200 text-slate-400' : 'bg-primary text-white'}
                `}>
                                    {lesson.completed ? <CheckCircle size={20} /> :
                                        lesson.locked ? <Lock size={20} /> : <Play size={20} fill="currentColor" />}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-800 text-sm">{lesson.title}</h3>
                                    <p className="text-xs text-slate-400">
                                        {lesson.completed ? 'Mastered' : lesson.locked ? 'Locked' : 'Start Lesson'}
                                    </p>
                                </div>

                                {!lesson.locked && !lesson.completed && (
                                    <Button size="sm" variant="ghost">Start</Button>
                                )}
                            </Card>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
