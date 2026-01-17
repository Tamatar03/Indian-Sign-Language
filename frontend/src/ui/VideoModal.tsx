import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
    word: string;
    videoUrl: string;
    description?: string;
    onClose: () => void;
}

export function VideoModal({ word, videoUrl, description, onClose }: VideoModalProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors z-10"
                >
                    <X size={20} className="text-slate-800" />
                </button>

                <div className="aspect-video bg-black relative">
                    <video
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>

                <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 capitalize">{word}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {description || "Common usage in daily conversation. Pay attention to the hand orientation."}
                    </p>

                    <div className="mt-6 flex gap-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
