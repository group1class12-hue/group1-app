import { BoardSize, BotDifficulty, CellValue, PlayerSymbol, WinResult } from '../types';

/**
 * Returns all winning combination lines for a given board size.
 * - 3x3: requires 3 in a row
 * - 4x4: requires 4 in a row
 * - 5x5: requires 4 in a row (dynamic sub-lines)
 */
export function getWinningLines(size: BoardSize): number[][] {
  const lines: number[][] = [];
  const target = size === 5 ? 4 : size;

  // Horizontal rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - target; c++) {
      const line: number[] = [];
      for (let k = 0; k < target; k++) {
        line.push(r * size + (c + k));
      }
      lines.push(line);
    }
  }

  // Vertical columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - target; r++) {
      const line: number[] = [];
      for (let k = 0; k < target; k++) {
        line.push((r + k) * size + c);
      }
      lines.push(line);
    }
  }

  // Diagonal (top-left to bottom-right)
  for (let r = 0; r <= size - target; r++) {
    for (let c = 0; c <= size - target; c++) {
      const line: number[] = [];
      for (let k = 0; k < target; k++) {
        line.push((r + k) * size + (c + k));
      }
      lines.push(line);
    }
  }

  // Anti-diagonal (top-right to bottom-left)
  for (let r = 0; r <= size - target; r++) {
    for (let c = target - 1; c < size; c++) {
      const line: number[] = [];
      for (let k = 0; k < target; k++) {
        line.push((r + k) * size + (c - k));
      }
      lines.push(line);
    }
  }

  return lines;
}

/**
 * Checks if the board has a winner, a tie, or is still in progress.
 */
export function checkWin(board: CellValue[], size: BoardSize): WinResult {
  const lines = getWinningLines(size);

  for (const line of lines) {
    const first = board[line[0]];
    if (!first) continue;

    let allMatch = true;
    for (let i = 1; i < line.length; i++) {
      if (board[line[i]] !== first) {
        allMatch = false;
        break;
      }
    }

    if (allMatch) {
      return {
        winner: first,
        line,
      };
    }
  }

  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return { winner: 'TIE', line: null };
  }

  return { winner: null, line: null };
}

/**
 * Minimax algorithm for unbeatable 3x3 play.
 */
function minimax(
  board: CellValue[],
  depth: number,
  isMaximizing: boolean,
  botSymbol: PlayerSymbol,
  humanSymbol: PlayerSymbol,
  alpha: number,
  beta: number
): { score: number; move?: number } {
  const result = checkWin(board, 3);
  if (result.winner === botSymbol) return { score: 10 - depth };
  if (result.winner === humanSymbol) return { score: depth - 10 };
  if (result.winner === 'TIE') return { score: 0 };

  const emptyIndices: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) emptyIndices.push(i);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    let bestMove = emptyIndices[0];

    for (const idx of emptyIndices) {
      board[idx] = botSymbol;
      const evaluation = minimax(board, depth + 1, false, botSymbol, humanSymbol, alpha, beta).score;
      board[idx] = null;

      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = idx;
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    let bestMove = emptyIndices[0];

    for (const idx of emptyIndices) {
      board[idx] = humanSymbol;
      const evaluation = minimax(board, depth + 1, true, botSymbol, humanSymbol, alpha, beta).score;
      board[idx] = null;

      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = idx;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return { score: minEval, move: bestMove };
  }
}

/**
 * Strategic bot move calculator.
 */
export function getBotMove(
  board: CellValue[],
  size: BoardSize,
  botSymbol: PlayerSymbol,
  difficulty: BotDifficulty
): number {
  const humanSymbol: PlayerSymbol = botSymbol === 'X' ? 'O' : 'X';
  const availableMoves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) availableMoves.push(i);
  }

  if (availableMoves.length === 0) return -1;

  // EASY MODE: mostly random, occasional accidental block
  if (difficulty === 'easy') {
    if (Math.random() < 0.25) {
      const blockMove = findImmediateWinningMove(board, size, humanSymbol);
      if (blockMove !== -1) return blockMove;
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // MEDIUM MODE: checks immediate win, blocks immediate loss 75% of the time, prefers center & corners
  if (difficulty === 'medium') {
    // 1. Can bot win right now?
    const winMove = findImmediateWinningMove(board, size, botSymbol);
    if (winMove !== -1) return winMove;

    // 2. Can human win right now? Block it!
    if (Math.random() < 0.8) {
      const blockMove = findImmediateWinningMove(board, size, humanSymbol);
      if (blockMove !== -1) return blockMove;
    }

    // 3. Center
    const center = Math.floor((size * size) / 2);
    if (board[center] === null && Math.random() < 0.7) {
      return center;
    }

    // 4. Corners
    const corners = [0, size - 1, size * (size - 1), size * size - 1].filter(
      (c) => board[c] === null
    );
    if (corners.length > 0 && Math.random() < 0.6) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // UNBEATABLE MODE
  if (size === 3) {
    // Exact Minimax - perfect play
    const clone = [...board];
    const best = minimax(clone, 0, true, botSymbol, humanSymbol, -Infinity, Infinity);
    if (best.move !== undefined) return best.move;
  }

  // For 4x4 and 5x5 or fallback:
  // 1. Take immediate win
  const winMove = findImmediateWinningMove(board, size, botSymbol);
  if (winMove !== -1) return winMove;

  // 2. Block immediate opponent win
  const blockMove = findImmediateWinningMove(board, size, humanSymbol);
  if (blockMove !== -1) return blockMove;

  // 3. Score all moves heuristically
  let bestScore = -Infinity;
  let chosenMove = availableMoves[0];

  const lines = getWinningLines(size);

  for (const move of availableMoves) {
    let score = 0;
    // Prefer center proximity
    const r = Math.floor(move / size);
    const c = move % size;
    const mid = (size - 1) / 2;
    const distToCenter = Math.abs(r - mid) + Math.abs(c - mid);
    score -= distToCenter * 2;

    // Evaluate how this move impacts lines
    board[move] = botSymbol;
    for (const line of lines) {
      if (line.includes(move)) {
        let botCount = 0;
        let humanCount = 0;
        for (const idx of line) {
          if (board[idx] === botSymbol) botCount++;
          if (board[idx] === humanSymbol) humanCount++;
        }
        if (humanCount === 0) {
          score += Math.pow(botCount, 3);
        }
      }
    }
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      chosenMove = move;
    }
  }

  return chosenMove;
}

function findImmediateWinningMove(
  board: CellValue[],
  size: BoardSize,
  player: PlayerSymbol
): number {
  const lines = getWinningLines(size);
  for (const line of lines) {
    let playerCount = 0;
    let emptyIndex = -1;

    for (const idx of line) {
      if (board[idx] === player) {
        playerCount++;
      } else if (board[idx] === null) {
        emptyIndex = idx;
      }
    }

    if (playerCount === line.length - 1 && emptyIndex !== -1) {
      return emptyIndex;
    }
  }
  return -1;
}
