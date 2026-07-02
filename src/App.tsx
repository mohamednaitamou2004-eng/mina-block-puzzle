// === MINA Block Puzzle - Main Application ===

import { useState, useEffect, useCallback, useRef } from 'react';
import { Screen, GameSettings } from './types/game';
import { ACHIEVEMENTS } from './constants/themes';
import { useGameState } from './hooks/useGameState';
import { useStorage } from './hooks/useStorage';
import { useAudio } from './hooks/useAudio';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { PauseScreen } from './screens/PauseScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { HighScoresScreen } from './screens/HighScoresScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TutorialScreen } from './screens/TutorialScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [previousScreen, setPreviousScreen] = useState<Screen>('home');
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    musicEnabled: true,
    vibrationEnabled: true,
    theme: 'classic',
    tutorialSeen: false,
  });
  const [achievementToast, setAchievementToast] = useState<string | null>(null);
  const [gameOverShown, setGameOverShown] = useState(false);
  const prevScoreRef = useRef(0);

  const storage = useStorage();
  const gameState = useGameState();
  const audio = useAudio(settings.soundEnabled, settings.vibrationEnabled);

  // Load settings and high score on mount
  useEffect(() => {
    const savedSettings = storage.getSettings();
    setSettings(savedSettings);
    const hs = storage.getHighScore();
    gameState.setHighScore(hs);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save settings when changed
  const updateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  }, [storage]);

  // Navigate between screens
  const navigateTo = useCallback((screen: Screen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  }, [currentScreen]);

  const goBack = useCallback(() => {
    setCurrentScreen(previousScreen);
  }, [previousScreen]);

  // Start new game
  const startNewGame = useCallback(() => {
    gameState.startNewGame();
    storage.clearSavedGame();
    setGameOverShown(false);
    prevScoreRef.current = 0;

    if (!settings.tutorialSeen) {
      setCurrentScreen('tutorial');
    } else {
      setCurrentScreen('game');
    }
  }, [gameState, storage, settings.tutorialSeen]);

  // Continue saved game
  const continueGame = useCallback(() => {
    const savedGame = storage.loadGame();
    if (savedGame) {
      gameState.restoreGameState(savedGame);
      setGameOverShown(false);
      setCurrentScreen('game');
    }
  }, [gameState, storage]);

  // Tutorial finish
  const onTutorialFinish = useCallback(() => {
    updateSettings({ ...settings, tutorialSeen: true });
    setCurrentScreen('game');
  }, [settings, updateSettings]);

  // Check achievements
  const checkAchievements = useCallback((score: number, totalLines: number, comboLevel: number, linesInOneMove: number) => {
    ACHIEVEMENTS.forEach(ach => {
      let shouldUnlock = false;
      switch (ach.type) {
        case 'lines':
          shouldUnlock = totalLines >= ach.target;
          break;
        case 'score':
          shouldUnlock = score >= ach.target;
          break;
        case 'combo':
          shouldUnlock = comboLevel >= ach.target;
          break;
        case 'multiClear':
          shouldUnlock = linesInOneMove >= ach.target;
          break;
      }
      if (shouldUnlock) {
        const isNew = storage.unlockAchievement(ach.id);
        if (isNew) {
          audio.playAchievement();
          setAchievementToast(`${ach.icon} ${ach.name}`);
          setTimeout(() => setAchievementToast(null), 3000);
        }
      }
    });
  }, [storage, audio]);

  // Auto-save game state periodically
  useEffect(() => {
    if (currentScreen === 'game' && !gameState.isGameOver) {
      const state = gameState.getGameState();
      storage.saveGame(state);
    }
  }, [gameState.grid, gameState.score, gameState.currentBlocks]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check for game over
  useEffect(() => {
    if (gameState.isGameOver && !gameOverShown && currentScreen === 'game') {
      // Save score
      if (gameState.score > 0) {
        storage.addScoreToHistory(gameState.score);
      }
      if (gameState.score > prevScoreRef.current) {
        const hs = storage.getHighScore();
        if (gameState.score > hs) {
          storage.setHighScore(gameState.score);
        }
      }
      storage.clearSavedGame();
      audio.playGameOver();

      setTimeout(() => {
        setGameOverShown(true);
        setCurrentScreen('gameover');
      }, 800);
    }
  }, [gameState.isGameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check achievements when score changes
  useEffect(() => {
    if (gameState.score > 0 && gameState.score !== prevScoreRef.current) {
      prevScoreRef.current = gameState.score;
      checkAchievements(
        gameState.score,
        gameState.totalLinesCleared,
        gameState.combo,
        gameState.linesCleared
      );
    }
  }, [gameState.score, gameState.totalLinesCleared, gameState.combo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Has saved game?
  const hasSavedGame = !!storage.loadGame();

  return (
    <div className="w-full h-full">
      {/* Splash */}
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={() => setCurrentScreen('home')} />
      )}

      {/* Home */}
      {currentScreen === 'home' && (
        <HomeScreen
          highScore={gameState.highScore}
          hasSavedGame={hasSavedGame}
          onNavigate={navigateTo}
          onNewGame={startNewGame}
          onContinueGame={continueGame}
          playButton={audio.playButton}
        />
      )}

      {/* Game */}
      {currentScreen === 'game' && (
        <GameScreen
          grid={gameState.grid}
          score={gameState.score}
          highScore={gameState.highScore}
          currentBlocks={gameState.currentBlocks}
          combo={gameState.combo}
          level={gameState.level}
          clearAnimation={gameState.clearAnimation}
          canPlaceBlock={gameState.canPlaceBlock}
          placeBlock={gameState.placeBlock}
          onNavigate={navigateTo}
          playPlace={audio.playPlace}
          playClear={audio.playClear}
          playCombo={audio.playCombo}
        />
      )}

      {/* Pause */}
      {currentScreen === 'pause' && (
        <PauseScreen
          score={gameState.score}
          onResume={() => setCurrentScreen('game')}
          onNavigate={navigateTo}
          onNewGame={startNewGame}
          playButton={audio.playButton}
        />
      )}

      {/* Game Over */}
      {currentScreen === 'gameover' && (
        <GameOverScreen
          score={gameState.score}
          highScore={Math.max(gameState.highScore, storage.getHighScore())}
          isNewHighScore={gameState.score >= storage.getHighScore() && gameState.score > 0}
          totalLinesCleared={gameState.totalLinesCleared}
          level={gameState.level}
          onNewGame={startNewGame}
          onNavigate={navigateTo}
          playButton={audio.playButton}
        />
      )}

      {/* High Scores */}
      {currentScreen === 'highscores' && (
        <HighScoresScreen
          scores={storage.getScoresHistory()}
          onNavigate={navigateTo}
          onBack={goBack}
          playButton={audio.playButton}
        />
      )}

      {/* Settings */}
      {currentScreen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={updateSettings}
          onBack={goBack}
          playButton={audio.playButton}
        />
      )}

      {/* Tutorial */}
      {currentScreen === 'tutorial' && (
        <TutorialScreen
          onFinish={onTutorialFinish}
          playButton={audio.playButton}
        />
      )}

      {/* Achievements */}
      {currentScreen === 'achievements' && (
        <AchievementsScreen
          unlockedIds={storage.getUnlockedAchievements()}
          onBack={goBack}
          playButton={audio.playButton}
        />
      )}

      {/* Achievement toast */}
      {achievementToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-fadeInDown">
          <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05))',
              border: '1px solid rgba(52,211,153,0.3)',
              boxShadow: '0 8px 30px rgba(52,211,153,0.2)',
            }}
          >
            <span className="text-sm font-bold" style={{ color: '#34d399' }}>
              Succès débloqué ! {achievementToast}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
