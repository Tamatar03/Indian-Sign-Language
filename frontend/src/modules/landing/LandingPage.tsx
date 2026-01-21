
import { Button } from '../../ui/Button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, Globe } from 'lucide-react';
import heroImage from '../../assets/images/image_6.png';

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">ISL</span>
                    </div>
                    <span className="font-bold text-slate-800 text-xl">Learn</span>
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
                    <Button onClick={() => navigate('/login')}>Get Started</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="px-6 py-16 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                        Learn Indian Sign Language <span className="text-primary">Naturally</span>
                    </h1>
                    <p className="text-lg text-slate-600">
                        The fun, fast, and accessible way to learn ISL. Practice with real-time feedback using your webcam. No special hardware required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button size="lg" onClick={() => navigate('/login')}>Start Learning Now</Button>
                        <Button size="lg" variant="secondary" onClick={() => document.getElementById('features')?.scrollIntoView()}>
                            Learn More
                        </Button>
                    </div>
                </div>

                {/* Hero Image / Graphic */}
                <div className="flex-1 relative">
                    <div className="aspect-square bg-blue-50 rounded-full flex items-center justify-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <img
                            src={heroImage}
                            alt="Indian Sign Language Banner - Woman signing 'Connect. Communicate. Belong.'"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-6 py-16 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Why choose ISL Learn?</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                                <CheckCircle size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Real-time Feedback</h3>
                            <p className="text-slate-500 text-sm">Our AI analyzes your hand movements through the webcam and gives instant corrections.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                                <Zap size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Gamified Learning</h3>
                            <p className="text-slate-500 text-sm">Earn streaks, track progress, and unlock new levels just by practicing 5 minutes a day.</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <Globe size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Accessible Everywhere</h3>
                            <p className="text-slate-500 text-sm">Works on your phone, tablet, or laptop. No heavy downloads or GPU required.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-100">
                © 2026 ISL Learn Project. All rights reserved.
            </footer>
        </div>
    );
}
