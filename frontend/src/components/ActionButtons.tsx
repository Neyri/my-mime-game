import React from 'react';

interface ActionButtonsProps {
  onValidate: () => void;
  onSkip: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onValidate, onSkip }) => {
  return (
    <div className="flex justify-center gap-6 mt-6">
      <button
        onClick={onValidate}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105"
      >
        Correct!
      </button>
      
      <button
        onClick={onSkip}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105"
      >
        Passer
      </button>
    </div>
  );
};

export default ActionButtons;