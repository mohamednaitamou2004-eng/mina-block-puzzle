// === MINA Block Puzzle - Local Storage Hook ===

import { useCallback } from 'react';
import { GameSettings, ThemeName } from '../types/game';

const STORAGE_KEYS = {
  HIGH_SCORE: 'mina_high_score',
  SETTINGS: 'mina_settings',
  SCORES_HISTORY: 'mina_scores_history',
  ACHIEVEMENTS: 'mina_achievements',
  STATS: 'mina_stats',
  SAVED_GAME: 'mina_saved_game',
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  theme: 'classic' as ThemeName,
  tutorialSeen: false,
};

export function useStorage() {
  const getHighScore = useCallback((): number => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  }, []);

  const setHighScore = useCallback((score: number) => {
    try {
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(score));
    } catch { /* ignore */ }
  }, []);

  const getSettings = useCallback((): GameSettings => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (val) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(val) };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }, []);

  const saveSettings = useCallback((settings: GameSettings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch { /* ignore */ }
  }, []);

  const getScoresHistory = useCallback((): { score: number; date: number }[] => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SCORES_HISTORY);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  }, []);

  const addScoreToHistory = useCallback((score: number) => {
    try {
      const history = getScoresHistory();
      history.push({ score, date: Date.now() });
      history.sort((a, b) => b.score - a.score);
      const top20 = history.slice(0, 20);
      localStorage.setItem(STORAGE_KEYS.SCORES_HISTORY, JSON.stringify(top20));
    } catch { /* ignore */ }
  }, [getScoresHistory]);

  const getUnlockedAchievements = useCallback((): string[] => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  }, []);

  const unlockAchievement = useCallback((id: string): boolean => {
    try {
      const unlocked = getUnlockedAchievements();
      if (unlocked.includes(id)) return false;
      unlocked.push(id);
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(unlocked));
      return true;
    } catch {
      return false;
    }
  }, [getUnlockedAchievements]);

  const saveGame = useCallback((gameData: any) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_GAME, JSON.stringify(gameData));
    } catch { /* ignore */ }
  }, []);

  const loadGame = useCallback((): any | null => {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SAVED_GAME);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  }, []);

  const clearSavedGame = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SAVED_GAME);
    } catch { /* ignore */ }
  }, []);

  return {
    getHighScore,
    setHighScore,
    getSettings,
    saveSettings,
    getScoresHistory,
    addScoreToHistory,
    getUnlockedAchievements,
    unlockAchievement,
    saveGame,
    loadGame,
    clearSavedGame,
  };
}
