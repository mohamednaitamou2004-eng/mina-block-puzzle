// === MINA Block Puzzle - Pause Screen ===

import React from 'react';
import { Screen } from '../types/game';

interface PauseScreenProps {
  score: number;
  onResume: () => void;
  onNavigate: (screen: Screen) => void;
  onNewGame: () => void;
  playButton: () => void;
}

export const PauseScreen: React.FC<PauseScreenProps> = ({
  score,
  onResume,
  onNavigate,
  onNewGame,
  playButton,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40"
      style={{ background: 'rgba(15, 14, 26, 0.92)', backdropFilter: 'blur(10px)' }}
    >
      <div className="animate-scaleIn flex flex-col items-center w-72">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: 'linear-gradient(135deg, #c084fc, #60a5fa)',
            boxShadow: '0 4px 20px rgba(192,132,252,0.3)',
          }}
        >
          <span className="text-3xl">⏸</span>
        </div>

        <h2 className="text-3xl font-black mb-2" style={{ color: '#e2e0ff' }}>Pause</h2>
        <p className="text-sm mb-6" style={{ color: '#8b88b0' }}>
          Score actuel : <span className="font-bold" style={{ color: '#fbbf24' }}>{score.toLocaleString()}</span>
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button className="btn-primary w-full text-center" onClick={() => { playButton(); onResume(); }}>
            ▶️ Reprendre
          </button>
          <button className="btn-secondary w-full text-center" onClick={() => { playButton(); onNewGame(); }}>
            🔄 Nouvelle partie
          </button>
          <button className="btn-secondary w-full text-center" onClick={() => { playButton(); onNavigate('settings'); }}>
            ⚙️ Paramètres
          </button>
          <button className="btn-secondary w-full text-center" onClick={() => { playButton(); onNavigate('home'); }}>
            🏠 Menu principal
          </button>
        </div>
      </div>
    </div>
  );
};
