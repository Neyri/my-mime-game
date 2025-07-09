import React from 'react';
import { ArrowRight } from 'lucide-react';
import PlayerIndicator from './PlayerIndicator';
import { TeamInfo } from '../types/TeamInfo';
import ScoreDisplay from './ScoreDisplay';

interface WaitingScreenProps {
  teams: TeamInfo[];
  currentTeamIndex: number;
  currentRound: number;
  playersPerTeam: number;
  onNext: () => void;
}

const WaitingScreen: React.FC<WaitingScreenProps> = ({ 
  teams,
  currentTeamIndex,
  currentRound,
  playersPerTeam,
  onNext,
}) => {

  const handleSubmit = () => {
    onNext();
  };

  const currentTeam = teams[currentTeamIndex];
  const previousTeamIndex = (currentTeamIndex - 1 + teams.length) % teams.length;
  const previousTeam = teams[previousTeamIndex];

  // It's the first turn if the current team is the first in the list and it's their first player's turn.
  const isFirstTurnOfGame = currentTeamIndex === 0 && currentRound === 1;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className={`grid grid-cols-1 ${!isFirstTurnOfGame ? 'md:grid-cols-2' : ''} gap-8 items-center justify-center`}>
        {/* Previous Team Card (only shows after the first turn) */}
        {!isFirstTurnOfGame && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Tour précédent</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg text-gray-600">{previousTeam.name}</p>
                <p className="text-2xl font-semibold text-red-500">Temps écoulé !</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <PlayerIndicator currentPlayer={previousTeam.currentPlayer} totalPlayers={playersPerTeam} />
                <ScoreDisplay score={previousTeam.score} isGameOver={false} />
              </div>
            </div>
          </div>
        )}

        {/* New Team Card */}
        <div className={`bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white transform ${isFirstTurnOfGame ? 'md:col-span-2' : 'scale-105'}`}>
          <h3 className="text-3xl font-bold mb-4 text-center">Prochain tour</h3>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-xl">Au tour de <span className="font-bold">{currentTeam.name}</span></p>
              <p className="text-2xl mt-2">Joueur <span className="font-extrabold text-yellow-300">{currentTeam.currentPlayer}</span>, à toi !</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <PlayerIndicator currentPlayer={currentTeam.currentPlayer} totalPlayers={playersPerTeam} />
              <ScoreDisplay score={currentTeam.score} isGameOver={false} />
            </div>
            <div className="flex justify-center pt-4">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
              >
                <span>Suivant</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scoreboard */}
      {!isFirstTurnOfGame && (
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200">
          <h4 className="text-xl font-bold text-gray-700 mb-4 text-center">Tableau des scores</h4>
          <ul className="space-y-3">
            {teams
              .slice() // Create a shallow copy to avoid mutating the original array
              .sort((a, b) => b.score - a.score)
              .map((team, index) => (
                <li 
                  key={team.id} 
                  className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${team.id === currentTeam.id ? 'bg-purple-200 shadow-md' : 'bg-white/80'}`}>
                  <span className="font-semibold text-lg text-gray-800">{index + 1}. {team.name}</span>
                  <span className="font-bold text-xl text-purple-700">{team.score} pts</span>
                </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WaitingScreen;
