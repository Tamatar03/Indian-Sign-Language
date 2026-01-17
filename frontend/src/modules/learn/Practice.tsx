import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { RotateCcw, Check, X } from 'lucide-react';

// Mock Practice Data
const FLASHCARDS = [
    { id: 1, word: 'Family', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { id: 2, word: 'Friend', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
];

export function Practice() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // If we finished all cards
    if (currentIndex >= FLASHCARDS.length) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">🎉</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">All caught up!</h2>
                    <p className="text-slate-500">You've reviewed all your words for today.</p>
                </div>
                <Button onClick={() => setCurrentIndex(0)}>Review Again</Button>
            </div>
        );
    }

    const currentCard = FLASHCARDS[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setShowResult(false);
        setCurrentIndex(prev => prev + 1);
    };

    return (
        <div className="py-6 h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Review</h1>
                <span className="text-sm font-medium text-slate-400">
                    {currentIndex + 1} / {FLASHCARDS.length}
                </span>
            </div>

            {/* Flashcard Container */}
            <div className="flex-1 relative perspective-1000">
                <div
                    className={`
            w-full h-full relative transition-all duration-500 preserve-3d cursor-pointer
            ${isFlipped ? 'rotate-y-180' : ''}
          `}
                    onClick={() => !showResult && setIsFlipped(!isFlipped)}
                >
                    {/* Front (Video) */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col">
                        <div className="bg-slate-900 flex-1 flex items-center justify-center relative">
                            <video
                                src={currentCard.videoUrl}
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                            <div className="absolute bottom-4 text-white/50 text-sm font-medium">
                                Tap to reveal meaning
                            </div>
                        </div>
                    </div>

                    {/* Back (Text) */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8 text-center">
                        <p className="text-slate-400 uppercase tracking-widest font-semibold text-sm mb-4">Meaning</p>
                        <h2 className="text-4xl font-extrabold text-primary mb-8">{currentCard.word}</h2>

                        {/* Action Buttons (Only visible on back) */}
                        <div className="flex items-center gap-4 w-full">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                className="flex-1 py-4 rounded-xl bg-red-100 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-200 transition-colors"
                            >
                                <X size={20} />
                                I Forgot
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                className="flex-1 py-4 rounded-xl bg-green-100 text-green-600 font-bold flex items-center justify-center gap-2 hover:bg-green-200 transition-colors"
                            >
                                <Check size={20} />
                                I Knew It
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-center text-slate-400 text-sm mt-6">
                Tap card to flip • Swipe functionality coming soon
            </p>
        </div>
    );
}
