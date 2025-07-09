import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { TeamInfo } from '../types/TeamInfo';

interface GameOverScreenProps {
  teams: TeamInfo[];
  onRestart: () => void;
  isSaving: boolean;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ teams, onRestart, isSaving }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonDisabled(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []); // Empty dependency array ensures this runs only once

  const maxScore = Math.max(...teams.map(t => t.score));
  const winners = teams.filter(t => t.score === maxScore);

  let winnerMessage;
  if (winners.length === teams.length && teams.length > 1) {
    winnerMessage = <p className="text-3xl text-center text-white font-bold mb-8">Égalité !</p>;
  } else if (winners.length > 1) {
    winnerMessage = (
      <div className="flex flex-col items-center gap-4 mb-8">
        <Trophy className="text-yellow-400" size={40} />
        <p className="text-3xl text-center text-white font-bold">Égalité entre les équipes :</p>
        <p className="text-2xl text-yellow-400 font-semibold">{winners.map(w => w.name).join(', ')}</p>
      </div>
    );
  } else {
    const winnerName = winners[0]?.name;
    winnerMessage = (
      <div className="flex justify-center items-center gap-4 mb-8">
        <Trophy className="text-yellow-400" size={40} />
        <p className="text-3xl text-center text-white font-bold">
          L'équipe <span className="text-yellow-400">{winnerName}</span> a gagné !
        </p>
        <Trophy className="text-yellow-400" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl shadow-2xl p-8 text-white border-4 border-yellow-500/50">
        <h3 className="text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
          Partie Terminée
        </h3>
        
        {winnerMessage}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {teams.map((team) => {
            const isWinner = winners.some(w => w.id === team.id);
            return (
              <div
                key={team.id}
                className={`
                  bg-black/20 backdrop-blur-sm rounded-2xl p-6 text-center
                  transition-all duration-500
                  ${isWinner ? 'transform md:scale-110 border-2 border-yellow-400 shadow-yellow-400/50 shadow-lg' : 'opacity-70'}
                `}
              >
                <h3 className="text-3xl font-bold text-indigo-300 mb-3 truncate">{team.name}</h3>
                <p className="text-5xl font-bold">{team.score}</p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onRestart}
            disabled={isSaving || isButtonDisabled}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-transform transform hover:scale-105 text-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Rejouer
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;