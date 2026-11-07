import React from 'react';
import { GameMode, PlayerSymbol } from '../types';
import { Trophy, RefreshCw, Frown, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameOverBannerProps {
  winner: PlayerSymbol | 'TIE';
  mode: GameMode;
  userSymbol: PlayerSymbol;
  moveCount: number;
  onPlayAgain: () => void;
}

export const GameOverBanner: React.FC<GameOverBannerProps> = ({
  winner,
  mode,
  userSymbol,
  moveCount,
  onPlayAgain,
}) => {
  const isDraw = winner === 'TIE';
  const isUserWinner = mode === 'bot' && winner === userSymbol;
  const isBotWinner = mode === 'bot' && !isDraw && winner !== userSymbol;

  const getTitle = () => {
    if (isDraw) return 'Tough Stalemate — Game Drawn!';
    if (mode === 'bot') {
      return isUserWinner ? 'Magnificent! You Won!' : 'AI Bot Outmaneuvered You!';
    }
    return `Victory! Player ${winner} Triumphs!`;
  };

  const getSubtitle = () => {
    if (isDraw) return `Grid filled in ${moveCount} total turns with no victor.`;
    return `Winning line secured in ${moveCount} total moves.`;
  };

  return (
    <div
      className={`w-full max-w-lg p-4 sm:p-5 rounded-2xl border transition-all animate-in zoom-in-95 duration-200 ${
        isDraw
          ? 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700'
          : isUserWinner || mode === 'pvp'
          ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-lg'
          : 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-lg'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isDraw
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                : isUserWinner || mode === 'pvp'
                ? 'bg-blue-500 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            {isDraw ? (
              <RefreshCw className="w-5 h-5" />
            ) : isUserWinner || mode === 'pvp' ? (
              <Trophy className="w-6 h-6" />
            ) : (
              <Frown className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white leading-tight">
              {getTitle()}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {getSubtitle()}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onPlayAgain();
          }}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold text-white rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
            isDraw
              ? 'bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600'
              : isUserWinner || mode === 'pvp'
              ? 'bg-blue-600 hover:bg-blue-500'
              : 'bg-rose-600 hover:bg-rose-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Play Again
        </button>
      </div>
    </div>
  );
};
