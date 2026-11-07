import React from 'react';
import { Volume2, VolumeX, Moon, Sun, RotateCcw, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetScores: () => void;
  onOpenRules: () => void;
  onNewGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  isMuted,
  onToggleMute,
  onResetScores,
  onOpenRules,
  onNewGame,
}) => {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Tic-Tac-Toe<span className="text-blue-500 ml-1">Studio</span>
          </span>
        </div>

        {/* Zone 2: Navigation & Quick Actions */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title="How to play and keyboard shortcuts"
            aria-label="How to play"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onToggleDarkMode();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onResetScores();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title="Clear win/loss scores"
            aria-label="Reset score history"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Stats</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onNewGame();
            }}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
          >
            New Game
          </button>
        </div>
      </div>
    </header>
  );
};
