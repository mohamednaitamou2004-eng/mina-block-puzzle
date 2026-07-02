// === MINA Block Puzzle - Draggable Block Piece ===

import React from 'react';
import { BlockShape } from '../types/game';
import { BLOCK_COLORS } from '../constants/blocks';

interface BlockPieceProps {
  block: BlockShape;
  index: number;
  miniSize?: number;
  isDragging?: boolean;
}

export const BlockPiece: React.FC<BlockPieceProps> = ({
  block,
  miniSize = 10,
  isDragging = false,
}) => {
  const color = BLOCK_COLORS[block.colorIndex];
  const gap = 2;
  const rows = block.shape.length;
  const cols = block.shape[0].length;

  return (
    <div
      className={`relative flex items-center justify-center ${isDragging ? 'opacity-70 scale-110' : ''}`}
      style={{
        width: cols * (miniSize + gap) + gap,
        height: rows * (miniSize + gap) + gap,
        transition: isDragging ? 'none' : 'transform 0.2s, opacity 0.2s',
      }}
    >
      {block.shape.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (cell === 0) return null;
          return (
            <div
              key={`${rIdx}-${cIdx}`}
              className="absolute rounded-sm"
              style={{
                left: gap + cIdx * (miniSize + gap),
                top: gap + rIdx * (miniSize + gap),
                width: miniSize,
                height: miniSize,
                background: color.bg,
                border: `1px solid ${color.border}`,
                boxShadow: `inset 0 1px 1px rgba(255,255,255,0.2), 0 1px 3px ${color.glow}`,
              }}
            >
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                }}
              />
            </div>
          );
        })
      )}
    </div>
  );
};
