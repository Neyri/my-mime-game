import React from 'react';
import { ArrowRight } from 'lucide-react';
import PlayerIndicator from './PlayerIndicator';
import ScoreDisplay from './ScoreDisplay';

interface WaitingScreenProps {
  teamName: string;
  opponentTeamName: string;
  currentPlayer: number;
  opponentPlayer: number;
  totalPlayers: number;
  onNext: () => void;
  teamScore: number;
  opponentScore: number;
}

const WaitingScreen: React.FC<WaitingScreenProps> = ({ 
  teamName, 
  opponentTeamName,
  currentPlayer, 
  opponentPlayer,
  totalPlayers, 
  onNext, 
  teamScore,
  opponentScore,
}) => {

  const handleSubmit = () => {
    onNext();
  };

  const previousPlayer = opponentPlayer;
  const nextPlayer = currentPlayer;
  const previousTeam = opponentTeamName;
  const previousScore = opponentScore;
  const newTeam = teamName;
  const newScore = teamScore;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Previous Team Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Tour précédent</h3>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg text-gray-600">{previousTeam}</p>
              <p className="text-2xl font-semibold text-red-500">Temps écoulé !</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <PlayerIndicator currentPlayer={previousPlayer} totalPlayers={totalPlayers} />
              <ScoreDisplay score={previousScore} isGameOver={false} />
            </div>
          </div>
        </div>

        {/* New Team Card */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white transform scale-105">
          <h3 className="text-3xl font-bold mb-4 text-center">Prochain tour</h3>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-xl">Au tour de <span className="font-bold">{newTeam}</span></p>
              <p className="text-2xl mt-2">Joueur <span className="font-extrabold text-yellow-300">{nextPlayer}</span>, à toi !</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <PlayerIndicator currentPlayer={nextPlayer} totalPlayers={totalPlayers} />
              <ScoreDisplay score={newScore} isGameOver={false} />
            </div>
            <div className="flex justify-center pt-4">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
              >
                <span>Je suis prêt !</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingScreen;
