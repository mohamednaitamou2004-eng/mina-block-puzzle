// === MINA Block Puzzle - Main Game Screen ===

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Grid as GridType, BlockShape, ClearAnimation, Screen } from '../types/game';
import { GRID_SIZE, getBlockCells } from '../constants/blocks';
import { GameGrid } from '../components/Grid';
import { BlockPiece } from '../components/BlockPiece';

interface GameScreenProps {
  grid: GridType;
  score: number;
  highScore: number;
  currentBlocks: (BlockShape | null)[];
  combo: number;

  level: number;
  clearAnimation: ClearAnimation | null;
  canPlaceBlock: (block: BlockShape, row: number, col: number) => boolean;
  placeBlock: (blockIndex: number, row: number, col: number) => {
    success: boolean; linesCleared: number; comboLevel: number; scoreGained: number;
  };
  onNavigate: (screen: Screen) => void;
  playPlace: () => void;
  playClear: (count?: number) => void;
  playCombo: (level: number) => void;
}

interface DragState {
  blockIndex: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
}

interface ScoreFloat {
  id: number;
  value: number;
  x: number;
  y: number;
  isCombo: boolean;
}

let scoreFloatId = 0;

export const GameScreen: React.FC<GameScreenProps> = ({
  grid,
  score,
  highScore,
  currentBlocks,
  combo,
  level,
  clearAnimation,
  canPlaceBlock,
  placeBlock,
  onNavigate,
  playPlace,
  playClear,
  playCombo,
}) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [scoreFloats, setScoreFloats] = useState<ScoreFloat[]>([]);
  const [placedAnimation, setPlacedAnimation] = useState<{ row: number; col: number }[] | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Calculate cell size based on screen width
  const cellSize = useMemo(() => {
    const screenWidth = Math.min(window.innerWidth, 420);
    const gridPadding = 32;
    const gap = 2;
    return Math.floor((screenWidth - gridPadding - (GRID_SIZE + 1) * gap) / GRID_SIZE);
  }, []);

  // Calculate highlight cells while dragging
  const highlightInfo = useMemo(() => {
    if (!dragState?.isDragging || !gridRef.current) return null;
    const block = currentBlocks[dragState.blockIndex];
    if (!block) return null;

    const rect = gridRef.current.getBoundingClientRect();
    const gap = 2;

    // Position the center of the block under the finger (offset up)
    const blockCells = getBlockCells(block);
    const blockRows = block.shape.length;
    const blockCols = block.shape[0].length;

    const offsetY = -cellSize * 2.5; // Offset up so user can see
    const x = dragState.currentX - rect.left;
    const y = dragState.currentY - rect.top + offsetY;

    const centerCol = Math.round((x - gap - (blockCols * (cellSize + gap)) / 2) / (cellSize + gap));
    const centerRow = Math.round((y - gap - (blockRows * (cellSize + gap)) / 2) / (cellSize + gap));

    const cells = blockCells.map(c => ({
      row: centerRow + c.row,
      col: centerCol + c.col,
    }));

    const valid = canPlaceBlock(block, centerRow, centerCol);

    return { cells, valid, targetRow: centerRow, targetCol: centerCol };
  }, [dragState, currentBlocks, canPlaceBlock, cellSize]);

  // Handle touch/mouse events for drag
  const handleDragStart = useCallback((blockIndex: number, clientX: number, clientY: number) => {
    if (!currentBlocks[blockIndex]) return;
    setDragState({
      blockIndex,
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      isDragging: true,
    });
  }, [currentBlocks]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!dragState) return;
    setDragState(prev => prev ? { ...prev, currentX: clientX, currentY: clientY, isDragging: true } : null);
  }, [dragState]);

  const handleDragEnd = useCallback(() => {
    if (!dragState || !highlightInfo) {
      setDragState(null);
      return;
    }

    if (highlightInfo.valid) {
      const result = placeBlock(dragState.blockIndex, highlightInfo.targetRow, highlightInfo.targetCol);
      if (result.success) {
        playPlace();

        // Show placed animation
        setPlacedAnimation(highlightInfo.cells);
        setTimeout(() => setPlacedAnimation(null), 300);

        // Score float
        if (result.scoreGained > 0) {
          const gridRect = gridRef.current?.getBoundingClientRect();
          if (gridRect) {
            const newFloat: ScoreFloat = {
              id: ++scoreFloatId,
              value: result.scoreGained,
              x: gridRect.left + gridRect.width / 2,
              y: gridRect.top + gridRect.height / 3,
              isCombo: false,
            };
            setScoreFloats(prev => [...prev, newFloat]);
            setTimeout(() => {
              setScoreFloats(prev => prev.filter(f => f.id !== newFloat.id));
            }, 1200);
          }
        }

        if (result.linesCleared > 0) {
          playClear(result.linesCleared);

          if (result.comboLevel >= 2) {
            playCombo(result.comboLevel);
            // Combo float
            const gridRect = gridRef.current?.getBoundingClientRect();
            if (gridRect) {
              const comboFloat: ScoreFloat = {
                id: ++scoreFloatId,
                value: result.comboLevel,
                x: gridRect.left + gridRect.width / 2,
                y: gridRect.top + gridRect.height / 2,
                isCombo: true,
              };
              setScoreFloats(prev => [...prev, comboFloat]);
              setTimeout(() => {
                setScoreFloats(prev => prev.filter(f => f.id !== comboFloat.id));
              }, 1400);
            }
          }
        }
      }
    }

    setDragState(null);
  }, [dragState, highlightInfo, placeBlock, playPlace, playClear, playCombo]);

  // Touch event handlers
  const onTouchStart = useCallback((blockIndex: number) => (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragStart(blockIndex, touch.clientX, touch.clientY);
  }, [handleDragStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  }, [handleDragMove]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleDragEnd();
  }, [handleDragEnd]);

  // Mouse event handlers (for desktop testing)
  const onMouseDown = useCallback((blockIndex: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(blockIndex, e.clientX, e.clientY);
  }, [handleDragStart]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState) handleDragMove(e.clientX, e.clientY);
    };
    const handleMouseUp = () => {
      if (dragState) handleDragEnd();
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, handleDragMove, handleDragEnd]);

  // Block mini size for the piece tray
  const blockMiniSize = Math.min(14, Math.floor((window.innerWidth - 80) / 15));

  return (
    <div className="fixed inset-0 flex flex-col items-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0f0e1a 0%, #161430 50%, #0f0e1a 100%)' }}
    >
      {/* Ambient background orbs */}
      <div className="absolute w-40 h-40 rounded-full bg-orb opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #ff6b9d 0%, transparent 70%)',
          top: '5%', left: '-5%', filter: 'blur(40px)',
        }}
      />
      <div className="absolute w-32 h-32 rounded-full bg-orb opacity-8 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)',
          bottom: '15%', right: '-5%', filter: 'blur(35px)', animationDelay: '-4s',
        }}
      />
      <div className="absolute w-24 h-24 rounded-full bg-orb opacity-6 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)',
          top: '40%', right: '10%', filter: 'blur(25px)', animationDelay: '-6s',
        }}
      />

      {/* Header */}
      <div className="w-full max-w-md px-4 pt-3 pb-2 flex items-center justify-between animate-fadeInDown">
        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          onClick={() => onNavigate('pause')}
        >
          <span className="text-lg">⏸</span>
        </button>

        <div className="flex items-center gap-4">
          {/* Score */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider" style={{ color: '#8b88b0', fontSize: '10px' }}>Score</p>
            <p className="text-xl font-bold" style={{ color: '#e2e0ff' }}>{score.toLocaleString()}</p>
          </div>

          {/* Level */}
          <div className="text-center px-3 py-1 rounded-xl" style={{ background: 'rgba(192,132,252,0.15)' }}>
            <p className="text-xs uppercase tracking-wider" style={{ color: '#c084fc', fontSize: '10px' }}>Niv.</p>
            <p className="text-lg font-bold" style={{ color: '#c084fc' }}>{level}</p>
          </div>

          {/* Best */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider" style={{ color: '#8b88b0', fontSize: '10px' }}>Record</p>
            <p className="text-lg font-bold" style={{ color: '#fbbf24' }}>{highScore.toLocaleString()}</p>
          </div>
        </div>

        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          onClick={() => onNavigate('home')}
        >
          <span className="text-lg">🏠</span>
        </button>
      </div>

      {/* Combo indicator */}
      {combo >= 2 && (
        <div className="animate-comboFlash absolute top-16 left-1/2 -translate-x-1/2 z-50">
          <div className="px-5 py-2 rounded-full font-black text-xl"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: '#1a1a2e',
              boxShadow: '0 4px 20px rgba(251,191,36,0.5)',
            }}
          >
            COMBO x{combo} 🔥
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ minHeight: 0 }}>
        <div ref={gridRef} className="animate-scaleIn relative">
          <GameGrid
            grid={grid}
            clearAnimation={clearAnimation}
            highlightCells={highlightInfo?.cells || null}
            highlightValid={highlightInfo?.valid || false}
            cellSize={cellSize}
          />

          {/* Placed animation overlay */}
          {placedAnimation && placedAnimation.map((cell, i) => (
            <div
              key={i}
              className="absolute animate-blockPlace rounded-md pointer-events-none"
              style={{
                left: 2 + cell.col * (cellSize + 2),
                top: 2 + cell.row * (cellSize + 2),
                width: cellSize,
                height: cellSize,
                background: 'rgba(255,255,255,0.3)',
                zIndex: 10,
              }}
            />
          ))}
        </div>
      </div>

      {/* Block Tray */}
      <div className="w-full max-w-md px-3 pb-4 pt-2 animate-slideUp">
        <div className="glass rounded-2xl px-4 py-3">
          <div className="flex items-center justify-around" style={{ minHeight: 70 }}>
            {currentBlocks.map((block, index) => {
              if (!block) {
                return (
                  <div key={index} className="w-16 h-16 flex items-center justify-center opacity-20">
                    <div className="w-8 h-8 rounded-lg border-2 border-dashed" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />
                  </div>
                );
              }

              const isDragging = dragState?.blockIndex === index && dragState.isDragging;

              return (
                <div
                  key={block.id}
                  ref={el => { blockRefs.current[index] = el; }}
                  className="flex items-center justify-center cursor-grab active:cursor-grabbing p-2 rounded-xl transition-all duration-150"
                  style={{
                    opacity: isDragging ? 0.3 : 1,
                    transform: isDragging ? 'scale(0.9)' : 'scale(1)',
                    background: isDragging ? 'rgba(255,255,255,0.05)' : 'transparent',
                    touchAction: 'none',
                  }}
                  onTouchStart={onTouchStart(index)}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  onMouseDown={onMouseDown(index)}
                >
                  <BlockPiece block={block} index={index} miniSize={blockMiniSize} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dragging ghost piece */}
      {dragState?.isDragging && currentBlocks[dragState.blockIndex] && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: dragState.currentX,
            top: dragState.currentY - cellSize * 3,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div style={{ transform: 'scale(1.1)' }}>
            <BlockPiece
              block={currentBlocks[dragState.blockIndex]!}
              index={dragState.blockIndex}
              miniSize={cellSize}
              isDragging={true}
            />
          </div>
        </div>
      )}

      {/* Score floats */}
      {scoreFloats.map(f => (
        <div
          key={f.id}
          className={`fixed pointer-events-none z-50 ${f.isCombo ? 'animate-comboFlash' : 'animate-scorePopup'}`}
          style={{
            left: f.x,
            top: f.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="font-black text-2xl" style={{
            color: f.isCombo ? '#fbbf24' : '#34d399',
            textShadow: `0 2px 10px ${f.isCombo ? 'rgba(251,191,36,0.5)' : 'rgba(52,211,153,0.5)'}`,
          }}>
            {f.isCombo ? `COMBO x${f.value}!` : `+${f.value}`}
          </span>
        </div>
      ))}
    </div>
  );
};
