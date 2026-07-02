// === MINA Block Puzzle - Home Screen ===

import React from 'react';
import { Screen } from '../types/game';

interface HomeScreenProps {
  highScore: number;
  hasSavedGame: boolean;
  onNavigate: (screen: Screen) => void;
  onNewGame: () => void;
  onContinueGame: () => void;
  playButton: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  highScore,
  hasSavedGame,
  onNavigate,
  onNewGame,
  onContinueGame,
  playButton,
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0e1a 0%, #1a1040 50%, #0f0e1a 100%)' }}
    >
      {/* Background orbs */}
      <div className="absolute w-72 h-72 rounded-full bg-orb opacity-15"
        style={{
          background: 'radial-gradient(circle, #ff6b9d 0%, transparent 70%)',
          top: '5%',
          right: '-10%',
          filter: 'blur(50px)',
        }}
      />
      <div className="absolute w-60 h-60 rounded-full bg-orb opacity-10"
        style={{
          background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)',
          bottom: '10%',
          left: '-5%',
          filter: 'blur(40px)',
          animationDelay: '-4s',
        }}
      />

      <div className="animate-fadeInDown flex flex-col items-center mb-8">
        {/* Logo */}
        <div className="w-24 h-24 mb-5 rounded-3xl flex items-center justify-center animate-float"
          style={{
            background: 'linear-gradient(135deg, #ff6b9d, #c084fc)',
            boxShadow: '0 6px 30px rgba(255, 107, 157, 0.35)',
          }}
        >
          <div className="grid grid-cols-3 gap-1 p-1">
            {[1,1,0,0,1,1,1,1,1].map((filled, i) => (
              <div key={i} className={`w-5 h-5 rounded-sm ${filled ? 'bg-white/90' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        <h1 className="text-6xl font-black tracking-wider shimmer-text mb-2">MINA</h1>
        <p className="text-sm font-medium tracking-widest uppercase" style={{ color: 'rgba(226,224,255,0.4)' }}>
          Block Puzzle
        </p>
      </div>

      {/* High Score */}
      {highScore > 0 && (
        <div className="animate-fadeIn glass rounded-2xl px-6 py-3 mb-8 flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="text-xs uppercase tracking-wider" style={{ color: '#8b88b0' }}>Meilleur score</p>
            <p className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{highScore.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="animate-fadeInUp flex flex-col items-center gap-4 w-64">
        {hasSavedGame && (
          <button
            className="btn-primary w-full text-center flex items-center justify-center gap-2"
            onClick={() => { playButton(); onContinueGame(); }}
          >
            ▶️ Continuer
          </button>
        )}

        <button
          className="btn-primary w-full text-center flex items-center justify-center gap-2"
          style={hasSavedGame ? {
            background: 'linear-gradient(135deg, #60a5fa, #c084fc)',
            boxShadow: '0 4px 20px rgba(96, 165, 250, 0.3)',
          } : {}}
          onClick={() => { playButton(); onNewGame(); }}
        >
          🎮 {hasSavedGame ? 'Nouvelle partie' : 'Jouer'}
        </button>

        <div className="flex gap-3 mt-2 w-full">
          <button
            className="btn-secondary flex-1 text-center text-sm flex items-center justify-center gap-1.5"
            onClick={() => { playButton(); onNavigate('highscores'); }}
          >
            🏆 Scores
          </button>
          <button
            className="btn-secondary flex-1 text-center text-sm flex items-center justify-center gap-1.5"
            onClick={() => { playButton(); onNavigate('achievements'); }}
          >
            ⭐ Succès
          </button>
        </div>

        <button
          className="btn-secondary w-full text-center text-sm flex items-center justify-center gap-1.5"
          onClick={() => { playButton(); onNavigate('settings'); }}
        >
          ⚙️ Paramètres
        </button>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-xs" style={{ color: 'rgba(139,136,176,0.5)' }}>
        v1.0 — Fait avec ❤️
      </p>
    </div>
  );
};
