import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TeamInfo } from './types/TeamInfo';
import { api } from './services/api';
import Timer from './components/Timer';
import GamePrompt from './components/GamePrompt';
import ActionButtons from './components/ActionButtons';

import PlayerIndicator from './components/PlayerIndicator';
import ScoreDisplay from './components/ScoreDisplay';
import GameOverScreen from './components/GameOverScreen';
import WaitingScreen from './components/WaitingScreen';
import { GameData } from './types/GameData';
import { RandomGenerator } from './utils/randomGenerator';

interface GameProps {
  onRestart: () => void;
  teams: TeamInfo[];
  setTeams: React.Dispatch<React.SetStateAction<TeamInfo[]>>;
  totalPlayers: number;
  timerDuration: number;
}

const Game: React.FC<GameProps> = ({ onRestart, teams, setTeams, totalPlayers, timerDuration }) => {
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [currentRound, setCurrentRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState('');
  const [currentAction, setCurrentAction] = useState('');
  const [gameData, setGameData] = useState<GameData>({ characters: [], actions: [] });

  const teamInfo = teams; // Use the prop directly
  const setTeamInfo = setTeams; // Use the prop directly

  useEffect(() => {
    const initializeGame = async () => {
      try {
        await RandomGenerator.waitForInitialization();
        setIsTimerActive(true); // Start timer when game initializes
        setTimeLeft(timerDuration);
        await loadGameData();


      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };

    if (isWaiting) {
      initializeGame();
    }
  }, [isWaiting, timerDuration, teamInfo.length, totalPlayers]);

  const playersPerTeam = useMemo(() => {
    return teamInfo.length > 0 ? Math.ceil(totalPlayers / teamInfo.length) : 0;
  }, [totalPlayers, teamInfo.length]);

  useEffect(() => {
    loadGameData();
  }, []);

  const generateRandomPrompt = useCallback(async () => {
    if (gameData.characters.length === 0 || gameData.actions.length === 0) return;

    const { character, action } = await RandomGenerator.getRandomCombination();
    setCurrentCharacter(character);
    setCurrentAction(action);
  }, [gameData.characters, gameData.actions]);

  useEffect(() => {
    if (gameData.characters.length > 0 && gameData.actions.length > 0) {
      generateRandomPrompt();
    }
  }, [gameData.characters, gameData.actions, generateRandomPrompt]);

  const loadGameData = async () => {
    try {
      // Only load if we don't already have data
      if (gameData.characters.length === 0 || gameData.actions.length === 0) {
        const data = await api.getGameData();
        RandomGenerator.reset();
        setGameData(data);
      }
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
  };

  const handleTimeUp = () => {
    console.log("Time up");
    const nextTeamIndex = (currentTeamIndex + 1) % teamInfo.length;
    
    const isLastTeam = currentTeamIndex === teamInfo.length - 1;

    // Check for game over condition
    if (isLastTeam && currentRound > playersPerTeam) {
      setIsGameOver(true);
      return; // Game is over, no more state updates
    }

    // If it was the last team's turn, we start a new round
    if (isLastTeam) {
      setCurrentRound(r => r + 1);
    }

    // Switch to the next team and enter waiting state
    setCurrentTeamIndex(nextTeamIndex);
    setIsTimerActive(false);
    setIsWaiting(true);
  };

  const handleValidate = () => {
    setTeamInfo(prev =>
      prev.map((t, index) =>
        index === currentTeamIndex ? { ...t, score: t.score + 1 } : t
      )
    );
    generateRandomPrompt();
  };

  const handlePlayerReady = () => {
    setIsWaiting(false);
    setTimeLeft(timerDuration);
    setIsTimerActive(true);
    generateRandomPrompt();
  };

  const handleSkip = () => {
    generateRandomPrompt();
  };

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTimerActive, timeLeft]);

  useEffect(() => {
    if (isGameOver) {
      const saveScores = async () => {
        setIsSaving(true);
        try {
          await Promise.all(teamInfo.map(t => api.saveGame(t.id, t.score)));
        } catch (error) {
          console.error("Failed to save scores", error);
        } finally {
          setIsSaving(false);
        }
      };
  
      saveScores();
    }
  }, [isGameOver, teamInfo]);

  if (teamInfo.length === 0) {
    // Render a loading state or redirect
    return <div>Loading...</div>;
  }

  if (isGameOver) {
    return (
      <GameOverScreen
        teams={teamInfo}
        onRestart={onRestart}
        isSaving={isSaving}
      />
    );
  }

  if (isWaiting) {
    // const playersPerTeam = totalPlayers / teamInfo.length;

    return (
      <WaitingScreen
        teams={teamInfo}
        currentTeamIndex={currentTeamIndex}
        currentRound={currentRound}
        playersPerTeam={totalPlayers}
        onNext={handlePlayerReady}
      />
    );
  }

  const currentTeam = teamInfo[currentTeamIndex];

  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col h-full justify-center">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          {/* Team Name */}
          <div className="order-1 md:order-2 w-full md:w-auto">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-4 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider text-center">{currentTeam?.name}</h2>
            </div>
          </div>

          {/* Wrapper for Player Indicator and Score Display */}
          <div className="order-2 flex justify-between w-full md:contents">
            {/* Player Indicator */}
            <div className="md:order-1">
              <PlayerIndicator currentPlayer={currentRound} totalPlayers={totalPlayers} />
            </div>

            {/* Score Display */}
            <div className="md:order-3">
              <ScoreDisplay score={currentTeam?.score ?? 0} isGameOver={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <Timer
          duration={timerDuration}
          timeLeft={timeLeft}
          isActive={isTimerActive}
          onTimeUp={handleTimeUp}
        />
      </div>

      {/* Game Area */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-600/40 to-indigo-700/40 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl text-white">
        <GamePrompt character={currentCharacter} action={currentAction} />
      </div>

      {/* Action Buttons */}
      <div className="mt-6">
        <ActionButtons onValidate={handleValidate} onSkip={handleSkip} />
      </div>
    </div>
  );
};

export default Game;