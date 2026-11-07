/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BoardSize,
  BotDifficulty,
  CellValue,
  GameMode,
  MoveRecord,
  PlayerSymbol,
  ScoreState,
  WinResult,
} from './types';
import { checkWin, getBotMove } from './utils/gameLogic';
import { sound } from './utils/audio';
import { triggerConfettiBurst } from './utils/confetti';
import { Navbar } from './components/Navbar';
import { ScoreBoard } from './components/ScoreBoard';
import { GameControls } from './components/GameControls';
import { Board } from './components/Board';
import { GameOverBanner } from './components/GameOverBanner';
import { HowToPlayModal } from './components/HowToPlayModal';

const INITIAL_SCORES: ScoreState = {
  xWins: 0,
  oWins: 0,
  ties: 0,
  currentStreak: 0,
  bestStreak: 0,
};

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('ttt_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sound mute state
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // Game configuration
  const [mode, setMode] = useState<GameMode>('bot');
  const [difficulty, setDifficulty] = useState<BotDifficulty>('unbeatable');
  const [userSymbol, setUserSymbol] = useState<PlayerSymbol>('X');
  const [boardSize, setBoardSize] = useState<BoardSize>(3);

  // Active game state
  const [board, setBoard] = useState<CellValue[]>(() =>
    Array(3 * 3).fill(null)
  );
  const [currentTurn, setCurrentTurn] = useState<PlayerSymbol>('X');
  const [history, setHistory] = useState<MoveRecord[]>([]);
  const [winResult, setWinResult] = useState<WinResult>({ winner: null, line: null });
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  // Scores
  const [scores, setScores] = useState<ScoreState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ttt_scores_v1');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore error
        }
      }
    }
    return INITIAL_SCORES;
  });

  // Keep dark class synced on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ttt_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ttt_theme', 'light');
    }
  }, [darkMode]);

  // Persist scores
  const saveScores = useCallback((newScores: ScoreState) => {
    setScores(newScores);
    localStorage.setItem('ttt_scores_v1', JSON.stringify(newScores));
  }, []);

  // Clean Board Reset
  const handleResetBoard = useCallback(() => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setCurrentTurn('X');
    setHistory([]);
    setWinResult({ winner: null, line: null });
    setIsBotThinking(false);
  }, [boardSize]);

  // Total New Game / Mode change reset
  const handleNewGame = useCallback(() => {
    handleResetBoard();
  }, [handleResetBoard]);

  // Handle Board Size Change
  const handleChangeBoardSize = useCallback(
    (size: BoardSize) => {
      setBoardSize(size);
      setBoard(Array(size * size).fill(null));
      setCurrentTurn('X');
      setHistory([]);
      setWinResult({ winner: null, line: null });
      setIsBotThinking(false);
    },
    []
  );

  // Handle Mode Change
  const handleChangeMode = useCallback(
    (newMode: GameMode) => {
      setMode(newMode);
      handleResetBoard();
    },
    [handleResetBoard]
  );

  // Handle User Symbol Change
  const handleChangeUserSymbol = useCallback(
    (sym: PlayerSymbol) => {
      setUserSymbol(sym);
      handleResetBoard();
    },
    [handleResetBoard]
  );

  // Reset Score Stats
  const handleResetScores = useCallback(() => {
    saveScores(INITIAL_SCORES);
  }, [saveScores]);

  // Process game-ending outcome
  const handleGameOver = useCallback(
    (winner: PlayerSymbol | 'TIE') => {
      if (winner === 'TIE') {
        sound.playDraw();
        saveScores({
          ...scores,
          ties: scores.ties + 1,
          currentStreak: 0,
        });
      } else {
        sound.playWin();
        const userWon = mode === 'pvp' || winner === userSymbol;
        if (userWon) {
          triggerConfettiBurst();
        }

        const newX = winner === 'X' ? scores.xWins + 1 : scores.xWins;
        const newO = winner === 'O' ? scores.oWins + 1 : scores.oWins;
        const newStreak = userWon ? scores.currentStreak + 1 : 0;
        const bestStreak = Math.max(scores.bestStreak, newStreak);

        saveScores({
          ...scores,
          xWins: newX,
          oWins: newO,
          currentStreak: newStreak,
          bestStreak,
        });
      }
    },
    [mode, userSymbol, scores, saveScores]
  );

  // Core move execution
  const executeMove = useCallback(
    (index: number, player: PlayerSymbol) => {
      if (board[index] !== null || winResult.winner !== null) return;

      const newBoard = [...board];
      newBoard[index] = player;
      sound.playMove(player);

      const nextTurn: PlayerSymbol = player === 'X' ? 'O' : 'X';
      const result = checkWin(newBoard, boardSize);

      setBoard(newBoard);
      setHistory((prev) => [
        ...prev,
        { index, player, moveNumber: prev.length + 1 },
      ]);
      setWinResult(result);
      setCurrentTurn(nextTurn);

      if (result.winner) {
        handleGameOver(result.winner);
      }
    },
    [board, winResult.winner, boardSize, handleGameOver]
  );

  // AI Bot automated response turn
  const botScheduledRef = useRef(false);

  useEffect(() => {
    if (
      mode === 'bot' &&
      !winResult.winner &&
      currentTurn !== userSymbol &&
      !isBotThinking &&
      !botScheduledRef.current
    ) {
      botScheduledRef.current = true;
      setIsBotThinking(true);

      const timer = setTimeout(() => {
        const botSymbol: PlayerSymbol = userSymbol === 'X' ? 'O' : 'X';
        const bestMove = getBotMove(board, boardSize, botSymbol, difficulty);

        if (bestMove !== -1 && board[bestMove] === null) {
          executeMove(bestMove, botSymbol);
        }
        setIsBotThinking(false);
        botScheduledRef.current = false;
      }, 420);

      return () => {
        clearTimeout(timer);
        botScheduledRef.current = false;
      };
    }
  }, [
    mode,
    winResult.winner,
    currentTurn,
    userSymbol,
    isBotThinking,
    board,
    boardSize,
    difficulty,
    executeMove,
  ]);

  // Human player cell click handler
  const handleCellClick = useCallback(
    (index: number) => {
      if (isBotThinking || winResult.winner !== null || board[index] !== null) {
        return;
      }
      if (mode === 'bot' && currentTurn !== userSymbol) {
        return;
      }

      executeMove(index, currentTurn);
    },
    [isBotThinking, winResult.winner, board, mode, currentTurn, userSymbol, executeMove]
  );

  // Undo last move
  const handleUndo = useCallback(() => {
    if (history.length === 0 || isBotThinking) return;

    if (mode === 'bot') {
      // In bot mode, undo bot move AND human move to bring it back to user's turn
      const stepsToUndo =
        history[history.length - 1].player !== userSymbol ? 2 : 1;

      const newHistory = history.slice(0, Math.max(0, history.length - stepsToUndo));
      const newBoard: CellValue[] = Array(boardSize * boardSize).fill(null);
      for (const item of newHistory) {
        newBoard[item.index] = item.player;
      }

      setBoard(newBoard);
      setHistory(newHistory);
      setCurrentTurn(userSymbol);
      setWinResult({ winner: null, line: null });
    } else {
      // In 2-player pass & play, undo 1 move
      const lastMove = history[history.length - 1];
      const newHistory = history.slice(0, history.length - 1);
      const newBoard = [...board];
      newBoard[lastMove.index] = null;

      setBoard(newBoard);
      setHistory(newHistory);
      setCurrentTurn(lastMove.player);
      setWinResult({ winner: null, line: null });
    }
  }, [history, isBotThinking, mode, userSymbol, boardSize, board]);

  // Keyboard controls (1-9 for 3x3, U for undo, R for restart, M for mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key >= '1' && e.key <= '9' && boardSize === 3) {
        const cellIdx = parseInt(e.key, 10) - 1;
        handleCellClick(cellIdx);
      } else if (e.key === 'u' || e.key === 'U') {
        handleUndo();
      } else if (e.key === 'r' || e.key === 'R') {
        sound.playClick();
        handleResetBoard();
      } else if (e.key === 'm' || e.key === 'M') {
        const muted = sound.toggleMute();
        setIsMuted(muted);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [boardSize, handleCellClick, handleUndo, handleResetBoard]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors selection:bg-blue-500 selection:text-white">
      {/* Top Bar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        isMuted={isMuted}
        onToggleMute={() => {
          const muted = sound.toggleMute();
          setIsMuted(muted);
        }}
        onResetScores={handleResetScores}
        onOpenRules={() => setIsRulesOpen(true)}
        onNewGame={handleNewGame}
      />

      {/* Main Play Arena */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center justify-start gap-4 sm:gap-6">
        {/* ScoreBoard Header */}
        <ScoreBoard
          scores={scores}
          currentTurn={currentTurn}
          winner={winResult.winner}
          mode={mode}
          userSymbol={userSymbol}
          isBotThinking={isBotThinking}
        />

        {/* Board Component */}
        <Board
          board={board}
          size={boardSize}
          winningLine={winResult.line}
          onCellClick={handleCellClick}
          disabled={winResult.winner !== null || (mode === 'bot' && (currentTurn !== userSymbol || isBotThinking))}
          currentTurn={currentTurn}
          winner={winResult.winner}
        />

        {/* Game Over Banner with instant replay */}
        {winResult.winner && (
          <GameOverBanner
            winner={winResult.winner}
            mode={mode}
            userSymbol={userSymbol}
            moveCount={history.length}
            onPlayAgain={handleResetBoard}
          />
        )}

        {/* Controls Toolbar */}
        <GameControls
          mode={mode}
          onChangeMode={handleChangeMode}
          difficulty={difficulty}
          onChangeDifficulty={setDifficulty}
          userSymbol={userSymbol}
          onChangeUserSymbol={handleChangeUserSymbol}
          boardSize={boardSize}
          onChangeBoardSize={handleChangeBoardSize}
          canUndo={history.length > 0 && winResult.winner === null}
          onUndo={handleUndo}
          onResetBoard={handleResetBoard}
          isBotThinking={isBotThinking}
        />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-2">
          <span>Tic-Tac-Toe Studio</span>
          <span aria-hidden="true">·</span>
          <span>Press 1–9 to move</span>
          <span aria-hidden="true">·</span>
          <span>Press U to Undo</span>
          <span aria-hidden="true">·</span>
          <span>Press R to Restart</span>
        </div>
      </footer>

      {/* Rules Modal */}
      <HowToPlayModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}
