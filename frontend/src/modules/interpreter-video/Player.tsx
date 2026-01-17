import React, { useState, useRef, useEffect } from 'react';
import { useSpeechRecognition } from '../../shared/speech';
import { convertToGloss } from '../../shared/textToGloss';
import { Button } from '../../ui/Button';
import { Mic, MicOff, Camera, RotateCcw, X, Play, Pause, Settings } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export function Player() {
    const navigate = useNavigate();
    const { lessonId } = useParams();

    // State
    const [showMirror, setShowMirror] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    // Hooks
    const { isListening, transcript, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
    const [gloss, setGloss] = useState<string[]>([]);

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const webcamRef = useRef<HTMLVideoElement>(null);

    // Update gloss when transcript changes
    useEffect(() => {
        if (transcript) {
            setGloss(convertToGloss(transcript));
        }
    }, [transcript]);

    // Webcam handling
    useEffect(() => {
        let stream: MediaStream | null = null;

        if (showMirror && webcamRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((s) => {
                    stream = s;
                    if (webcamRef.current) {
                        webcamRef.current.srcObject = s;
                    }
                })
                .catch((err) => console.error("Webcam access denied:", err));
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [showMirror]);

    // Toggle Playback
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSpeedChange = () => {
        const speeds = [0.5, 0.75, 1];
        const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];
        setPlaybackSpeed(newSpeed);
        if (videoRef.current) {
            videoRef.current.playbackRate = newSpeed;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-white">
            {/* TOP SECTION: STAGE (60%) */}
            <div className="relative h-[60%] bg-black overflow-hidden flex items-center justify-center">

                {/* Main Video (Mock source for now) */}
                {!showMirror ? (
                    <video
                        ref={videoRef}
                        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                        className="w-full h-full object-cover opacity-90"
                        loop
                        playsInline
                        muted // Muted for autoplay policy in some browsers
                    />
                ) : (
                    <video
                        ref={webcamRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]" // Mirror effect
                    />
                )}

                {/* Overlay Controls */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                    <button onClick={() => navigate(-1)} className="p-2 bg-black/40 rounded-full backdrop-blur-sm text-white">
                        <X size={24} />
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowMirror(!showMirror)}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${showMirror ? 'bg-primary text-white' : 'bg-black/40 text-white'}`}
                        >
                            <Camera size={24} />
                        </button>
                        <button
                            onClick={handleSpeedChange}
                            className="px-3 py-2 bg-black/40 rounded-full backdrop-blur-sm text-sm font-bold"
                        >
                            {playbackSpeed}x
                        </button>
                    </div>
                </div>

                {/* Play/Pause Center Overlay */}
                {!isPlaying && !showMirror && (
                    <button
                        onClick={togglePlay}
                        className="absolute z-20 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <Play size={32} fill="white" className="ml-1" />
                    </button>
                )}
            </div>

            {/* BOTTOM SECTION: CONTROL DECK (40%) */}
            <div className="h-[40%] bg-surface-white rounded-t-3xl -mt-6 z-30 relative p-6 flex flex-col items-center">
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-6" />

                {/* Transcript Area */}
                <div className="w-full flex-1 mb-6 text-center space-y-2 overflow-y-auto">
                    {transcript ? (
                        <>
                            <p className="text-slate-500 text-sm">You said:</p>
                            <p className="text-slate-800 font-medium text-lg">"{transcript}"</p>

                            {/* Gloss Display */}
                            {gloss.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                    {gloss.map((word, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-bold text-sm tracking-wide">
                                            {word}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <p>Tap the mic and speak...</p>
                        </div>
                    )}
                </div>

                {/* Mic Button */}
                <div className="relative">
                    {isListening && (
                        <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75" />
                    )}
                    <button
                        onClick={isListening ? stopListening : startListening}
                        className={`
              relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95
              ${isListening ? 'bg-red-500 text-white' : 'bg-primary text-white'}
            `}
                    >
                        {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                    </button>
                </div>

                {!hasRecognitionSupport && (
                    <p className="text-xs text-red-500 mt-2">Speech API not supported in this browser.</p>
                )}
            </div>
        </div>
    );
}
