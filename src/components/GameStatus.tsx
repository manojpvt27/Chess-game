import React from 'react';
import { GameState } from '../types';
import { AlertTriangle, Shield } from 'lucide-react';

interface GameStatusProps {
  gameState: GameState;
  currentPlayer: 'white' | 'black';
}

export default function GameStatus({ gameState, currentPlayer }: GameStatusProps) {
  if (gameState === 'playing') return null;

  const messages = {
    check: `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} is in check!`,
    checkmate: `Checkmate! ${currentPlayer === 'white' ? 'Black' : 'White'} wins!`,
    stalemate: 'Stalemate! The game is a draw.'
  };

  const bgColors = {
    check: 'bg-yellow-600',
    checkmate: 'bg-red-600',
    stalemate: 'bg-blue-600'
  };

  return (
    <div className={`${bgColors[gameState]} text-white px-4 py-2 rounded-lg flex items-center gap-2`}>
      {gameState === 'check' ? <AlertTriangle size={20} /> : <Shield size={20} />}
      {messages[gameState]}
    </div>
  );
}