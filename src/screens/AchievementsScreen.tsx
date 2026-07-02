// === MINA Block Puzzle - Achievements Screen ===

import React from 'react';
import { ACHIEVEMENTS } from '../constants/themes';

interface AchievementsScreenProps {
  unlockedIds: string[];
  onBack: () => void;
  playButton: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  unlockedIds,
  onBack,
  playButton,
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0e1a 0%, #1a1040 50%, #0f0e1a 100%)' }}
    >
      {/* Header */}
      <div className="w-full max-w-md px-4 pt-4 pb-2 flex items-center gap-3 animate-fadeInDown">
        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          onClick={() => { playButton(); onBack(); }}
        >
          <span className="text-lg">←</span>
        </button>
        <h1 className="text-2xl font-black" style={{ color: '#e2e0ff' }}>⭐ Succès</h1>
        <span className="ml-auto text-sm font-semibold px-3 py-1 rounded-full"
          style={{ background: 'rgba(192,132,252,0.15)', color: '#c084fc' }}
        >
          {unlockedIds.length}/{ACHIEVEMENTS.length}
        </span>
      </div>

      {/* Achievements list */}
      <div className="flex-1 w-full max-w-md px-4 py-4 overflow-y-auto" style={{ touchAction: 'pan-y' }}>
        <div className="flex flex-col gap-2">
          {ACHIEVEMENTS.map((achievement, index) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className="animate-fadeInUp glass rounded-xl px-4 py-3 flex items-center gap-3"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  opacity: isUnlocked ? 1 : 0.5,
                  background: isUnlocked
                    ? 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(52,211,153,0.03))'
                    : undefined,
                  border: isUnlocked ? '1px solid rgba(52,211,153,0.15)' : undefined,
                }}
              >
                <span className="text-3xl">{isUnlocked ? achievement.icon : '🔒'}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: isUnlocked ? '#34d399' : '#8b88b0' }}>
                    {achievement.name}
                  </p>
                  <p className="text-xs" style={{ color: '#8b88b0' }}>{achievement.description}</p>
                </div>
                {isUnlocked && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}
                  >
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
