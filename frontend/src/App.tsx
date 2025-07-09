import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TeamInfo } from './types/TeamInfo';
import { api } from './services/api';
import Game from './Game';
import StartScreen from './components/StartScreen';
import Admin from './components/Admin/Admin';
import AdminLogin from './components/Admin/AdminLogin';

function App() {
  const [totalPlayers, setTotalPlayers] = useState(6);
  const [timerDuration, setTimerDuration] = useState(60);
  const [numberOfTeams, setNumberOfTeams] = useState(2);

  // Fetch settings from backend on mount
  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.getGameSettings();
        console.log(settings);
        setTotalPlayers(settings.totalPlayers);
        setTimerDuration(settings.timerDuration);
        setNumberOfTeams(settings.numberOfTeams);
      } catch (e) {
        console.warn('Could not fetch game settings from backend:', e);
      }
    };
    fetchSettings();
  }, []);
  const [gameStarted, setGameStarted] = useState(false);
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleStartGame = async (teamNames: string[]) => {
    try {
      const createdTeams = await Promise.all(
        teamNames.map(name => api.createTeam(name))
      );

      const teamsInfo = createdTeams.map(team => ({
        ...team,
        score: 0,
        id: team.id,
        currentPlayer: 1,
      }));
      console.log(teamsInfo);
      setTeams(teamsInfo);
      setGameStarted(true);
    } catch (error) {
      console.error('Failed to create teams:', error);
    }
  };

  const handleRestartGame = () => {
    setTeams([]);
    setGameStarted(false);
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="h-screen flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl h-full">
          <Routes>
            <Route path="/" element={
              gameStarted && teams.length > 0 ? (
                <div className="bg-transparent rounded-2xl shadow-xl h-full">
                  <Game 
                    onRestart={handleRestartGame}
                    teams={teams}
                    setTeams={setTeams}
                    totalPlayers={totalPlayers}
                    timerDuration={timerDuration}
                  />
                </div>
              ) : (
                <StartScreen onStart={handleStartGame} numberOfTeams={numberOfTeams} />
              )
            } />
            <Route path="/admin" element={
              isAdmin ? (
                <Admin 
                  onLogout={handleAdminLogout}
                  totalPlayers={totalPlayers}
                  setTotalPlayers={setTotalPlayers}
                  timerDuration={timerDuration}
                  setTimerDuration={setTimerDuration}
                  numberOfTeams={numberOfTeams}
                  setNumberOfTeams={setNumberOfTeams}
                />
              ) : <AdminLogin onLogin={handleAdminLogin} />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;