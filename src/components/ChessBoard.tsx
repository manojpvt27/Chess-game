import React, { useState, useEffect } from 'react';
import Square from './Square';
import Timer from './Timer';
import MoveHistory from './MoveHistory';
import { initialBoard, isValidMove, movePiece, getPossibleMoves } from '../utils/gameLogic';
import { ChessPiece, Position, Move, GameTime } from '../types';
import { RotateCcw, Play, Pause } from 'lucide-react';

const INITIAL_TIME = 10 * 60; // 10 minutes per player

export default function ChessBoard() {
  const [board, setBoard] = useState<ChessPiece[][]>(initialBoard());
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [time, setTime] = useState<GameTime>({ white: INITIAL_TIME, black: INITIAL_TIME });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGameStarted && !isPaused) {
      interval = setInterval(() => {
        setTime(prevTime => ({
          ...prevTime,
          [currentPlayer]: Math.max(0, prevTime[currentPlayer] - 1)
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isGameStarted, isPaused, currentPlayer]);

  const handleSquareClick = (row: number, col: number) => {
    if (!isGameStarted || isPaused) return;
    
    if (!selectedPiece) {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        setSelectedPiece({ row, col });
        setPossibleMoves(getPossibleMoves(board, row, col));
      }
    } else {
      const moveIsValid = isValidMove(
        board,
        selectedPiece,
        { row, col },
        possibleMoves
      );

      if (moveIsValid) {
        const newBoard = movePiece(board, selectedPiece, { row, col });
        setBoard(newBoard);
        
        setMoves(prev => [...prev, {
          piece: board[selectedPiece.row][selectedPiece.col]!,
          from: selectedPiece,
          to: { row, col },
          timestamp: Date.now()
        }]);
        
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      }
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  const resetGame = () => {
    setBoard(initialBoard());
    setSelectedPiece(null);
    setCurrentPlayer('white');
    setPossibleMoves([]);
    setMoves([]);
    setTime({ white: INITIAL_TIME, black: INITIAL_TIME });
    setIsGameStarted(false);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="flex gap-8">
        <div className="flex flex-col items-center">
          <div className="mb-8 flex items-center justify-between w-full">
            <h1 className="text-4xl font-bold text-white">Chess Game</h1>
            <div className="flex items-center gap-4">
              {!isGameStarted ? (
                <button
                  onClick={() => setIsGameStarted(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Play size={20} />
                  Start Game
                </button>
              ) : (
                <button
                  onClick={togglePause}
                  className={`flex items-center gap-2 px-4 py-2 ${
                    isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
                  } text-white rounded-lg transition-colors`}
                >
                  {isPaused ? <Play size={20} /> : <Pause size={20} />}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              )}
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <RotateCcw size={20} />
                Reset Game
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between w-full mb-4">
            <Timer time={time.black} isActive={currentPlayer === 'black' && isGameStarted && !isPaused} />
            <div className={`px-4 py-2 rounded-lg ${
              currentPlayer === 'black' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } font-semibold`}>
              Black
            </div>
          </div>

          <div className="grid grid-cols-8 gap-0 border-8 border-[#8b4513] rounded-lg overflow-hidden shadow-2xl">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => (
                <Square
                  key={`${rowIndex}-${colIndex}`}
                  piece={piece}
                  position={{ row: rowIndex, col: colIndex }}
                  isSelected={selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex}
                  isPossibleMove={possibleMoves.some(
                    move => move.row === rowIndex && move.col === colIndex
                  )}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                />
              ))
            )}
          </div>

          <div className="flex items-center justify-between w-full mt-4">
            <Timer time={time.white} isActive={currentPlayer === 'white' && isGameStarted && !isPaused} />
            <div className={`px-4 py-2 rounded-lg ${
              currentPlayer === 'white' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } font-semibold`}>
              White
            </div>
          </div>
        </div>

        <MoveHistory moves={moves} />
      </div>
    </div>
  );
}