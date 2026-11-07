import React from 'react';
import { BoardSize, BotDifficulty, GameMode, PlayerSymbol } from '../types';
import { Undo2, RotateCcw, Bot, Users } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameControlsProps {
  mode: GameMode;
  onChangeMode: (mode: GameMode) => void;
  difficulty: BotDifficulty;
  onChangeDifficulty: (diff: BotDifficulty) => void;
  userSymbol: PlayerSymbol;
  onChangeUserSymbol: (symbol: PlayerSymbol) => void;
  boardSize: BoardSize;
  onChangeBoardSize: (size: BoardSize) => void;
  canUndo: boolean;
  onUndo: () => void;
  onResetBoard: () => void;
  isBotThinking: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  mode,
  onChangeMode,
  difficulty,
  onChangeDifficulty,
  userSymbol,
  onChangeUserSymbol,
  boardSize,
  onChangeBoardSize,
  canUndo,
  onUndo,
  onResetBoard,
  isBotThinking,
}) => {
  return (
    <div className="w-full max-w-lg flex flex-col gap-3.5 bg-slate-50 dark:bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
      {/* Row 1: Mode Switch & Board Grid Size */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Game Mode Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onChangeMode('bot');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              mode === 'bot'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            vs Bot
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onChangeMode('pvp');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              mode === 'pvp'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            2 Players
          </button>
        </div>

        {/* Board Size Picker */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl">
          {([3, 4, 5] as BoardSize[]).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => {
                sound.playClick();
                onChangeBoardSize(sz);
              }}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                boardSize === sz
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sz}×{sz}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Bot Options (when in bot mode) */}
      {mode === 'bot' && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
          {/* Difficulty Segmented */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
              Difficulty:
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
              {(
                [
                  { key: 'easy', label: 'Casual' },
                  { key: 'medium', label: 'Skilled' },
                  { key: 'unbeatable', label: 'Master' },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onChangeDifficulty(key);
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    difficulty === key
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Play as X or O */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
              Play as:
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onChangeUserSymbol('X');
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  userSymbol === 'X'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                X (1st)
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onChangeUserSymbol('O');
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  userSymbol === 'O'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                O (2nd)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row 3: Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onUndo();
          }}
          disabled={!canUndo || isBotThinking}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            canUndo && !isBotThinking
              ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              : 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50'
          }`}
          title="Undo last move (or press U)"
        >
          <Undo2 className="w-3.5 h-3.5" />
          Undo Move
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onResetBoard();
          }}
          className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
          title="Clear current grid board"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Board
        </button>
      </div>
    </div>
  );
};
