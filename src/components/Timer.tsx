import React from 'react';

interface TimerProps {
  time: number;
  isActive: boolean;
}

export default function Timer({ time, isActive }: TimerProps) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className={`px-4 py-2 rounded-lg ${
      isActive ? 'bg-indigo-600' : 'bg-gray-700'
    } text-white font-mono text-xl`}>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}