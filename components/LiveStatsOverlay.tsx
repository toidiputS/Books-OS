
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { VattleConfig } from '../types';
import BattleTimer from './BattleTimer';

interface LiveStatsOverlayProps {
    vattleId: string;
}

const LiveStatsOverlay: React.FC<LiveStatsOverlayProps> = ({ vattleId }) => {
    const [vattle, setVattle] = useState<VattleConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVattle = async () => {
            const { data, error } = await supabase
                .from('battles')
                .select('*')
                .eq('id', vattleId)
                .single();

            if (data) {
                setVattle({
                    id: data.id,
                    theme: data.theme,
                    creatorName: data.creator_name,
                    invitedOpponent: data.opponent_name || 'Open Invite',
                    status: data.status,
                    mode: data.mode,
                    opponent: data.opponent_type,
                    timeLimit: data.time_limit,
                    startTime: data.start_time ? new Date(data.start_time).getTime() : undefined,
                } as VattleConfig);
            }
            setLoading(false);
        };

        fetchVattle();

        const channel = supabase
            .channel(`overlay:${vattleId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'battles', filter: `id=eq.${vattleId}` }, (payload) => {
                const b = payload.new as any;
                setVattle(prev => prev ? ({
                    ...prev,
                    status: b.status,
                    startTime: b.start_time ? new Date(b.start_time).getTime() : prev.startTime
                }) : null);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [vattleId]);

    if (loading) return null;
    if (!vattle) return <div className="p-4 text-red-500 bg-black/50">Vattle Not Found</div>;

    return (
        <div className="fixed inset-0 pointer-events-none p-6 flex flex-col items-start font-orbitron">
            <div className="bg-black/60 backdrop-blur-md border border-purple-500/50 p-4 rounded-xl shadow-2xl animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs tracking-widest text-purple-300 uppercase font-bold">Live Vattle</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{vattle.theme}</h2>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-300">
                        <span className="text-teal-400">{vattle.creatorName}</span>
                        <span className="mx-2 text-gray-500">vs</span>
                        <span className="text-red-400">{vattle.opponent === 'ai' ? 'AI Agent' : vattle.invitedOpponent}</span>
                    </div>
                    {vattle.startTime && vattle.status === 'active' && (
                        <div className="pl-4 border-l border-gray-700">
                            <BattleTimer startTime={vattle.startTime} timeLimit={vattle.timeLimit} size="sm" />
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default LiveStatsOverlay;
