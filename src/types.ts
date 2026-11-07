export type PlayerSymbol = 'X' | 'O';
export type CellValue = PlayerSymbol | null;

export type GameMode = 'bot' | 'pvp';
export type BotDifficulty = 'easy' | 'medium' | 'unbeatable';
export type BoardSize = 3 | 4 | 5;

export interface WinResult {
  winner: PlayerSymbol | 'TIE' | null;
  line: number[] | null;
  direction?: 'row' | 'col' | 'diag-main' | 'diag-anti';
}

export interface MoveRecord {
  index: number;
  player: PlayerSymbol;
  moveNumber: number;
}

export interface ScoreState {
  xWins: number;
  oWins: number;
  ties: number;
  currentStreak: number;
  bestStreak: number;
}
