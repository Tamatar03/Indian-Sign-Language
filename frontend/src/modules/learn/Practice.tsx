import { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/Button';
import { RefreshCw, Trophy, Loader2, CheckCircle, XCircle } from 'lucide-react';
import Webcam from 'react-webcam';

// --- CONFIG ---
const PYTHON_API_URL = 'http://localhost:5000';
const CONFIDENCE_THRESHOLD = 0.8;
const DETECTION_INTERVAL_MS = 400; // Slightly faster for "realtime" feel

// Matching the model's actual capabilities (from config.json)
// User asked for YES/NO/HELP but model only has these 3 currently.
// To fix this, retrain the model with more classes.
const PRACTICE_SEQUENCE = [
    { label: "Hello", modelClass: "hello" },
    { label: "Thank You", modelClass: "thankyou" },
    { label: "I Love You", modelClass: "iloveyou" }
];

export function Practice() {
    // --- STATE ---
    const [currentIndex, setCurrentIndex] = useState(0);
    // score unused for now visually, but kept for logic extensibility - suppressing lint by using it or removing it. Remvoing it for now.
    const [isFinished, setIsFinished] = useState(false);

    // Feedback State
    const [feedback, setFeedback] = useState<'detecting' | 'correct' | 'try_again'>('detecting');
    const [lastDetected, setLastDetected] = useState<string>('');
    const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'error'>('checking');

    // Refs
    const webcamRef = useRef<Webcam>(null);
    const isProcessing = useRef(false);
    const isTransitioning = useRef(false);

    // Initial Server Check
    useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch(`${PYTHON_API_URL}/health`);
                if (res.ok) setServerStatus('connected');
                else setServerStatus('error');
            } catch {
                setServerStatus('error');
            }
        };
        check();
    }, []);

    // Loop for detection
    useEffect(() => {
        if (serverStatus !== 'connected' || isFinished) return;

        const interval = setInterval(async () => {
            // Don't process if already busy or transitioning to next Q
            if (isProcessing.current || isTransitioning.current || !webcamRef.current) return;

            // Get frame
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) return;

            isProcessing.current = true;
            try {
                const response = await fetch(`${PYTHON_API_URL}/predict`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: imageSrc })
                });

                if (response.ok) {
                    const detections = await response.json();
                    handleDetections(detections);
                }
            } catch (err) {
                console.error("Inference error", err);
            } finally {
                isProcessing.current = false;
            }

        }, DETECTION_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [serverStatus, currentIndex, isFinished]);

    // Logic to handle prediction results
    const handleDetections = (detections: any[]) => {
        // Double check transition state to be safe
        if (isTransitioning.current) return;

        const currentTarget = PRACTICE_SEQUENCE[currentIndex];
        if (!currentTarget) return; // Safety check

        if (!detections || detections.length === 0) {
            setFeedback('detecting');
            setLastDetected('');
            return;
        }

        // Find best confidence
        const best = detections.reduce((prev: any, curr: any) =>
            prev.confidence > curr.confidence ? prev : curr
        );

        setLastDetected(`${best.label} (${Math.round(best.confidence * 100)}%)`);

        // Check match
        // Normalize strings for comparison
        const detectedClass = best.label.toLowerCase().trim();
        const targetClass = currentTarget.modelClass.toLowerCase().trim();

        if (detectedClass === targetClass && best.confidence >= CONFIDENCE_THRESHOLD) {
            // SUCCESS
            if (!isTransitioning.current) {
                isTransitioning.current = true; // Lock immediately
                setFeedback('correct');

                // Play sound
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
                audio.play().catch(() => { });

                // Wait a bit before next question
                setTimeout(() => {
                    nextQuestion();
                    isTransitioning.current = false; // Unlock after transition
                }, 1500);
            }
        } else {
            // If high confidence but WRONG class
            if (best.confidence > CONFIDENCE_THRESHOLD) {
                setFeedback('try_again');
            } else {
                setFeedback('detecting');
            }
        }
    };

    const nextQuestion = () => {
        setCurrentIndex(prev => {
            const next = prev + 1;
            if (next >= PRACTICE_SEQUENCE.length) {
                setIsFinished(true);
                return prev; // Keep at last index until finished render takes over
            }
            return next;
        });
        setFeedback('detecting');
        setLastDetected('');
    };

    const restart = () => {
        setCurrentIndex(0);
        setIsFinished(false);
        setFeedback('detecting');
        setLastDetected('');
    };

    // --- RENDER ---

    if (serverStatus === 'error') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 max-w-md">
                    <h2 className="text-2xl font-bold text-red-800 mb-2">Server Offline</h2>
                    <p className="text-red-600 mb-4">
                        The AI sign detection server is not reachable at <span className="font-mono bg-red-100 px-1 rounded">{PYTHON_API_URL}</span>.
                    </p>
                    <p className="text-sm text-red-500 mb-6">
                        Please run <code>python ml/server.py</code> in the backend directory.
                    </p>
                    <Button onClick={() => window.location.reload()} variant="primary" className="w-full">
                        Retry Connection
                    </Button>
                </div>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 animate-in slide-in-from-bottom-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 text-center p-12">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-4">Practice Complete!</h1>
                    <p className="text-xl text-slate-600 mb-8">
                        You successfully performed all {PRACTICE_SEQUENCE.length} signs.
                    </p>
                    <Button onClick={restart} size="lg" className="px-8 text-lg h-12">
                        <RefreshCw className="mr-2" /> Start Again
                    </Button>
                </div>
            </div>
        );
    }

    const currentTarget = PRACTICE_SEQUENCE[currentIndex];

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 flex flex-col items-center min-h-screen">

            {/* TOP BAR: Progress & Instruction */}
            <div className="w-full max-w-4xl flex items-end justify-between mb-6">
                <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-sm block mb-1">
                        Question {currentIndex + 1} / {PRACTICE_SEQUENCE.length}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                        Perform the sign: <span className="text-primary underline decoration-4 decoration-primary/20 underline-offset-4">{currentTarget.label}</span>
                    </h1>
                </div>
                {/* Optional reference hint button could go here */}
            </div>

            {/* MAIN CAMERA FRAME */}
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-4 ring-slate-100">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover transform scale-x-[-1]" // Mirror
                    videoConstraints={{ facingMode: "user" }}
                />

                {/* STATUS OVERLAY - TOP RIGHT */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl font-mono text-sm border border-white/10 flex items-center gap-2">
                    {serverStatus === 'checking' && <Loader2 className="animate-spin w-4 h-4 text-yellow-400" />}
                    {serverStatus === 'connected' && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                    AI Live
                </div>

                {/* STATUS OVERLAY - DEBUG (Optional, keeping small) */}
                {lastDetected && (
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur text-white/50 px-3 py-1 rounded-lg text-xs">
                        Saw: {lastDetected}
                    </div>
                )}

                {/* FEEDBACK OVERLAY - CENTER/BOTTOM */}
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-end h-1/3">

                    {feedback === 'detecting' && (
                        <div className="flex items-center gap-3 text-white/90 text-xl font-medium animate-pulse">
                            <Loader2 className="animate-spin" /> Detecting sign...
                        </div>
                    )}

                    {feedback === 'correct' && (
                        <div className="flex items-center gap-3 text-green-400 text-4xl font-black animate-bounce scale-110 transition-transform">
                            <CheckCircle size={40} strokeWidth={4} /> CORRECT!
                        </div>
                    )}

                    {feedback === 'try_again' && (
                        <div className="flex items-center gap-3 text-red-400 text-2xl font-bold animate-shake">
                            <XCircle size={32} /> Try Again
                        </div>
                    )}
                </div>
            </div>

            {/* INSTRUCTIONS / FOOTER */}
            <div className="mt-8 text-center max-w-lg">
                <p className="text-slate-500">
                    Stand back and ensure your upper body is visible.
                    Make the sign clearly.
                </p>
                {/* Skip Button for getting stuck */}
                <button
                    onClick={nextQuestion}
                    className="mt-4 text-sm text-slate-400 hover:text-slate-600 underline decoration-dotted"
                >
                    Skip this question
                </button>
            </div>
        </div>
    );
}

// Simple custom animation for 'shake' might need CSS, but standard Tailwind animate-pulse works for now.
