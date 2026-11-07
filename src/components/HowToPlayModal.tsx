import React from 'react';
import { X, Keyboard, Trophy, Zap, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-display tracking-tight">How to Play</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rules, AI tiers & keyboard shortcuts
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-5 text-sm text-slate-600 dark:text-slate-300">
          {/* Rules */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Game Objectives
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm pl-4 list-disc marker:text-blue-500">
              <li>
                <strong className="text-slate-900 dark:text-white">3×3 Classic:</strong> Be the first player to align 3 consecutive marks horizontally, vertically, or diagonally.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">4×4 Master:</strong> Align 4 consecutive marks to claim victory.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">5×5 Grid:</strong> Align 4 consecutive marks in any direction for fast, strategic play.
              </li>
            </ul>
          </div>

          {/* AI Difficulties */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Bot Intelligence Levels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Casual</span>
                Plays casually with randomized decisions. Great for warm-ups.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Skilled</span>
                Takes opportunities, controls center, and blocks most win threats.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="font-bold text-blue-600 dark:text-blue-400 block mb-0.5">Master</span>
                Minimax algorithm. Evaluates every move path—impossible to defeat!
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-emerald-500" />
              Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span>Cells 1 to 9</span>
                <kbd className="px-1.5 py-0.5 font-mono text-[11px] font-semibold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded">
                  1-9
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span>Undo Move</span>
                <kbd className="px-1.5 py-0.5 font-mono text-[11px] font-semibold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded">
                  U
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span>Restart Round</span>
                <kbd className="px-1.5 py-0.5 font-mono text-[11px] font-semibold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded">
                  R
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span>Mute Audio</span>
                <kbd className="px-1.5 py-0.5 font-mono text-[11px] font-semibold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded">
                  M
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
          >
            Got it, Let's Play
          </button>
        </div>
      </div>
    </div>
  );
};
