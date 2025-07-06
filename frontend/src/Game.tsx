import React, { useState, useCallback, useEffect } from 'react';
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
  team: TeamInfo;
  opponentTeam: TeamInfo;
  totalPlayers: number;
  timerDuration: number;
}

const Game: React.FC<GameProps> = ({ onRestart, team, opponentTeam, totalPlayers, timerDuration }) => {
  const [currentTeamId, setCurrentTeamId] = useState(team.id);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState('');
  const [currentAction, setCurrentAction] = useState('');
  const [gameData, setGameData] = useState<GameData>({ characters: [], actions: [] });
  const [teamInfo, setTeamInfo] = useState<TeamInfo[]>([
    { ...team },
    { ...opponentTeam }
  ]);

  useEffect(() => {
    // Initialize game state
    const initializeGame = async () => {
      try {
        await RandomGenerator.waitForInitialization();
        setIsWaiting(false);
        setIsTimerActive(true); // Start timer when game initializes
        setTimeLeft(timerDuration);
        await loadGameData();
        generateRandomPrompt();
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };

    initializeGame();

    return () => {
      RandomGenerator.cleanupStatic();
    };
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
    const nextTeamId = currentTeamId === team.id ? opponentTeam.id : team.id;

    // Update player for the next team
    setTeamInfo(prevTeamInfo => {
      const newTeamInfo = prevTeamInfo.map(t =>
        t.id === nextTeamId
          ? { ...t, currentPlayer: t.currentPlayer + 1 }
          : t
      );

      // Check for game over condition
      const nextTeam = newTeamInfo.find(t => t.id === nextTeamId);
      if (nextTeam && nextTeam.currentPlayer > totalPlayers) {
        setIsGameOver(true);
      }

      return newTeamInfo;
    });

    // Switch to the next team and enter waiting state
    setCurrentTeamId(nextTeamId);
    setIsTimerActive(false);
    setIsWaiting(true);
  };

  const handleValidate = () => {
    console.log(teamInfo);
    setTeamInfo(prev =>
      prev.map(t =>
        t.id === currentTeamId ? { ...t, score: t.score + 1 } : t
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
          const finalTeam1 = teamInfo.find(t => t.id === team.id);
          const finalTeam2 = teamInfo.find(t => t.id === opponentTeam.id);
  
          if (finalTeam1) await api.saveGame(finalTeam1.id.toString(), finalTeam1.score);
          if (finalTeam2) await api.saveGame(finalTeam2.id.toString(), finalTeam2.score);
        } catch (error) {
          console.error("Failed to save scores", error);
        } finally {
          setIsSaving(false);
        }
      };
  
      saveScores();
    }
  }, [isGameOver, teamInfo, team.id, opponentTeam.id]);

  if (!team || !opponentTeam) {
    return <WaitingScreen
      teamName=""
      opponentTeamName=""
      currentPlayer={0}
      opponentPlayer={0}
      totalPlayers={totalPlayers}
      onNext={handlePlayerReady}
      teamScore={0}
      opponentScore={0}
    />;
  }

  if (isGameOver) {
    const finalTeam = teamInfo.find(t => t.id === team.id);
    const finalOpponentTeam = teamInfo.find(t => t.id === opponentTeam.id);
    return (
      <GameOverScreen
        teamName={team.name}
        opponentTeamName={opponentTeam.name}
        score={finalTeam?.score ?? 0}
        opponentScore={finalOpponentTeam?.score ?? 0}
        onRestart={onRestart}
        teamId={team.id.toString()}
        opponentTeamId={opponentTeam.id.toString()}
        isSaving={isSaving}
      />
    );
  }

  if (isWaiting) {
    const currentTeamInfo = teamInfo.find(t => t.id === currentTeamId) || teamInfo[0];
    const opponentTeamInfo = teamInfo.find(t => t.id !== currentTeamId) || teamInfo[1];
    console.log(teamInfo);
    console.log(currentTeamId);


    return (
      <WaitingScreen
        teamName={currentTeamInfo.name}
        opponentTeamName={opponentTeamInfo.name}
        currentPlayer={currentTeamInfo.currentPlayer}
        opponentPlayer={opponentTeamInfo.currentPlayer}
        totalPlayers={totalPlayers}
        onNext={handlePlayerReady}
        teamScore={currentTeamInfo.score}
        opponentScore={opponentTeamInfo.score}
      />
    );
  }

  const currentTeam = teamInfo.find(t => t.id === currentTeamId);

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
              <PlayerIndicator currentPlayer={currentTeam?.currentPlayer ?? 0} totalPlayers={totalPlayers} />
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