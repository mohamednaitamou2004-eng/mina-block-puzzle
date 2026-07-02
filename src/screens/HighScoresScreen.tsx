// === MINA Block Puzzle - High Scores Screen ===

import React from 'react';
import { Screen } from '../types/game';

interface HighScoresScreenProps {
  scores: { score: number; date: number }[];
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
  playButton: () => void;
}

export const HighScoresScreen: React.FC<HighScoresScreenProps> = ({
  scores,
  onBack,
  playButton,
}) => {
  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const getMedalEmoji = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}.`;
    }
  };

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
        <h1 className="text-2xl font-black" style={{ color: '#e2e0ff' }}>🏆 Meilleurs Scores</h1>
      </div>

      {/* Scores list */}
      <div className="flex-1 w-full max-w-md px-4 py-4 overflow-y-auto" style={{ touchAction: 'pan-y' }}>
        {scores.length === 0 ? (
          <div className="animate-fadeIn text-center mt-20">
            <p className="text-6xl mb-4">🎮</p>
            <p className="text-lg font-semibold" style={{ color: '#e2e0ff' }}>Aucun score encore</p>
            <p className="text-sm mt-2" style={{ color: '#8b88b0' }}>Joue une partie pour voir tes scores ici !</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {scores.map((entry, index) => (
              <div
                key={index}
                className="animate-fadeInUp glass rounded-xl px-4 py-3 flex items-center gap-3"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  background: index === 0
                    ? 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.05))'
                    : index === 1
                      ? 'linear-gradient(135deg, rgba(192,192,192,0.08), rgba(192,192,192,0.03))'
                      : index === 2
                        ? 'linear-gradient(135deg, rgba(205,127,50,0.08), rgba(205,127,50,0.03))'
                        : undefined,
                  border: index === 0 ? '1px solid rgba(251,191,36,0.2)' : undefined,
                }}
              >
                <span className="text-2xl w-10 text-center">{getMedalEmoji(index)}</span>
                <div className="flex-1">
                  <p className="text-xl font-bold" style={{ color: index === 0 ? '#fbbf24' : '#e2e0ff' }}>
                    {entry.score.toLocaleString()}
                  </p>
                </div>
                <p className="text-xs" style={{ color: '#8b88b0' }}>{formatDate(entry.date)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
