import React, { useState } from 'react';

interface StartScreenProps {
  onStart: (team1Name: string, team2Name: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');

  const handleStart = () => {
    if (team1Name.trim() && team2Name.trim()) {
      onStart(team1Name, team2Name);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className=" bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 w-full max-w-lg mx-auto bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-white">
        <h1 className="text-5xl font-extrabold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
          Le Grand Défi
        </h1>
        <p className="text-center text-lg text-gray-300 mb-8">Préparez-vous à mimer, deviner et rire ! Tous les thèmes proposés sont en lien avec votre couple préféré</p>

        <div className="space-y-6 text-xl">
          <div>
            <label htmlFor="team1" className="block text-xl font-semibold mb-2 text-indigo-200">Équipe 1</label>
            <input
              id="team1"
              type="text"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              placeholder="Nom de l'équipe 1"
              className="w-full p-3 bg-white/20 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:bg-white/30 transition-all placeholder-gray-400 text-white"
            />
          </div>

          <div>
            <label htmlFor="team2" className="block text-xl font-semibold mb-2 text-purple-200">Équipe 2</label>
            <input
              id="team2"
              type="text"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              placeholder="Nom de l'équipe 2"
              className="w-full p-3 bg-white/20 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:bg-white/30 transition-all placeholder-gray-400 text-white"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleStart}
            disabled={!team1Name.trim() || !team2Name.trim()}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all transform hover:scale-105 text-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            Lancer la partie !
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;