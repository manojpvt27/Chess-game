import React, { useState, useEffect } from 'react';
import Square from './components/Square';
import GameStatus from './components/GameStatus';
import MoveHistory from './components/MoveHistory';
import { ChessPiece, Position, Move, GameState } from './types';
import {
  initialBoard,
  getPossibleMoves,
  movePiece,
  isSquareUnderAttack,
  isKingInCheck,
  getDefensiveMoves,
  getGameState
} from './utils/gameLogic';
import { generateMoveNotation } from './utils/notation';
import { Timer } from 'lucide-react';

export default function App() {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(initialBoard());
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [moves, setMoves] = useState<Move[]>([]);
  const [time, setTime] = useState({ white: 600, black: 600 }); // 10 minutes per player

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameState === 'playing') {
        setTime(prev => ({
          ...prev,
          [currentPlayer]: Math.max(0, prev[currentPlayer] - 1)
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer, gameState]);

  const handleSquareClick = (position: Position) => {
    const piece = board[position.row][position.col];

    if (selectedSquare) {
      // If clicking on a possible move, make the move
      if (possibleMoves.some(move => move.row === position.row && move.col === position.col)) {
        const newBoard = movePiece(board, selectedSquare, position);
        const isCapture = board[position.row][position.col] !== null;
        const movedPiece = board[selectedSquare.row][selectedSquare.col]!;
        
        // Update game state
        setBoard(newBoard);
        const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
        setCurrentPlayer(nextPlayer);
        
        // Check game state after move
        const newGameState = getGameState(newBoard, nextPlayer);
        setGameState(newGameState);

        // Record move
        const moveNotation = generateMoveNotation(
          movedPiece,
          selectedSquare,
          position,
          isCapture,
          newGameState === 'check',
          newGameState === 'checkmate'
        );

        setMoves(prev => [...prev, {
          piece: movedPiece,
          from: selectedSquare,
          to: position,
          timestamp: Date.now(),
          notation: moveNotation
        }]);

        // Reset selection
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
      // If clicking on own piece, update selection
      else if (piece?.color === currentPlayer) {
        setSelectedSquare(position);
        setPossibleMoves(getPossibleMoves(board, position.row, position.col));
      }
      // If clicking elsewhere, clear selection
      else {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    }
    // If no square is selected and clicking on own piece, show possible moves
    else if (piece?.color === currentPlayer) {
      setSelectedSquare(position);
      setPossibleMoves(getPossibleMoves(board, position.row, position.col));
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="flex gap-8">
        {/* Left side - Move history */}
        <MoveHistory moves={moves} />

        {/* Center - Chess board and status */}
        <div className="space-y-4">
          {/* Timer for black */}
          <div className="flex items-center justify-end gap-2 text-white">
            <Timer size={20} />
            <span className="font-mono text-xl">{formatTime(time.black)}</span>
          </div>

          {/* Game status */}
          <div className="h-10">
            <GameStatus gameState={gameState} currentPlayer={currentPlayer} />
          </div>

          {/* Chess board */}
          <div className="grid grid-cols-8 bg-white rounded-lg overflow-hidden shadow-2xl">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const position = { row: rowIndex, col: colIndex };
                const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                const isPossibleMove = possibleMoves.some(
                  move => move.row === rowIndex && move.col === colIndex
                );
                const isUnderAttack = piece?.color === currentPlayer && 
                  isSquareUnderAttack(board, position, currentPlayer === 'white' ? 'black' : 'white');
                const isDefensiveMove = gameState === 'check' && 
                  getDefensiveMoves(board, currentPlayer).some(
                    move => move.row === rowIndex && move.col === colIndex
                  );

                return (
                  <Square
                    key={`${rowIndex}-${colIndex}`}
                    piece={piece}
                    position={position}
                    isSelected={isSelected}
                    isPossibleMove={isPossibleMove}
                    isUnderAttack={isUnderAttack}
                    isDefensiveMove={isDefensiveMove}
                    onClick={() => handleSquareClick(position)}
                  />
                );
              })
            )}
          </div>

          {/* Timer for white */}
          <div className="flex items-center gap-2 text-white">
            <Timer size={20} />
            <span className="font-mono text-xl">{formatTime(time.white)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}