import React from 'react';
import { ChessPiece, Position } from '../types';

interface SquareProps {
  piece: ChessPiece | null;
  position: Position;
  isSelected: boolean;
  isPossibleMove: boolean;
  isUnderAttack: boolean;
  isDefensiveMove: boolean;
  onClick: () => void;
}

export default function Square({
  piece,
  position,
  isSelected,
  isPossibleMove,
  isUnderAttack,
  isDefensiveMove,
  onClick
}: SquareProps) {
  const isLight = (position.row + position.col) % 2 === 0;
  
  return (
    <div
      onClick={onClick}
      className={`
        w-16 h-16 flex items-center justify-center relative cursor-pointer
        ${isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'}
        ${isSelected ? 'ring-4 ring-blue-400 ring-inset' : ''}
        ${isPossibleMove ? 'after:absolute after:w-4 after:h-4 after:bg-green-500/30 after:rounded-full' : ''}
        ${isUnderAttack ? 'ring-2 ring-red-500 ring-inset' : ''}
        ${isDefensiveMove ? 'ring-2 ring-green-500 ring-inset' : ''}
        hover:opacity-95 transition-opacity
      `}
    >
      {piece && (
        <span 
          className={`text-5xl select-none ${
            piece.color === 'white' 
              ? 'text-[#fff] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]' 
              : 'text-[#000] drop-shadow-[0_2px_2px_rgba(255,255,255,0.2)]'
          }`}
          style={{ 
            fontFamily: "'Noto Chess', 'Segoe UI Symbol', 'Arial Unicode MS', sans-serif",
            transform: 'translateY(-2px)'
          }}
        >
          {piece.symbol}
        </span>
      )}
    </div>
  );
}