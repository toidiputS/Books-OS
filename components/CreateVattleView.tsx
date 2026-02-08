
import React, { useState, useEffect } from 'react';
import { VattleConfig } from '../types';
import { SparklesIcon, RefreshIcon } from './icons';
import { VATTLE_THEMES } from '../lib/themes';

interface CreateVattleViewProps {
  onCreate: (vattleConfig: Omit<VattleConfig, 'id' | 'status' | 'startTime' | 'creatorName'>) => void;
  onClose: () => void;
  isCoach: boolean;
}

const CreateVattleView: React.FC<CreateVattleViewProps> = ({ onCreate, onClose, isCoach }) => {
  const [theme, setTheme] = useState('');
  const [invitedOpponent, setInvitedOpponent] = useState('');
  const [studentName, setStudentName] = useState('');
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [opponentType, setOpponentType] = useState<'player' | 'ai'>('player');
  const [vattleMode, setVattleMode] = useState<'standard' | 'coaching'>('standard');
  const [battleType, setBattleType] = useState<'standard' | 'quick'>('standard');
  const [isRandomTheme, setIsRandomTheme] = useState(false);

  // Default to random for quick battles
  useEffect(() => {
    if (battleType === 'quick') {
      setIsRandomTheme(true);
    }
  }, [battleType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalTheme = theme.trim();

    if (isRandomTheme) {
      finalTheme = "RANDOM_SECRET";
    }

    if (!isRandomTheme && !finalTheme) {
      alert("Please provide a theme or select random.");
      return;
    }

    if (vattleMode === 'coaching' && !studentName.trim()) {
      alert("Please provide a student's username.");
      return;
    }

    // Force 1 minute for quick battles, otherwise use selected timeLimit
    const finalTimeLimit = battleType === 'quick' ? 1 : timeLimit;

    onCreate({
      theme: finalTheme,
      invitedOpponent: vattleMode === 'coaching' ? studentName : (opponentType === 'ai' ? 'AI Opponent' : invitedOpponent || 'Open Invite'),
      timeLimit: finalTimeLimit,
      opponent: opponentType,
      mode: vattleMode,
      studentName: vattleMode === 'coaching' ? studentName : undefined,
    });
  };

  const inputStyles = "w-full bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Battle Type Toggle */}
      <div>
        <label className="block text-sm font-medium text-purple-300 mb-2 font-orbitron">Battle Type</label>
        <div className="flex gap-4">
          <button type="button" onClick={() => setBattleType('standard')} className={`flex-1 py-3 rounded-md text-sm font-semibold transition-all border ${battleType === 'standard' ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/40' : 'bg-gray-700/50 text-gray-400 border-gray-600 hover:bg-gray-600/50'}`}>
            Standard Battle
          </button>
          <button type="button" onClick={() => setBattleType('quick')} className={`flex-1 py-3 rounded-md text-sm font-semibold transition-all border flex items-center justify-center gap-2 ${battleType === 'quick' ? 'bg-yellow-600 text-white border-yellow-400 shadow-lg shadow-yellow-900/40' : 'bg-gray-700/50 text-gray-400 border-gray-600 hover:bg-gray-600/50'}`}>
            <span>⚡</span> Quick Battle (60s)
          </button>
        </div>
      </div>

      {isCoach && (
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2 font-orbitron">Session Type</label>
          <div className="flex gap-4">
            <button type="button" onClick={() => setVattleMode('standard')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${vattleMode === 'standard' ? 'bg-purple-600 text-white' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>
              Standard Vattle
            </button>
            <button type="button" onClick={() => setVattleMode('coaching')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${vattleMode === 'coaching' ? 'bg-blue-600 text-white' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>
              Coaching Session
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="theme" className="block text-sm font-medium text-purple-300 font-orbitron">
            {vattleMode === 'coaching' ? 'Session Theme' : 'Vattle Theme'}
          </label>
          <button
            type="button"
            onClick={() => setIsRandomTheme(!isRandomTheme)}
            className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded transition-all font-bold ${isRandomTheme ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}
          >
            <RefreshIcon className={`h-3 w-3 ${isRandomTheme ? 'animate-spin-slow' : ''}`} />
            {isRandomTheme ? 'RANDOM MODE ON' : 'ENABLE RANDOM'}
          </button>
        </div>

        <div className="relative group">
          <input
            list="theme-pool"
            type="text"
            id="theme"
            value={isRandomTheme ? '' : theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder={isRandomTheme ? "?? Surprise Random Theme ??" : "e.g., Retro Arcade Game"}
            className={`${inputStyles} ${isRandomTheme ? 'opacity-50 cursor-not-allowed border-purple-500/50 italic text-purple-200' : 'group-hover:border-gray-500'}`}
            required={!isRandomTheme}
            disabled={isRandomTheme}
            autoComplete="off"
          />
          {!isRandomTheme && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
              <SparklesIcon className="h-4 w-4 text-purple-400" />
            </div>
          )}
          <datalist id="theme-pool">
            {VATTLE_THEMES.map((t, idx) => (
              <option key={idx} value={t} />
            ))}
          </datalist>
        </div>
        <p className="mt-1.5 text-[10px] text-gray-500 italic">
          {isRandomTheme ? "The theme will be randomly selected and revealed when the battle begins." : "Select from our diverse library of 50+ themes or enter your own."}
        </p>
      </div>

      {vattleMode === 'standard' && (
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2 font-orbitron">Opponent</label>
          <div className="flex gap-4">
            <button type="button" onClick={() => setOpponentType('player')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${opponentType === 'player' ? 'bg-purple-600 text-white' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>
              Challenge Player
            </button>
            <button type="button" onClick={() => setOpponentType('ai')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${opponentType === 'ai' ? 'bg-purple-600 text-white' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>
              Challenge AI
            </button>
          </div>
        </div>
      )}

      {vattleMode === 'standard' && opponentType === 'player' && (
        <div>
          <label htmlFor="opponent" className="block text-sm font-medium text-purple-300 mb-2 font-orbitron">Opponent's Username</label>
          <input type="text" id="opponent" value={invitedOpponent} onChange={(e) => setInvitedOpponent(e.target.value)} placeholder="Leave blank for an open challenge" className={inputStyles} />
        </div>
      )}

      {vattleMode === 'coaching' && (
        <div>
          <label htmlFor="student" className="block text-sm font-medium text-purple-300 mb-2 font-orbitron">Student's Username</label>
          <input type="text" id="student" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Enter student's username" className={inputStyles} required />
        </div>
      )}

      <div>
        <label htmlFor="timeLimit" className="block text-sm font-medium text-purple-300 mb-2 font-orbitron">Time Limit</label>
        {battleType === 'quick' ? (
          <div className="w-full bg-yellow-900/20 border border-yellow-500/50 rounded-md px-4 py-3 text-yellow-300 flex items-center gap-2 animate-pulse">
            <SparklesIcon className="h-5 w-5" />
            <span className="font-bold font-orbitron">⚡ QUICK BATTLE - 60 Seconds</span>
          </div>
        ) : (
          <select id="timeLimit" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className={inputStyles}>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
          </select>
        )}
      </div>

      <div className="group relative">
        <button
          type="submit"
          className={`w-full py-4 mt-2 font-orbitron text-lg font-bold rounded-lg transition-all duration-300 shadow-xl ${battleType === 'quick' ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-500/30 hover:shadow-yellow-500/50' : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-500/30 hover:shadow-teal-500/50'}`}
        >
          {vattleMode === 'coaching' ? 'Start Coaching Session' : (battleType === 'quick' ? 'Start Quick Battle' : 'Request Battle')}
        </button>
      </div>
    </form>
  );
};

export default CreateVattleView;

