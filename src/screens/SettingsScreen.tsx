// === MINA Block Puzzle - Settings Screen ===

import React from 'react';
import { GameSettings, ThemeName } from '../types/game';
import { THEMES } from '../constants/themes';

interface SettingsScreenProps {
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  onBack: () => void;
  playButton: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onBack,
  playButton,
}) => {
  const toggle = (key: keyof GameSettings) => {
    playButton();
    onUpdateSettings({ ...settings, [key]: !settings[key] });
  };

  const setTheme = (theme: ThemeName) => {
    playButton();
    onUpdateSettings({ ...settings, theme });
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
        <h1 className="text-2xl font-black" style={{ color: '#e2e0ff' }}>⚙️ Paramètres</h1>
      </div>

      {/* Settings */}
      <div className="flex-1 w-full max-w-md px-4 py-6 overflow-y-auto" style={{ touchAction: 'pan-y' }}>
        <div className="flex flex-col gap-3">
          {/* Sound */}
          <div className="glass rounded-xl px-5 py-4 flex items-center justify-between animate-fadeInUp"
            style={{ animationDelay: '0.05s' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔊</span>
              <div>
                <p className="font-semibold" style={{ color: '#e2e0ff' }}>Sons</p>
                <p className="text-xs" style={{ color: '#8b88b0' }}>Effets sonores du jeu</p>
              </div>
            </div>
            <button
              className="w-14 h-8 rounded-full relative transition-all duration-300"
              style={{
                background: settings.soundEnabled
                  ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
                  : 'rgba(255,255,255,0.1)',
              }}
              onClick={() => toggle('soundEnabled')}
            >
              <div className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300"
                style={{ left: settings.soundEnabled ? '30px' : '4px' }}
              />
            </button>
          </div>

          {/* Music */}
          <div className="glass rounded-xl px-5 py-4 flex items-center justify-between animate-fadeInUp"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎵</span>
              <div>
                <p className="font-semibold" style={{ color: '#e2e0ff' }}>Musique</p>
                <p className="text-xs" style={{ color: '#8b88b0' }}>Musique d'ambiance</p>
              </div>
            </div>
            <button
              className="w-14 h-8 rounded-full relative transition-all duration-300"
              style={{
                background: settings.musicEnabled
                  ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
                  : 'rgba(255,255,255,0.1)',
              }}
              onClick={() => toggle('musicEnabled')}
            >
              <div className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300"
                style={{ left: settings.musicEnabled ? '30px' : '4px' }}
              />
            </button>
          </div>

          {/* Vibration */}
          <div className="glass rounded-xl px-5 py-4 flex items-center justify-between animate-fadeInUp"
            style={{ animationDelay: '0.15s' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📳</span>
              <div>
                <p className="font-semibold" style={{ color: '#e2e0ff' }}>Vibrations</p>
                <p className="text-xs" style={{ color: '#8b88b0' }}>Retour haptique</p>
              </div>
            </div>
            <button
              className="w-14 h-8 rounded-full relative transition-all duration-300"
              style={{
                background: settings.vibrationEnabled
                  ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
                  : 'rgba(255,255,255,0.1)',
              }}
              onClick={() => toggle('vibrationEnabled')}
            >
              <div className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300"
                style={{ left: settings.vibrationEnabled ? '30px' : '4px' }}
              />
            </button>
          </div>

          {/* Theme */}
          <div className="glass rounded-xl px-5 py-4 animate-fadeInUp"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎨</span>
              <p className="font-semibold" style={{ color: '#e2e0ff' }}>Thème</p>
            </div>
            <div className="flex gap-2">
              {(Object.keys(THEMES) as ThemeName[]).map(themeName => {
                const theme = THEMES[themeName];
                const isActive = settings.theme === themeName;
                return (
                  <button
                    key={themeName}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
                        : 'rgba(255,255,255,0.06)',
                      color: isActive ? '#fff' : '#8b88b0',
                      border: isActive ? 'none' : '1px solid rgba(255,255,255,0.06)',
                    }}
                    onClick={() => setTheme(themeName)}
                  >
                    {theme.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tutorial */}
          <button
            className="glass rounded-xl px-5 py-4 flex items-center gap-3 w-full text-left animate-fadeInUp"
            style={{ animationDelay: '0.25s' }}
            onClick={() => {
              playButton();
              onUpdateSettings({ ...settings, tutorialSeen: false });
            }}
          >
            <span className="text-2xl">📖</span>
            <div>
              <p className="font-semibold" style={{ color: '#e2e0ff' }}>Revoir le tutoriel</p>
              <p className="text-xs" style={{ color: '#8b88b0' }}>Apprendre les bases du jeu</p>
            </div>
          </button>
        </div>

        {/* Version */}
        <p className="text-center mt-8 text-xs" style={{ color: 'rgba(139,136,176,0.4)' }}>
          MINA Block Puzzle v1.0<br />
          Fait avec ❤️
        </p>
      </div>
    </div>
  );
};
