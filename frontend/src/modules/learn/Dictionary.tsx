import React, { useState, useMemo } from 'react';
import { Search, PlayCircle } from 'lucide-react';
import { Card } from '../../ui/Card';
import { VideoModal } from '../../ui/VideoModal';

// Mock Dictionary Data
const DICTIONARY_DATA = [
    { id: 1, word: 'Hello', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { id: 2, word: 'Thank You', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { id: 3, word: 'Please', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { id: 4, word: 'Sorry', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    { id: 5, word: 'Yes', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { id: 6, word: 'No', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    // Add more words as needed
];

export function Dictionary() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSign, setSelectedSign] = useState<typeof DICTIONARY_DATA[0] | null>(null);

    const filteredSigns = useMemo(() => {
        return DICTIONARY_DATA.filter(sign =>
            sign.word.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <div className="min-h-screen pb-20">
            {/* Sticky Search Bar */}
            <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md pt-4 pb-4 -mx-4 px-4 border-b border-slate-100 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for a sign..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-primary/50 outline-none text-slate-800 placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Grid */}
            <h2 className="font-bold text-slate-400 text-sm mb-4 uppercase tracking-wider">
                {filteredSigns.length} Results
            </h2>

            <div className="grid grid-cols-2 gap-4">
                {filteredSigns.map((sign) => (
                    <Card
                        key={sign.id}
                        hoverEffect
                        onClick={() => setSelectedSign(sign)}
                        className="aspect-square flex flex-col items-center justify-center gap-3 text-center p-2 hover:border-primary/50 transition-colors"
                    >
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-1">
                            <PlayCircle size={28} />
                        </div>
                        <span className="font-semibold text-slate-700 capitalize">{sign.word}</span>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredSigns.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                    <p>No signs found for "{searchQuery}"</p>
                </div>
            )}

            {/* Modal */}
            {selectedSign && (
                <VideoModal
                    word={selectedSign.word}
                    videoUrl={selectedSign.videoUrl}
                    onClose={() => setSelectedSign(null)}
                />
            )}
        </div>
    );
}
