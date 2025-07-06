import React from 'react';

interface GamePromptProps {
  character: string;
  action: string;
}

const GamePrompt: React.FC<GamePromptProps> = ({ character, action }) => {
  return (
    <div className="flex flex-col items-center mb-8 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Mimez ceci :</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-indigo-200 max-w-md w-full">
        <p className="text-center text-3xl font-bold text-indigo-700">
          {character}
        </p>
        <p className="text-center text-xl mt-2 mb-1 text-gray-500">qui</p>
        <p className="text-center text-3xl font-bold text-indigo-700">
          {action}
        </p>
      </div>
    </div>
  );
};

export default React.memo(GamePrompt);