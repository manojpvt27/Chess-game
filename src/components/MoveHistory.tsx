import React from 'react';
import { Move } from '../types';
import { Clock } from 'lucide-react';

interface MoveHistoryProps {
  moves: Move[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 w-64 h-[600px] overflow-y-auto">
      <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
        <Clock size={20} />
        Move History
      </h2>
      <div className="space-y-2">
        {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => (
          <div key={i} className="flex items-center text-white p-2 hover:bg-gray-700 rounded">
            <span className="w-8 text-gray-400">{i + 1}.</span>
            <span className="w-20">{moves[i * 2]?.notation}</span>
            <span className="flex-1">{moves[i * 2 + 1]?.notation}</span>
          </div>
        ))}
      </div>
    </div>
  );
}