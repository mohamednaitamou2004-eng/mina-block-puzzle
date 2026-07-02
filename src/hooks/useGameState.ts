// === MINA Block Puzzle - Core Game Logic ===

import { useState, useCallback, useRef } from 'react';
import { Grid, BlockShape, ClearAnimation, GameState } from '../types/game';
import { GRID_SIZE, generateBlockSet, getBlockCells } from '../constants/blocks';

function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

export function useGameState() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentBlocks, setCurrentBlocks] = useState<(BlockShape | null)[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [totalLinesCleared, setTotalLinesCleared] = useState(0);
  const [clearAnimation, setClearAnimation] = useState<ClearAnimation | null>(null);
  const [lastScoreGain, setLastScoreGain] = useState(0);
  const [level, setLevel] = useState(1);

  const comboRef = useRef(0);

  // Check if a block can be placed at a position
  const canPlaceBlock = useCallback((block: BlockShape, row: number, col: number, currentGrid?: Grid): boolean => {
    const g = currentGrid || grid;
    const cells = getBlockCells(block);
    for (const cell of cells) {
      const r = row + cell.row;
      const c = col + cell.col;
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
      if (g[r][c] !== 0) return false;
    }
    return true;
  }, [grid]);

  // Check if any block can be placed anywhere
  const canAnyBlockBePlaced = useCallback((blocks: (BlockShape | null)[], currentGrid: Grid): boolean => {
    for (const block of blocks) {
      if (!block) continue;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (canPlaceBlock(block, r, c, currentGrid)) return true;
        }
      }
    }
    return false;
  }, [canPlaceBlock]);

  // Find full rows and columns
  const findFullLines = useCallback((currentGrid: Grid): { rows: number[]; cols: number[] } => {
    const rows: number[] = [];
    const cols: number[] = [];

    for (let r = 0; r < GRID_SIZE; r++) {
      if (currentGrid[r].every(cell => cell !== 0)) {
        rows.push(r);
      }
    }

    for (let c = 0; c < GRID_SIZE; c++) {
      let full = true;
      for (let r = 0; r < GRID_SIZE; r++) {
        if (currentGrid[r][c] === 0) {
          full = false;
          break;
        }
      }
      if (full) cols.push(c);
    }

    return { rows, cols };
  }, []);

  // Place a block on the grid
  const placeBlock = useCallback((blockIndex: number, row: number, col: number): {
    success: boolean;
    linesCleared: number;
    comboLevel: number;
    scoreGained: number;
  } => {
    const block = currentBlocks[blockIndex];
    if (!block || !canPlaceBlock(block, row, col)) {
      return { success: false, linesCleared: 0, comboLevel: 0, scoreGained: 0 };
    }

    // Place the block
    const newGrid = grid.map(r => [...r]);
    const cells = getBlockCells(block);
    for (const cell of cells) {
      newGrid[row + cell.row][col + cell.col] = block.colorIndex;
    }

    // Score for placing blocks
    let scoreGained = cells.length;

    // Check for completed lines
    const { rows: fullRows, cols: fullCols } = findFullLines(newGrid);
    const totalCleared = fullRows.length + fullCols.length;

    // Calculate combo
    let newCombo = 0;
    if (totalCleared > 0) {
      newCombo = comboRef.current + 1;
      comboRef.current = newCombo;

      // Line clear bonus
      scoreGained += totalCleared * 10;

      // Multi-line bonus
      if (totalCleared >= 2) {
        scoreGained += totalCleared * 15;
      }
      if (totalCleared >= 3) {
        scoreGained += totalCleared * 25;
      }

      // Combo bonus
      if (newCombo >= 2) {
        scoreGained += newCombo * 20;
      }

      // Clear the lines
      for (const r of fullRows) {
        for (let c = 0; c < GRID_SIZE; c++) {
          newGrid[r][c] = 0;
        }
      }
      for (const c of fullCols) {
        for (let r = 0; r < GRID_SIZE; r++) {
          newGrid[r][c] = 0;
        }
      }

      // Show clear animation
      setClearAnimation({ rows: fullRows, cols: fullCols, timestamp: Date.now() });
      setTimeout(() => setClearAnimation(null), 600);
    } else {
      comboRef.current = 0;
      newCombo = 0;
    }

    // Update state
    setGrid(newGrid);
    const newScore = score + scoreGained;
    setScore(newScore);
    setLastScoreGain(scoreGained);
    setCombo(newCombo);
    setLinesCleared(totalCleared);
    setTotalLinesCleared(prev => prev + totalCleared);

    // Update level
    const newLevel = Math.floor(newScore / 200) + 1;
    setLevel(newLevel);

    // Update high score
    if (newScore > highScore) {
      setHighScore(newScore);
    }

    // Remove the placed block
    const newBlocks = [...currentBlocks];
    newBlocks[blockIndex] = null;

    // If all blocks used, generate new set
    const remainingBlocks = newBlocks.filter(b => b !== null);
    if (remainingBlocks.length === 0) {
      const newSet = generateBlockSet();
      setCurrentBlocks(newSet);

      // Check if game is over with new blocks
      if (!canAnyBlockBePlaced(newSet, newGrid)) {
        setIsGameOver(true);
      }
    } else {
      setCurrentBlocks(newBlocks);

      // Check if game is over with remaining blocks
      if (!canAnyBlockBePlaced(newBlocks, newGrid)) {
        setIsGameOver(true);
      }
    }

    return {
      success: true,
      linesCleared: totalCleared,
      comboLevel: newCombo,
      scoreGained,
    };
  }, [grid, currentBlocks, score, highScore, canPlaceBlock, findFullLines, canAnyBlockBePlaced]);

  // Start a new game
  const startNewGame = useCallback(() => {
    const newGrid = createEmptyGrid();
    const newBlocks = generateBlockSet();
    setGrid(newGrid);
    setScore(0);
    setCurrentBlocks(newBlocks);
    setIsGameOver(false);
    setCombo(0);
    comboRef.current = 0;
    setLinesCleared(0);
    setTotalLinesCleared(0);
    setClearAnimation(null);
    setLastScoreGain(0);
    setLevel(1);
  }, []);

  // Get game state for saving
  const getGameState = useCallback((): GameState => ({
    grid,
    score,
    highScore,
    currentBlocks,
    isGameOver,
    combo,
    linesCleared,
    totalLinesCleared,
    level,
  }), [grid, score, highScore, currentBlocks, isGameOver, combo, linesCleared, totalLinesCleared, level]);

  // Restore game state
  const restoreGameState = useCallback((state: GameState) => {
    setGrid(state.grid);
    setScore(state.score);
    setHighScore(state.highScore);
    setCurrentBlocks(state.currentBlocks);
    setIsGameOver(state.isGameOver);
    setCombo(state.combo);
    comboRef.current = state.combo;
    setLinesCleared(state.linesCleared);
    setTotalLinesCleared(state.totalLinesCleared);
    setLevel(state.level);
  }, []);

  return {
    grid,
    score,
    highScore,
    setHighScore,
    currentBlocks,
    isGameOver,
    combo,
    linesCleared,
    totalLinesCleared,
    clearAnimation,
    lastScoreGain,
    level,
    canPlaceBlock,
    placeBlock,
    startNewGame,
    getGameState,
    restoreGameState,
  };
}
