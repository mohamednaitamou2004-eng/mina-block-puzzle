// === MINA Block Puzzle - Game Over Screen ===

import React, { useEffect, useState } from 'react';
import { Screen } from '../types/game';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  totalLinesCleared: number;
  level: number;
  onNewGame: () => void;
  onNavigate: (screen: Screen) => void;
  playButton: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  isNewHighScore,
  totalLinesCleared,
  level,
  onNewGame,
  onNavigate,
  playButton,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40"
      style={{ background: 'rgba(15, 14, 26, 0.95)', backdropFilter: 'blur(15px)' }}
    >
      {showContent && (
        <div className="animate-scaleIn flex flex-col items-center w-80 px-4">
          {/* New High Score badge */}
          {isNewHighScore && (
            <div className="animate-float mb-4 px-5 py-2 rounded-full font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#1a1a2e',
                boxShadow: '0 4px 20px rgba(251,191,36,0.4)',
              }}
            >
              🏆 Nouveau record !
            </div>
          )}

          {/* Title */}
          <h2 className="text-4xl font-black mb-1" style={{ color: '#e2e0ff' }}>Game Over</h2>
          <p className="text-sm mb-6" style={{ color: '#8b88b0' }}>Bien joué ! 👏</p>

          {/* Score card */}
          <div className="glass rounded-2xl p-5 w-full mb-6">
            <div className="text-center mb-4">
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#8b88b0' }}>Score final</p>
              <p className="text-5xl font-black shimmer-text">{score.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-lg font-bold" style={{ color: '#fbbf24' }}>🏆</p>
                <p className="text-sm font-bold" style={{ color: '#e2e0ff' }}>{highScore.toLocaleString()}</p>
                <p className="text-xs" style={{ color: '#8b88b0' }}>Record</p>
              </div>
              <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-lg font-bold">📊</p>
                <p className="text-sm font-bold" style={{ color: '#e2e0ff' }}>{totalLinesCleared}</p>
                <p className="text-xs" style={{ color: '#8b88b0' }}>Lignes</p>
              </div>
              <div className="text-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-lg font-bold">⭐</p>
                <p className="text-sm font-bold" style={{ color: '#e2e0ff' }}>{level}</p>
                <p className="text-xs" style={{ color: '#8b88b0' }}>Niveau</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <button className="btn-primary w-full text-center text-lg" onClick={() => { playButton(); onNewGame(); }}>
              🔄 Rejouer
            </button>
            <button className="btn-secondary w-full text-center" onClick={() => { playButton(); onNavigate('highscores'); }}>
              🏆 Meilleurs scores
            </button>
            <button className="btn-secondary w-full text-center" onClick={() => { playButton(); onNavigate('home'); }}>
              🏠 Menu principal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
