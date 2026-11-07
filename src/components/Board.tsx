import React, { useState } from 'react';
import { BoardSize, CellValue, PlayerSymbol } from '../types';

interface BoardProps {
  board: CellValue[];
  size: BoardSize;
  winningLine: number[] | null;
  onCellClick: (index: number) => void;
  disabled: boolean;
  currentTurn: PlayerSymbol;
  winner: PlayerSymbol | 'TIE' | null;
}

export const Board: React.FC<BoardProps> = ({
  board,
  size,
  winningLine,
  onCellClick,
  disabled,
  currentTurn,
  winner,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getGridColsClass = () => {
    if (size === 3) return 'grid-cols-3 max-w-[340px] sm:max-w-[380px]';
    if (size === 4) return 'grid-cols-4 max-w-[360px] sm:max-w-[420px]';
    return 'grid-cols-5 max-w-[380px] sm:max-w-[460px]';
  };

  const getCellHeightClass = () => {
    if (size === 3) return 'h-24 sm:h-28 text-4xl sm:text-5xl';
    if (size === 4) return 'h-18 sm:h-22 text-3xl sm:text-4xl';
    return 'h-14 sm:h-18 text-2xl sm:text-3xl';
  };

  return (
    <div className="relative w-full flex justify-center py-2 sm:py-4">
      <div
        className={`w-full grid gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-3xl bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-800 shadow-lg dark:shadow-2xl transition-all ${getGridColsClass()}`}
        role="grid"
        aria-label={`${size} by ${size} Tic Tac Toe Board`}
      >
        {board.map((cell, idx) => {
          const isWinningCell = winningLine?.includes(idx);
          const isHovered = hoveredIndex === idx && !cell && !disabled;

          return (
            <button
              key={idx}
              type="button"
              role="gridcell"
              aria-label={`Cell ${idx + 1}, ${cell ? `filled with ${cell}` : 'empty'}`}
              disabled={disabled || cell !== null}
              onClick={() => onCellClick(idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative rounded-2xl flex items-center justify-center font-bold transition-all duration-150 select-none ${getCellHeightClass()} ${
                isWinningCell
                  ? cell === 'X'
                    ? 'bg-blue-500 text-white shadow-md scale-[1.03] ring-2 ring-blue-300 dark:ring-blue-400'
                    : 'bg-rose-500 text-white shadow-md scale-[1.03] ring-2 ring-rose-300 dark:ring-rose-400'
                  : cell
                  ? 'bg-white dark:bg-slate-800 shadow-sm cursor-default'
                  : disabled
                  ? 'bg-white/60 dark:bg-slate-800/40 cursor-not-allowed'
                  : 'bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-750 hover:shadow active:scale-[0.97] cursor-pointer'
              }`}
            >
              {/* Optional tiny numpad hint for 3x3 */}
              {size === 3 && !cell && (
                <span className="absolute top-1.5 left-2 text-[10px] font-mono text-slate-300 dark:text-slate-600 pointer-events-none select-none">
                  {idx + 1}
                </span>
              )}

              {/* Render Mark with SVG */}
              {cell === 'X' && (
                <svg
                  className={`w-3/5 h-3/5 transition-transform duration-200 ${
                    isWinningCell ? 'stroke-white' : 'stroke-blue-500 dark:stroke-blue-400'
                  }`}
                  viewBox="0 0 48 48"
                  fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="10" y1="10" x2="38" y2="38" className="animate-[dash_0.2s_ease-out]" />
                  <line x1="38" y1="10" x2="10" y2="38" className="animate-[dash_0.2s_ease-out]" />
                </svg>
              )}

              {cell === 'O' && (
                <svg
                  className={`w-3/5 h-3/5 transition-transform duration-200 ${
                    isWinningCell ? 'stroke-white' : 'stroke-rose-500 dark:stroke-rose-400'
                  }`}
                  viewBox="0 0 48 48"
                  fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="24" cy="24" r="14" />
                </svg>
              )}

              {/* Ghost preview on empty hovered cell */}
              {isHovered && !winner && (
                <div className="opacity-25 transition-opacity pointer-events-none">
                  {currentTurn === 'X' ? (
                    <svg
                      className="w-3/5 h-3/5 stroke-blue-500 dark:stroke-blue-400"
                      viewBox="0 0 48 48"
                      fill="none"
                      strokeWidth="5"
                      strokeLinecap="round"
                    >
                      <line x1="12" y1="12" x2="36" y2="36" />
                      <line x1="36" y1="12" x2="12" y2="36" />
                    </svg>
                  ) : (
                    <svg
                      className="w-3/5 h-3/5 stroke-rose-500 dark:stroke-rose-400"
                      viewBox="0 0 48 48"
                      fill="none"
                      strokeWidth="5"
                      strokeLinecap="round"
                    >
                      <circle cx="24" cy="24" r="12" />
                    </svg>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
