import React from 'react';
import { GameMode, PlayerSymbol, ScoreState } from '../types';
import { Bot, User, Flame } from 'lucide-react';

interface ScoreBoardProps {
  scores: ScoreState;
  currentTurn: PlayerSymbol;
  winner: PlayerSymbol | 'TIE' | null;
  mode: GameMode;
  userSymbol: PlayerSymbol;
  isBotThinking: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  currentTurn,
  winner,
  mode,
  userSymbol,
  isBotThinking,
}) => {
  const isXTurn = currentTurn === 'X' && !winner;
  const isOTurn = currentTurn === 'O' && !winner;

  const isXBot = mode === 'bot' && userSymbol === 'O';
  const isOBot = mode === 'bot' && userSymbol === 'X';

  const getStatusText = () => {
    if (winner === 'TIE') {
      return 'Game ended in a Draw!';
    }
    if (winner) {
      if (mode === 'bot') {
        return winner === userSymbol ? '🎉 You won the game!' : '🤖 Bot won this round!';
      }
      return `🎉 Player ${winner} won the game!`;
    }
    if (mode === 'bot') {
      if (isBotThinking) return 'Bot is strategizing...';
      return currentTurn === userSymbol ? 'Your turn to move' : 'Waiting for Bot move...';
    }
    return `Player ${currentTurn}'s Turn`;
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* 3-Card Balanced Scoreboard */}
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 max-w-lg">
        {/* Player X Box */}
        <div
          className={`relative p-3 sm:p-4 rounded-xl border transition-all text-center ${
            isXTurn
              ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-400 dark:border-blue-500 shadow-sm ring-1 ring-blue-400/50'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            {isXBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            <span className="truncate">
              {mode === 'bot' ? (isXBot ? 'AI Bot (X)' : 'You (X)') : 'Player X'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-slate-900 dark:text-white">
            {scores.xWins}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {isXTurn ? 'Active Turn' : 'Wins'}
          </div>
        </div>

        {/* Draws Box */}
        <div className="p-3 sm:p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-center transition-all">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Draws
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-slate-700 dark:text-slate-300">
            {scores.ties}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Ties</div>
        </div>

        {/* Player O Box */}
        <div
          className={`relative p-3 sm:p-4 rounded-xl border transition-all text-center ${
            isOTurn
              ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-400 dark:border-rose-500 shadow-sm ring-1 ring-rose-400/50'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
            {isOBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            <span className="truncate">
              {mode === 'bot' ? (isOBot ? 'AI Bot (O)' : 'You (O)') : 'Player O'}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display tabular-nums text-slate-900 dark:text-white">
            {scores.oWins}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {isOTurn ? 'Active Turn' : 'Wins'}
          </div>
        </div>
      </div>

      {/* Clean Unboxed Metadata & Status Banner */}
      <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {getStatusText()}
        </span>
        {scores.currentStreak > 1 && (
          <>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold tabular-nums">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              {scores.currentStreak} Win Streak
            </span>
          </>
        )}
      </div>
    </div>
  );
};
