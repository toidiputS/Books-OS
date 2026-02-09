
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface VotingOverlayProps {
    vattleId: string;
}

const VotingOverlay: React.FC<VotingOverlayProps> = ({ vattleId }) => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            const { data, error } = await supabase
                .from('submissions')
                .select('*')
                .eq('battle_id', vattleId)
                .order('created_at', { ascending: true });

            if (data) setSubmissions(data);
            setLoading(false);
        };

        fetchSubmissions();

        const channel = supabase
            .channel(`voting:${vattleId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions', filter: `battle_id=eq.${vattleId}` }, (payload: any) => {
                if (payload.eventType === 'INSERT') {
                    setSubmissions(prev => [...prev, payload.new]);
                } else if (payload.eventType === 'UPDATE') {
                    setSubmissions(prev => prev.map(s => s.id === payload.new.id ? payload.new : s));
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [vattleId]);

    if (loading) return null;
    if (submissions.length === 0) return <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/60 p-4 rounded text-gray-400 font-orbitron">Awaiting Submissions...</div>;

    const totalVotes = submissions.reduce((acc, s) => acc + (s.votes || 0), 0);

    return (
        <div className="fixed inset-x-0 bottom-10 flex flex-col items-center pointer-events-none font-orbitron">
            <div className="flex gap-8 items-end max-w-4xl w-full px-10">
                {submissions.map((sub, idx) => {
                    const percentage = totalVotes > 0 ? Math.round(((sub.votes || 0) / totalVotes) * 100) : 50;
                    const color = idx === 0 ? 'teal' : 'purple';
                    const colorClass = idx === 0 ? 'bg-teal-500' : 'bg-purple-500';
                    const textClass = idx === 0 ? 'text-teal-400' : 'text-purple-400';

                    return (
                        <div key={sub.id} className="flex-1 flex flex-col items-center animate-slide-up" style={{ animationDelay: `${idx * 0.2}s` }}>
                            <div className="mb-2 text-2xl font-black text-white drop-shadow-lg">
                                {sub.votes || 0} <span className="text-xs uppercase opacity-60">Votes</span>
                            </div>
                            <div className="w-full h-4 bg-gray-900/80 rounded-full overflow-hidden border border-white/10 relative">
                                <div
                                    className={`absolute inset-y-0 ${colorClass} transition-all duration-1000 ease-out`}
                                    style={{ width: `${percentage}%`, left: idx === 0 ? '0' : 'auto', right: idx === 1 ? '0' : 'auto' }}
                                >
                                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                                </div>
                            </div>
                            <div className={`mt-2 font-bold uppercase tracking-widest text-xs ${textClass}`}>
                                {sub.user_name || `Vattler ${idx + 1}`}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 bg-black/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white text-sm font-bold animate-fade-in">
                LIVE VOTING RESULTS
            </div>

            <style>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default VotingOverlay;
