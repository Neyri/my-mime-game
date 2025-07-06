import React from 'react';

interface TeamCardProps {
  teamName: string;
  score: number;
  isWinner?: boolean;
  isCurrent?: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({ teamName, score, isWinner = false, isCurrent = false }) => {
  const backgroundColor = isWinner 
    ? 'bg-green-100' 
    : isCurrent 
      ? 'bg-blue-100' 
      : 'bg-gray-100';
  
  const textColor = isWinner 
    ? 'text-green-700' 
    : isCurrent 
      ? 'text-blue-700' 
      : 'text-gray-700';

  return (
    <div className={`p-4 rounded-lg ${backgroundColor} ${textColor} flex flex-col items-center`}>      
      <div className="text-2xl font-bold mb-2">{teamName}</div>
      <div className="text-3xl font-bold">Score: {score}</div>
    </div>
  );
};

export default TeamCard;
