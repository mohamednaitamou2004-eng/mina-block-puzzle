// === MINA Block Puzzle - Block Definitions ===

import { BlockShape } from '../types/game';

// Block colors (index 1-7) - mapped to CSS classes
export const BLOCK_COLORS: Record<number, { bg: string; border: string; glow: string; name: string }> = {
  1: {
    bg: 'linear-gradient(135deg, #ff6b9d, #ff4777)',
    border: '#ff8ab5',
    glow: 'rgba(255, 107, 157, 0.5)',
    name: 'Rose',
  },
  2: {
    bg: 'linear-gradient(135deg, #c084fc, #a855f7)',
    border: '#d4a0ff',
    glow: 'rgba(192, 132, 252, 0.5)',
    name: 'Violet',
  },
  3: {
    bg: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    border: '#85bbff',
    glow: 'rgba(96, 165, 250, 0.5)',
    name: 'Bleu',
  },
  4: {
    bg: 'linear-gradient(135deg, #34d399, #10b981)',
    border: '#5ee8b5',
    glow: 'rgba(52, 211, 153, 0.5)',
    name: 'Vert',
  },
  5: {
    bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    border: '#fcd34d',
    glow: 'rgba(251, 191, 36, 0.5)',
    name: 'Or',
  },
  6: {
    bg: 'linear-gradient(135deg, #fb923c, #f97316)',
    border: '#fdba74',
    glow: 'rgba(251, 146, 60, 0.5)',
    name: 'Orange',
  },
  7: {
    bg: 'linear-gradient(135deg, #f472b6, #ec4899)',
    border: '#f9a8d4',
    glow: 'rgba(244, 114, 182, 0.5)',
    name: 'Pink',
  },
};

export const GRID_SIZE = 9;

// All possible block shapes
const BLOCK_TEMPLATES: { shape: number[][] }[] = [
  // Single
  { shape: [[1]] },
  // Line 2
  { shape: [[1, 1]] },
  { shape: [[1], [1]] },
  // Line 3
  { shape: [[1, 1, 1]] },
  { shape: [[1], [1], [1]] },
  // Line 4
  { shape: [[1, 1, 1, 1]] },
  { shape: [[1], [1], [1], [1]] },
  // Line 5
  { shape: [[1, 1, 1, 1, 1]] },
  { shape: [[1], [1], [1], [1], [1]] },
  // Square 2x2
  { shape: [[1, 1], [1, 1]] },
  // Square 3x3
  { shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] },
  // L shapes
  { shape: [[1, 0], [1, 0], [1, 1]] },
  { shape: [[0, 1], [0, 1], [1, 1]] },
  { shape: [[1, 1], [1, 0], [1, 0]] },
  { shape: [[1, 1], [0, 1], [0, 1]] },
  // L small
  { shape: [[1, 0], [1, 1]] },
  { shape: [[0, 1], [1, 1]] },
  { shape: [[1, 1], [1, 0]] },
  { shape: [[1, 1], [0, 1]] },
  // T shapes
  { shape: [[1, 1, 1], [0, 1, 0]] },
  { shape: [[0, 1, 0], [1, 1, 1]] },
  { shape: [[1, 0], [1, 1], [1, 0]] },
  { shape: [[0, 1], [1, 1], [0, 1]] },
  // S / Z shapes
  { shape: [[1, 0], [1, 1], [0, 1]] },
  { shape: [[0, 1], [1, 1], [1, 0]] },
  // Corner 3x3
  { shape: [[1, 1, 1], [1, 0, 0], [1, 0, 0]] },
  { shape: [[1, 1, 1], [0, 0, 1], [0, 0, 1]] },
  { shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]] },
  { shape: [[0, 0, 1], [0, 0, 1], [1, 1, 1]] },
  // Plus
  { shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]] },
  // Small diagonal pairs
  { shape: [[1, 0], [0, 1]] },
  { shape: [[0, 1], [1, 0]] },
];

let blockIdCounter = 0;

export function generateRandomBlock(): BlockShape {
  const template = BLOCK_TEMPLATES[Math.floor(Math.random() * BLOCK_TEMPLATES.length)];
  const colorIndex = Math.floor(Math.random() * 7) + 1;
  blockIdCounter++;
  return {
    id: `block-${blockIdCounter}-${Date.now()}`,
    shape: template.shape,
    colorIndex,
  };
}

export function generateBlockSet(): BlockShape[] {
  return [generateRandomBlock(), generateRandomBlock(), generateRandomBlock()];
}

export function getBlockWidth(block: BlockShape): number {
  return block.shape[0].length;
}

export function getBlockHeight(block: BlockShape): number {
  return block.shape.length;
}

export function getBlockCells(block: BlockShape): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = [];
  for (let r = 0; r < block.shape.length; r++) {
    for (let c = 0; c < block.shape[r].length; c++) {
      if (block.shape[r][c] === 1) {
        cells.push({ row: r, col: c });
      }
    }
  }
  return cells;
}
