// === MINA Block Puzzle - Audio System ===
// Uses Web Audio API to generate sounds procedurally (no external files needed)

import { useCallback, useRef } from 'react';

export function useAudio(soundEnabled: boolean, vibrationEnabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch { /* ignore audio errors */ }
  }, [soundEnabled, getAudioCtx]);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!vibrationEnabled) return;
    try {
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch { /* ignore */ }
  }, [vibrationEnabled]);

  const playPlace = useCallback(() => {
    playTone(520, 0.12, 'sine', 0.12);
    setTimeout(() => playTone(680, 0.1, 'sine', 0.08), 50);
    vibrate(15);
  }, [playTone, vibrate]);

  const playClear = useCallback((count: number = 1) => {
    const baseFreq = 440;
    for (let i = 0; i < Math.min(count + 1, 5); i++) {
      setTimeout(() => {
        playTone(baseFreq + i * 120, 0.25, 'sine', 0.12);
      }, i * 80);
    }
    vibrate(count > 1 ? [30, 50, 30] : 25);
  }, [playTone, vibrate]);

  const playCombo = useCallback((level: number) => {
    const freqs = [523, 659, 784, 1047];
    freqs.slice(0, Math.min(level + 1, 4)).forEach((f, i) => {
      setTimeout(() => playTone(f, 0.3, 'sine', 0.1), i * 100);
    });
    vibrate([20, 40, 20, 40, 30]);
  }, [playTone, vibrate]);

  const playGameOver = useCallback(() => {
    playTone(440, 0.3, 'sine', 0.1);
    setTimeout(() => playTone(370, 0.3, 'sine', 0.1), 200);
    setTimeout(() => playTone(330, 0.5, 'sine', 0.1), 400);
    vibrate([50, 100, 50]);
  }, [playTone, vibrate]);

  const playButton = useCallback(() => {
    playTone(600, 0.08, 'sine', 0.08);
    vibrate(10);
  }, [playTone, vibrate]);

  const playAchievement = useCallback(() => {
    const melody = [523, 659, 784, 1047];
    melody.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.2, 'triangle', 0.12), i * 120);
    });
    vibrate([30, 50, 30, 50, 50]);
  }, [playTone, vibrate]);

  return {
    playPlace,
    playClear,
    playCombo,
    playGameOver,
    playButton,
    playAchievement,
  };
}
