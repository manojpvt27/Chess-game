import { ChessPiece, Position, Move } from '../types';

export function generateMoveNotation(
  piece: ChessPiece,
  from: Position,
  to: Position,
  isCapture: boolean,
  isCheck: boolean,
  isCheckmate: boolean
): string {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  const pieceSymbols: { [key: string]: string } = {
    king: 'K',
    queen: 'Q',
    rook: 'R',
    bishop: 'B',
    knight: 'N',
    pawn: ''
  };

  let notation = '';
  
  // Add piece symbol (except for pawns)
  if (piece.type !== 'pawn') {
    notation += pieceSymbols[piece.type];
  }

  // Add capture symbol
  if (isCapture) {
    if (piece.type === 'pawn') {
      notation += files[from.col];
    }
    notation += 'x';
  }

  // Add destination square
  notation += files[to.col] + ranks[to.row];

  // Add check or checkmate symbol
  if (isCheckmate) {
    notation += '#';
  } else if (isCheck) {
    notation += '+';
  }

  return notation;
}