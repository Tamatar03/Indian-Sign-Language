import { useState, useEffect } from 'react';
import { modules, getAllItems, FlashcardItem } from '../../data/learningData';
import { Button } from '../../ui/Button';
import { RefreshCw, Trophy, AlertCircle, Play, ChevronLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { useUser } from '../../shared/UserContext';

export function Practice() {
    // --- APP STATE ---
    // null = Menu Mode, string = Quiz Mode (Module ID)
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

    return (
        <div className="max-w-4xl mx-auto py-6 px-4">
            {selectedModuleId ? (
                <QuizMode
                    moduleId={selectedModuleId}
                    onExit={() => setSelectedModuleId(null)}
                />

            ) : (
                <PracticeMenu onSelectModule={setSelectedModuleId} />
            )}
        </div>
    );
}

// --- SUB-COMPONENT: MENU ---
function PracticeMenu({ onSelectModule }: { onSelectModule: (id: string) => void }) {
    const { getQuizScore } = useUser();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Practice Arena</h1>
                <p className="text-slate-500 text-lg">Select a module to master. Beat your high scores!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((module) => {
                    const bestScore = getQuizScore(module.id);
                    // Determine max possible score roughly (we capped at 10 in logic, but let's just show raw score for now or "/ 10" if we assume 10)
                    // The quiz logic below uses min(10, items), so let's stick to "Best Score: X" for simplicity or calculate max if needed.
                    // For UI cleanliness, we'll just show the score.

                    return (
                        <div
                            key={module.id}
                            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
                            onClick={() => onSelectModule(module.id)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-4xl bg-slate-50 p-3 rounded-xl">{module.icon}</span>
                                {bestScore > 0 && (
                                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Trophy size={12} />
                                        Best: {bestScore}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                                {module.name}
                            </h3>
                            <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                                {module.description}
                            </p>
                            <Button className="w-full gap-2">
                                <Play size={16} fill="currentColor" />
                                Start Quiz
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: QUIZ GAME ---
function QuizMode({ moduleId, onExit }: { moduleId: string; onExit: () => void }) {
    const { saveQuizScore } = useUser();
    const moduleData = modules.find(m => m.id === moduleId);

    // Game State
    const [questions, setQuestions] = useState<{ target: FlashcardItem; options: FlashcardItem[] }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(false); // Audio State

    // Interaction State
    const [hasGuessedWrong, setHasGuessedWrong] = useState(false);
    const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
    const [wrongOptionIds, setWrongOptionIds] = useState<Set<string>>(new Set());

    // Load Quiz Logic
    useEffect(() => {
        if (!moduleData) return;
        startNewQuiz();
    }, [moduleId]);

    const startNewQuiz = () => {
        if (!moduleData) return;
        setIsLoading(true);

        const moduleItems = moduleData.items.filter(item => item.videoUrl);
        const globalItems = getAllItems().filter(item => item.videoUrl);

        // 1. Smart Quiz Length: Min(10, total items in module)
        const quizLength = Math.min(10, moduleItems.length);

        // 2. Select Targets (Shuffle module items and pick top N)
        const targets = [...moduleItems]
            .sort(() => 0.5 - Math.random())
            .slice(0, quizLength);

        // 3. Generate Questions with Context-Aware Distractors
        const newQuestions = targets.map(target => {
            // Priority 1: Pick distractors from the SAME category/module
            const sameCategoryItems = globalItems.filter(i =>
                i.category === target.category && i.id !== target.id
            );

            // Priority 2: Fallback to global items if category is too small
            const otherCategoryItems = globalItems.filter(i =>
                i.category !== target.category
            );

            let potentialDistractors = sameCategoryItems;

            // If we don't have enough same-category items (need 3), mix in others
            if (potentialDistractors.length < 3) {
                potentialDistractors = [...potentialDistractors, ...otherCategoryItems];
            }

            const distractors = potentialDistractors
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            const options = [...distractors, target].sort(() => 0.5 - Math.random());

            return { target, options };
        });

        setQuestions(newQuestions);
        setCurrentIndex(0);
        setScore(0);
        resetQuestionState();
        setIsLoading(false);
    };

    const resetQuestionState = () => {
        setHasGuessedWrong(false);
        setCorrectOptionId(null);
        setWrongOptionIds(new Set());
    };

    // --- AUDIO HELPER ---
    const playSound = (type: 'correct' | 'wrong' | 'win') => {
        if (isMuted) return;

        const sounds = {
            correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Ding
            wrong: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',   // Thud/Buzzer
            win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'      // Fanfare
        };

        const audio = new Audio(sounds[type]);
        audio.volume = type === 'win' ? 0.4 : 0.3; // Lower volume slightly
        audio.play().catch(e => console.error("Audio play failed", e));
    };

    const handleOptionClick = (option: FlashcardItem) => {
        if (correctOptionId) return;

        const currentQuestion = questions[currentIndex];
        const isCorrect = option.id === currentQuestion.target.id;

        if (isCorrect) {
            setCorrectOptionId(option.id);
            playSound('correct');

            if (!hasGuessedWrong) setScore(prev => prev + 1);

            // Auto-advance
            setTimeout(() => {
                if (currentIndex < questions.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                    resetQuestionState();
                } else {
                    // Finshed - Trigger completion state
                    playSound('win');
                    setCurrentIndex(prev => prev + 1);
                    // Save Score
                    const currentFinalScore = (!hasGuessedWrong) ? score + 1 : score;
                    saveQuizScore(moduleId, currentFinalScore);
                }
            }, 800); // Slightly longer delay to hear sound
        } else {
            playSound('wrong');
            setHasGuessedWrong(true);
            setWrongOptionIds(prev => new Set(prev).add(option.id));
        }
    };

    if (isLoading) return <div className="p-10 text-center">Loading Quiz...</div>;

    // --- RESULTS SCREEN ---
    if (currentIndex >= questions.length) {
        // Calculate final score properly (state might lag one render if we relied purely on 'score' inside the click handler for saving, 
        // but here 'score' is already updated for display)
        const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in slide-in-from-bottom-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-slate-100">
                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-yellow-200">
                        <Trophy size={40} fill="currentColor" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">{moduleData?.name} Mastered!</h2>
                    <p className="text-slate-500 mb-8">
                        You scored <strong className="text-primary text-xl">{score}</strong> / {questions.length}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-2xl font-bold text-slate-900">{percentage}%</div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Accuracy</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="text-2xl font-bold text-slate-900">{score * 10}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase">XP Earned</div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button onClick={startNewQuiz} size="lg" className="w-full">
                            <RefreshCw className="mr-2 w-4 h-4" /> Try Again
                        </Button>
                        <Button onClick={onExit} variant="ghost" size="lg" className="w-full">
                            Back to Menu
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // --- GAME SCREEN ---
    const currentQ = questions[currentIndex];
    const progressPercent = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="animate-in fade-in duration-300 relative">

            {/* Mute Toggle */}
            <button
                onClick={() => setIsMuted(prev => !prev)}
                className="absolute top-0 right-0 p-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? "🔇" : "🔊"}
            </button>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 pr-8">
                <Button variant="ghost" size="sm" onClick={onExit} className="text-slate-500">
                    <ChevronLeft size={20} /> <span className="hidden sm:inline">Exit</span>
                </Button>
                <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{moduleData?.name}</span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-sm font-bold">
                        {currentIndex + 1} / {questions.length}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
                <div
                    className="bg-primary h-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Video */}
            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 aspect-video mb-8 relative border-4 border-white ring-1 ring-slate-100 mx-auto max-w-2xl">
                <video
                    key={currentQ.target.id}
                    src={currentQ.target.videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {currentQ.options.map((option) => {
                    const isSelectedWrong = wrongOptionIds.has(option.id);
                    const isConfirmedCorrect = correctOptionId === option.id;
                    const isInteractionDisabled = !!correctOptionId || isSelectedWrong;

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleOptionClick(option)}
                            disabled={isInteractionDisabled}
                            className={clsx(
                                "relative p-4 rounded-xl border-2 font-bold text-lg transition-all duration-200 text-left outline-none",
                                !isSelectedWrong && !isConfirmedCorrect && "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:shadow-md hover:-translate-y-0.5",
                                isSelectedWrong && "bg-red-50 border-red-500 text-red-700 cursor-not-allowed",
                                isConfirmedCorrect && "bg-green-50 border-green-500 text-green-700 shadow-md transform scale-[1.02]",
                                correctOptionId && !isConfirmedCorrect && "opacity-40 grayscale"
                            )}
                        >
                            <span className="block truncate">{option.label}</span>
                            {isSelectedWrong && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />}
                        </button>
                    );
                })}
            </div>
            <div className="h-8 mt-4 text-center">
                {hasGuessedWrong && !correctOptionId && (
                    <p className="text-red-500 font-bold animate-pulse text-sm">
                        Try again!
                    </p>
                )}
            </div>
        </div>
    );
}
