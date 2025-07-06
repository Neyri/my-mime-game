import React from 'react';

interface PlayerIndicatorProps {
  currentPlayer: number;
  totalPlayers: number;
}

const PlayerIndicator: React.FC<PlayerIndicatorProps> = ({ currentPlayer, totalPlayers }) => {
  return (
    <div className="flex flex-col items-center mb-4">
      <h2 className="text-xl font-bold mb-2">Joueur {currentPlayer}</h2>
      <div className="flex space-x-2">
        {Array.from({ length: totalPlayers }, (_, index) => (
          <div 
            key={index}
            className={`w-3 h-3 rounded-full ${
              index < currentPlayer - 1 
                ? 'bg-gray-400' 
                : index === currentPlayer - 1 
                  ? 'bg-indigo-500 animate-pulse' 
                  : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerIndicator;