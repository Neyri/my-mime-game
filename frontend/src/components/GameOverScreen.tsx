import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

interface GameOverScreenProps {
  teamName: string;
  opponentTeamName: string;
  score: number;
  opponentScore: number;
  onRestart: () => void;
  teamId: string;
  opponentTeamId: string;
  isSaving: boolean;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ teamName, opponentTeamName, score, opponentScore, onRestart, isSaving }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonDisabled(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []); // Empty dependency array ensures this runs only once

  const isTie = score === opponentScore;
  const team1IsWinner = score > opponentScore;
  const team2IsWinner = opponentScore > score;

  let winnerMessage;
  if (isTie) {
    winnerMessage = <p className="text-3xl text-center text-white font-bold mb-8">Égalité !</p>;
  } else {
    const winnerName = team1IsWinner ? teamName : opponentTeamName;
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

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-10">
          <div className={ `
            bg-black/20 backdrop-blur-sm rounded-2xl p-6 text-center w-full md:w-1/2
            transition-all duration-500
            ${team1IsWinner ? 'transform md:scale-110 border-2 border-yellow-400 shadow-yellow-400/50 shadow-lg' : 'opacity-70'}
          `}>
            <h3 className="text-3xl font-bold text-indigo-300 mb-3">{teamName}</h3>
            <p className="text-5xl font-bold">{score}</p>
          </div>
          
          <div className={ `
            bg-black/20 backdrop-blur-sm rounded-2xl p-6 text-center w-full md:w-1/2
            transition-all duration-500
            ${team2IsWinner ? 'transform md:scale-110 border-2 border-yellow-400 shadow-yellow-400/50 shadow-lg' : 'opacity-70'}
          `}>
            <h3 className="text-3xl font-bold text-purple-300 mb-3">{opponentTeamName}</h3>
            <p className="text-5xl font-bold">{opponentScore}</p>
          </div>
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