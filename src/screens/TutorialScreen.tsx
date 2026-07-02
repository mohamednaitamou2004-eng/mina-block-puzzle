// === MINA Block Puzzle - Tutorial Screen ===

import React, { useState } from 'react';

interface TutorialScreenProps {
  onFinish: () => void;
  playButton: () => void;
}

const tutorialSteps = [
  {
    emoji: '🎮',
    title: 'Bienvenue dans MINA !',
    description: 'Un jeu de puzzle de blocs relaxant et addictif. Place les blocs sur la grille pour marquer des points !',
  },
  {
    emoji: '🧩',
    title: 'Place les blocs',
    description: 'Glisse et dépose les blocs depuis le plateau du bas vers la grille. Choisis bien tes emplacements !',
  },
  {
    emoji: '✨',
    title: 'Complète des lignes',
    description: 'Quand une ligne ou une colonne est entièrement remplie, elle disparaît et tu gagnes des points !',
  },
  {
    emoji: '🔥',
    title: 'Fais des combos !',
    description: 'Enchaîne les suppressions de lignes pour multiplier tes points. Plus tu enchaînes, plus tu gagnes !',
  },
  {
    emoji: '🏆',
    title: 'Bats ton record !',
    description: 'La partie continue jusqu\'à ce qu\'aucun bloc ne puisse être placé. Essaie de battre ton meilleur score !',
  },
];

export const TutorialScreen: React.FC<TutorialScreenProps> = ({ onFinish, playButton }) => {
  const [step, setStep] = useState(0);
  const current = tutorialSteps[step];

  const next = () => {
    playButton();
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const skip = () => {
    playButton();
    onFinish();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: 'rgba(15, 14, 26, 0.96)', backdropFilter: 'blur(15px)' }}
    >
      <div className="animate-scaleIn flex flex-col items-center w-80 px-4">
        {/* Step indicator */}
        <div className="flex gap-2 mb-8">
          {tutorialSteps.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 28 : 12,
                background: i === step
                  ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
                  : i < step
                    ? '#c084fc'
                    : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div key={step} className="animate-fadeIn flex flex-col items-center text-center">
          <span className="text-7xl mb-6 block animate-float">{current.emoji}</span>
          <h2 className="text-2xl font-black mb-3" style={{ color: '#e2e0ff' }}>{current.title}</h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#8b88b0' }}>{current.description}</p>
        </div>

        {/* Buttons */}
        <button className="btn-primary w-full text-center mb-3" onClick={next}>
          {step < tutorialSteps.length - 1 ? 'Suivant →' : 'Commencer à jouer ! 🎮'}
        </button>

        {step < tutorialSteps.length - 1 && (
          <button
            className="text-sm font-medium py-2"
            style={{ color: '#8b88b0' }}
            onClick={skip}
          >
            Passer le tutoriel
          </button>
        )}
      </div>
    </div>
  );
};
