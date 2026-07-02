// === MINA Block Puzzle - Game Grid Component ===

import React, { useCallback } from 'react';
import { Grid as GridType, ClearAnimation } from '../types/game';
import { GRID_SIZE, BLOCK_COLORS } from '../constants/blocks';

interface GridProps {
  grid: GridType;
  clearAnimation: ClearAnimation | null;
  highlightCells: { row: number; col: number }[] | null;
  highlightValid: boolean;
  cellSize: number;
  onCellDrop?: (row: number, col: number) => void;
}

export const GameGrid: React.FC<GridProps> = ({
  grid,
  clearAnimation,
  highlightCells,
  highlightValid,
  cellSize,
}) => {
  const gap = 2;
  const gridPixelSize = GRID_SIZE * cellSize + (GRID_SIZE + 1) * gap;

  const isCellClearing = useCallback((row: number, col: number): boolean => {
    if (!clearAnimation) return false;
    return clearAnimation.rows.includes(row) || clearAnimation.cols.includes(col);
  }, [clearAnimation]);

  const isCellHighlighted = useCallback((row: number, col: number): boolean => {
    if (!highlightCells) return false;
    return highlightCells.some(c => c.row === row && c.col === col);
  }, [highlightCells]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        width: gridPixelSize,
        height: gridPixelSize,
        background: 'linear-gradient(135deg, #1e1c3a, #16142e)',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3), 0 0 40px rgba(192, 132, 252, 0.06), 0 4px 30px rgba(0,0,0,0.4)',
        border: '1px solid rgba(192, 132, 252, 0.12)',
        padding: gap,
      }}
    >
      {/* Grid cells */}
      {Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) => {
          const cellValue = grid[row][col];
          const isClearing = isCellClearing(row, col) && cellValue !== 0;
          const isHighlighted = isCellHighlighted(row, col);
          const color = cellValue ? BLOCK_COLORS[cellValue] : null;

          return (
            <div
              key={`${row}-${col}`}
              className={`absolute rounded-md transition-all duration-75 ${
                isClearing ? 'animate-lineClear' : ''
              }`}
              style={{
                left: gap + col * (cellSize + gap),
                top: gap + row * (cellSize + gap),
                width: cellSize,
                height: cellSize,
                background: color
                  ? color.bg
                  : isHighlighted
                    ? highlightValid
                      ? 'rgba(52, 211, 153, 0.25)'
                      : 'rgba(239, 68, 68, 0.2)'
                    : 'rgba(255,255,255,0.03)',
                border: isHighlighted && !cellValue
                  ? highlightValid
                    ? '2px solid rgba(52, 211, 153, 0.5)'
                    : '2px solid rgba(239, 68, 68, 0.4)'
                  : color
                    ? `1px solid ${color.border}`
                    : '1px solid rgba(255,255,255,0.04)',
                boxShadow: color
                  ? `inset 0 1px 2px rgba(255,255,255,0.2), 0 2px 4px ${color.glow}`
                  : 'none',
              }}
            >
              {/* Shine effect on filled cells */}
              {color && (
                <div
                  className="absolute inset-0 rounded-md"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)',
                  }}
                />
              )}
            </div>
          );
        })
      )}

      {/* Grid section dividers (3x3 sections) */}
      {[3, 6].map(pos => (
        <React.Fragment key={`divider-${pos}`}>
          <div
            className="absolute"
            style={{
              left: 0,
              top: gap + pos * (cellSize + gap) - gap / 2 - 0.5,
              width: gridPixelSize,
              height: 1,
              background: 'rgba(192, 132, 252, 0.15)',
            }}
          />
          <div
            className="absolute"
            style={{
              left: gap + pos * (cellSize + gap) - gap / 2 - 0.5,
              top: 0,
              width: 1,
              height: gridPixelSize,
              background: 'rgba(192, 132, 252, 0.15)',
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};
