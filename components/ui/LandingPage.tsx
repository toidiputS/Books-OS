import React, { useState } from 'react';
import { useSystem } from '../../stores/system';
import { useLibrary } from '../../stores/library';

type Props = {
    onEnterWorld: () => void;
};

export const LandingPage = ({ onEnterWorld }: Props) => {
    const login = useSystem(s => s.login);
    const setLibraryCard = useLibrary(s => s.setLibraryCard);

    const portalBg = '/assets/portals-1.png';

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [phase, setPhase] = useState<'form' | 'greeting' | 'entering'>('form');

    const enterWorld = (displayName: string, userEmail: string) => {
        setLibraryCard(displayName);
        onEnterWorld();
        setPhase('greeting');

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`Hello, ${displayName}. Welcome to the Archives.`);
            utterance.rate = 0.9;
            utterance.pitch = 0.9;
            utterance.volume = 0.8;
            window.speechSynthesis.speak(utterance);
        }

        setTimeout(() => setPhase('entering'), 2500);
        setTimeout(() => login(displayName, userEmail), 4500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !email.includes('@')) {
            setError('Please enter a valid email.');
            return;
        }

        setLoading(true);
        // By passing Supabase Auth to enable frictionless "open door" entry.
        const displayName = email.split('@')[0];
        enterWorld(displayName, email);
    };

    return (
        <div className={`fixed inset-0 z-50 overflow-hidden font-sans text-white transition-opacity duration-[2000ms] ease-in-out ${phase === 'entering' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ backgroundColor: '#000' }}>

            {/* BACKGROUND LAYER: Portal Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={portalBg}
                    className="w-full h-full object-cover"
                    alt="Portal Atmosphere"
                />
                <div className="absolute inset-0 bg-black/30 z-[1]"></div>
            </div>

            {/* CONTENT LAYER */}
            <div className={`relative z-10 w-full h-full flex flex-col items-center justify-center transition-transform duration-[3000ms] ease-in-out ${phase === 'entering' ? 'scale-110' : 'scale-100'}`}>

                {/* MINIMAL EMAIL INPUT */}
                <div className={`w-full max-w-sm px-6 flex flex-col items-center transition-all duration-1000 ${phase !== 'form' ? 'opacity-0 translate-y-4 pointer-events-none absolute' : 'opacity-100 translate-y-0 relative'}`}>
                    
                    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                        <div className="relative w-64">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-white/30 focus:border-white/80 py-2 text-center text-white/90 placeholder-white/30 focus:outline-none transition-colors tracking-widest text-sm"
                                placeholder="@"
                                autoFocus
                                disabled={loading}
                                spellCheck="false"
                                autoComplete="email"
                            />
                        </div>
                        {error && (
                            <p className="absolute -bottom-8 text-red-400/70 text-xs font-mono tracking-widest">{error}</p>
                        )}
                        <button type="submit" className="hidden" aria-hidden="true"></button>
                    </form>

                </div>

                {/* GREETING PHASE */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${phase === 'greeting' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                    <h1 className="text-3xl md:text-5xl font-light tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-4 px-4 text-center">
                        Welcome, {email.split('@')[0]}
                    </h1>
                </div>

                {/* FOOTER */}
                <div className={`absolute bottom-12 w-full text-center pointer-events-none transition-opacity duration-1000 ${phase !== 'form' ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-light">Younique Archives.</span>
                </div>

            </div>
        </div>
    );
};