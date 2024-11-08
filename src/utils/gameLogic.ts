import { ChessPiece, Position, GameState } from '../types';

const PIECES: { [key: string]: string } = {
  king: '♔',
  queen: '♕',
  rook: '♖',
  bishop: '♗',
  knight: '♘',
  pawn: '♙'
};

export function initialBoard(): ChessPiece[][] {
  const board: ChessPiece[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Initialize pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black', symbol: '♟' };
    board[6][i] = { type: 'pawn', color: 'white', symbol: '♙' };
  }

  // Initialize other pieces
  const pieces: ('rook' | 'knight' | 'bishop' | 'queen' | 'king')[] = [
    'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'
  ];

  pieces.forEach((piece, i) => {
    board[0][i] = { type: piece, color: 'black', symbol: PIECES[piece].toLowerCase() };
    board[7][i] = { type: piece, color: 'white', symbol: PIECES[piece] };
  });

  return board;
}

export function findKing(board: ChessPiece[][], color: 'white' | 'black'): Position {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  throw new Error(`${color} king not found`);
}

export function isSquareUnderAttack(
  board: ChessPiece[][],
  position: Position,
  attackingColor: 'white' | 'black'
): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === attackingColor) {
        const moves = getPossibleMoves(board, row, col, true);
        if (moves.some(move => move.row === position.row && move.col === position.col)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function isKingInCheck(board: ChessPiece[][], color: 'white' | 'black'): boolean {
  const kingPosition = findKing(board, color);
  return isSquareUnderAttack(board, kingPosition, color === 'white' ? 'black' : 'white');
}

export function getDefensiveMoves(board: ChessPiece[][], color: 'white' | 'black'): Position[] {
  const kingPosition = findKing(board, color);
  const defensiveMoves: Position[] = [];

  // Check all pieces of the same color for moves that can block or capture the attacking piece
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getPossibleMoves(board, row, col, false);
        moves.forEach(move => {
          const testBoard = movePiece(board, { row, col }, move);
          if (!isKingInCheck(testBoard, color)) {
            defensiveMoves.push(move);
          }
        });
      }
    }
  }

  return defensiveMoves;
}

export function getPossibleMoves(
  board: ChessPiece[][],
  row: number,
  col: number,
  ignoreCheck: boolean = false
): Position[] {
  const piece = board[row][col];
  if (!piece) return [];

  const moves: Position[] = [];
  
  switch (piece.type) {
    case 'pawn':
      const direction = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      
      // Forward move
      if (!board[row + direction]?.[col]) {
        moves.push({ row: row + direction, col });
        // Double move from starting position
        if (row === startRow && !board[row + 2 * direction]?.[col]) {
          moves.push({ row: row + 2 * direction, col });
        }
      }
      
      // Capture moves
      [-1, 1].forEach(offset => {
        const target = board[row + direction]?.[col + offset];
        if (target && target.color !== piece.color) {
          moves.push({ row: row + direction, col: col + offset });
        }
      });
      break;

    case 'knight':
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      
      knightMoves.forEach(([dRow, dCol]) => {
        const newRow = row + dRow;
        const newCol = col + dCol;
        
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const target = board[newRow][newCol];
          if (!target || target.color !== piece.color) {
            moves.push({ row: newRow, col: newCol });
          }
        }
      });
      break;

    case 'bishop':
    case 'rook':
    case 'queen':
      const directions = piece.type === 'rook' 
        ? [[0, 1], [0, -1], [1, 0], [-1, 0]]
        : piece.type === 'bishop'
        ? [[1, 1], [1, -1], [-1, 1], [-1, -1]]
        : [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];

      directions.forEach(([dRow, dCol]) => {
        let newRow = row + dRow;
        let newCol = col + dCol;
        
        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const target = board[newRow][newCol];
          if (!target) {
            moves.push({ row: newRow, col: newCol });
          } else {
            if (target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol });
            }
            break;
          }
          newRow += dRow;
          newCol += dCol;
        }
      });
      break;

    case 'king':
      const kingMoves = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
      
      kingMoves.forEach(([dRow, dCol]) => {
        const newRow = row + dRow;
        const newCol = col + dCol;
        
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const target = board[newRow][newCol];
          if (!target || target.color !== piece.color) {
            moves.push({ row: newRow, col: newCol });
          }
        }
      });
      break;
  }

  if (!ignoreCheck) {
    // Filter out moves that would leave or put the king in check
    return moves.filter(move => {
      const testBoard = movePiece(board, { row, col }, move);
      return !isKingInCheck(testBoard, piece.color);
    });
  }

  return moves;
}

export function movePiece(
  board: ChessPiece[][],
  from: Position,
  to: Position
): ChessPiece[][] {
  const newBoard = board.map(row => [...row]);
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;
  return newBoard;
}

export function getGameState(board: ChessPiece[][], currentPlayer: 'white' | 'black'): GameState {
  const isInCheck = isKingInCheck(board, currentPlayer);
  const hasValidMoves = board.some((row, rowIndex) =>
    row.some((piece, colIndex) =>
      piece?.color === currentPlayer && getPossibleMoves(board, rowIndex, colIndex).length > 0
    )
  );

  if (isInCheck && !hasValidMoves) {
    return 'checkmate';
  } else if (!isInCheck && !hasValidMoves) {
    return 'stalemate';
  } else if (isInCheck) {
    return 'check';
  }
  return 'playing';
}