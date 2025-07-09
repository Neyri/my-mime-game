import React, { useState, useEffect } from 'react';

interface StartScreenProps {
  onStart: (teamNames: string[]) => void;
  numberOfTeams: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, numberOfTeams }) => {
  const [teamNames, setTeamNames] = useState<string[]>(() => Array(numberOfTeams).fill(''));

  useEffect(() => {
    setTeamNames(Array(numberOfTeams).fill(''));
  }, [numberOfTeams]);

  const handleTeamNameChange = (index: number, name: string) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = name;
    setTeamNames(newTeamNames);
  };

  const handleStart = () => {
    if (teamNames.every(name => name.trim())) {
      onStart(teamNames);
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
          {[...Array(numberOfTeams).keys()].map((index) => (
            <div key={index}>
              <label htmlFor={`team${index + 1}`} className="block text-xl font-semibold mb-2 text-indigo-200">{`Équipe ${index + 1}`}</label>
              <input
                id={`team${index + 1}`}
                type="text"
                value={teamNames[index] || ''}
                onChange={(e) => handleTeamNameChange(index, e.target.value)}
                placeholder={`Nom de l'équipe ${index + 1}`}
                className="w-full p-3 bg-white/20 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:bg-white/30 transition-all placeholder-gray-400 text-white"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleStart}
            disabled={!teamNames.every(name => name.trim())}
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