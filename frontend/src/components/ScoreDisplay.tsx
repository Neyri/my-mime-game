import React from 'react';
import { Trophy } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  isGameOver: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, isGameOver }) => {
  return (
    <div className={`flex items-center ${isGameOver ? 'justify-center' : 'justify-end'} mb-4`}>
      {isGameOver ? (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
          <Trophy size={32} />
          <div className="text-3xl font-bold">{score}</div>
        </div>
      ) : (
        <div className="bg-indigo-100 px-4 py-2 rounded-lg shadow flex items-center gap-2">
          <span className="text-gray-700 font-medium">Score:</span>
          <span className="text-indigo-700 font-bold text-xl">{score}</span>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;