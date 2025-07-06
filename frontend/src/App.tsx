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

  // Fetch settings from backend on mount
  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await api.getGameSettings();
        setTotalPlayers(settings.totalPlayers);
        setTimerDuration(settings.timerDuration);
      } catch (e) {
        console.warn('Could not fetch game settings from backend:', e);
      }
    };
    fetchSettings();
  }, []);
  const [gameStarted, setGameStarted] = useState(false);
  const [team1, setTeam1] = useState<TeamInfo | null>(null);
  const [team2, setTeam2] = useState<TeamInfo | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleStartGame = async (team1Name: string, team2Name: string) => {
    try {
      const [team1, team2] = await Promise.all([
        api.createTeam(team1Name),
        api.createTeam(team2Name)
      ]);
      
      setTeam1({
        ...team1,
        score: 0,
        currentPlayer: 1,
        totalPlayers,
        id: team1.id
      });
      setTeam2({
        ...team2,
        score: 0,
        currentPlayer: 0,
        totalPlayers,
        id: team2.id
      });
      setGameStarted(true);
    } catch (error) {
      console.error('Failed to create teams:', error);
    }
  };

  const handleRestartGame = () => {
    setTeam1(null);
    setTeam2(null);
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
              gameStarted ? (
                <div className="bg-transparent rounded-2xl shadow-xl h-full">
                  <Game 
                    onRestart={handleRestartGame}
                    team={team1!}
                    opponentTeam={team2!}
                    totalPlayers={totalPlayers}
                    timerDuration={timerDuration}
                  />
                </div>
              ) : (
                <StartScreen onStart={handleStartGame} />
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