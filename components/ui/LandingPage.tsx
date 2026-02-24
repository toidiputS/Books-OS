import React, { useState } from 'react';
import { useSystem } from '../../stores/system';
import { useLibrary } from '../../stores/library';
import { supabase } from '../../services/supabase';

type Props = {
    onEnterWorld: () => void;
};

export const LandingPage = ({ onEnterWorld }: Props) => {
    const login = useSystem(s => s.login);
    const setLibraryCard = useLibrary(s => s.setLibraryCard);

    const portalBg = '/assets/portals-1.png';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Phases: 'form' -> 'greeting' (Audio plays) -> 'entering' (Fade to library)
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
        setLoading(true);

        try {
            if (isSignUp) {
                // Sign up
                if (!name.trim()) {
                    setError('Name is required');
                    setLoading(false);
                    return;
                }
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { display_name: name.trim() },
                    },
                });
                if (signUpError) throw signUpError;
                if (data.user) {
                    enterWorld(name.trim(), email);
                }
            } else {
                // Sign in
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                if (data.user) {
                    const displayName = data.user.user_metadata?.display_name || email.split('@')[0];
                    enterWorld(displayName, email);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
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
            <div className={`relative z-10 w-full h-full flex items-center justify-center transition-transform duration-[3000ms] ease-in-out ${phase === 'entering' ? 'scale-110' : 'scale-100'}`}>

                {/* LOGIN CARD */}
                <div className={`w-full max-w-[420px] p-6 text-center transition-all duration-1000 ${phase !== 'form' ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}>

                    <div className="bg-[#050505]/80 backdrop-blur-md border border-[#333] rounded-[32px] p-10 shadow-2xl">
                        <div className="mb-8 space-y-2">
                            <h3 className="text-white text-lg font-medium tracking-wide">Welcome to</h3>
                            <h1 className="text-4xl font-bold text-white tracking-tight">The Youniverse</h1>
                            <p className="text-[#666] text-xs font-medium pt-2 tracking-wide">No Hero. No Guru. Just a New You.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {isSignUp && (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-[#111] border border-[#222] hover:border-[#444] focus:border-[#666] rounded-xl px-5 py-4 text-white placeholder-[#444] focus:outline-none transition-all text-left"
                                    placeholder="Display Name"
                                    autoFocus
                                />
                            )}

                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-[#111] border border-[#222] hover:border-[#444] focus:border-[#666] rounded-xl px-5 py-4 text-white placeholder-[#444] focus:outline-none transition-all text-left"
                                placeholder="you@example.com"
                                autoFocus={!isSignUp}
                            />

                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-[#111] border border-[#222] hover:border-[#444] focus:border-[#666] rounded-xl px-5 py-4 text-white placeholder-[#444] focus:outline-none transition-all text-left"
                                placeholder="Password"
                            />

                            {error && (
                                <p className="text-red-400 text-xs font-mono text-left px-1">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 group relative flex items-center justify-center gap-2 bg-[#111] border border-[#333] hover:bg-[#222] hover:border-[#555] text-white rounded-full py-4 font-medium tracking-wide transition-all overflow-hidden disabled:opacity-50"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white transition-colors">
                                    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" />
                                </svg>
                                <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Enter The Youniverse'}</span>
                            </button>
                        </form>

                        <button
                            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                            className="mt-6 text-[#555] hover:text-[#888] text-xs font-medium transition-colors"
                        >
                            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </div>

                {/* GREETING PHASE */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${phase === 'greeting' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                    <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] mb-4 px-4 text-center">
                        Welcome, {name || email.split('@')[0]}
                    </h1>
                    <div className="h-1 w-24 bg-cyan-500 rounded-full mb-4 animate-pulse"></div>
                </div>

            </div>
        </div>
    );
};