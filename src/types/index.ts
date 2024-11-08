export interface Position {
  row: number;
  col: number;
}

export interface ChessPiece {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  color: 'white' | 'black';
  symbol: string;
}

export interface Move {
  piece: ChessPiece;
  from: Position;
  to: Position;
  timestamp: number;
  notation: string;
}

export interface GameTime {
  white: number;
  black: number;
}

export type GameState = 'playing' | 'check' | 'checkmate' | 'stalemate';