
import { VattleConfig } from '../types';

const STORAGE_KEY = 'vattles_local_db';

export const getLocalBattles = (): VattleConfig[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveLocalBattle = (vattle: VattleConfig) => {
    const current = getLocalBattles();
    const updated = [vattle, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};

export const updateLocalBattle = (id: string, updates: Partial<VattleConfig>) => {
    const current = getLocalBattles();
    const updated = current.map(v => v.id === id ? { ...v, ...updates } : v);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};
