// === MINA Block Puzzle - Types ===

export type CellState = number; // 0 = empty, 1-7 = block color index

export type Grid = CellState[][];

export interface Position {
  row: number;
  col: number;
}

export interface BlockShape {
  id: string;
  shape: number[][]; // 2D array, 1 = filled, 0 = empty
  colorIndex: number; // 1-7
}

export interface GameState {
  grid: Grid;
  score: number;
  highScore: number;
  currentBlocks: (BlockShape | null)[];
  isGameOver: boolean;
  combo: number;
  linesCleared: number;
  totalLinesCleared: number;
  level: number;
}

export interface ClearAnimation {
  rows: number[];
  cols: number[];
  timestamp: number;
}

export interface ScorePopup {
  id: number;
  value: number;
  x: number;
  y: number;
  timestamp: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export type ThemeName = 'classic' | 'night' | 'sunset';

export interface ThemeColors {
  name: string;
  label: string;
  bg: string;
  surface: string;
  card: string;
  gridBg: string;
  gridLine: string;
  text: string;
  muted: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  theme: ThemeName;
  tutorialSeen: boolean;
}

export type Screen =
  | 'splash'
  | 'home'
  | 'game'
  | 'pause'
  | 'gameover'
  | 'highscores'
  | 'settings'
  | 'tutorial'
  | 'achievements';
