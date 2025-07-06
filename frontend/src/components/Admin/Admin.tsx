import React, { useState, useEffect, useMemo } from 'react';
import { Team, api } from '../../services/api';

interface AdminProps {
  onLogout: () => void;
  totalPlayers: number;
  setTotalPlayers: (n: number) => void;
  timerDuration: number;
  setTimerDuration: (n: number) => void;
}

const Admin: React.FC<AdminProps> = ({ onLogout, totalPlayers, setTotalPlayers, timerDuration, setTimerDuration }) => {
  const [localTotalPlayers, setLocalTotalPlayers] = useState(totalPlayers);
  const [localTimerDuration, setLocalTimerDuration] = useState(timerDuration);

  const [teams, setTeams] = useState<Team[]>([]);
  // localTotalPlayers and localTimerDuration are synced with backend settings

  const [newTeamName, setNewTeamName] = useState('');
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'score'; direction: 'ascending' | 'descending' | null }>({
    key: 'score',
    direction: 'descending',
  });

  useEffect(() => {
    fetchTeams();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settings = await api.getGameSettings();
      setLocalTotalPlayers(settings.totalPlayers);
      setLocalTimerDuration(settings.timerDuration);
      setTotalPlayers(settings.totalPlayers);
      setTimerDuration(settings.timerDuration);
    } catch (error) {
      alert('Failed to fetch game settings');
    }
  };

  const handleSettingsChange = async (field: 'totalPlayers' | 'timerDuration', value: number) => {
    const newSettings = {
      totalPlayers: field === 'totalPlayers' ? value : localTotalPlayers,
      timerDuration: field === 'timerDuration' ? value : localTimerDuration
    };
    setLocalTotalPlayers(newSettings.totalPlayers);
    setLocalTimerDuration(newSettings.timerDuration);
    setTotalPlayers(newSettings.totalPlayers);
    setTimerDuration(newSettings.timerDuration);
    try {
      await api.updateGameSettings(newSettings);
    } catch (error) {
      alert('Failed to update game settings');
    }
  };


  const fetchTeams = async () => {
    try {
      const teams = await api.getTeams();
      setTeams(teams);
    } catch (error) {
      alert('Failed to fetch teams'); 
    }
  };

  const sortedTeams = useMemo(() => {
    const sortableTeams = [...teams];
    if (sortConfig.key) {
      sortableTeams.sort((a, b) => {
        let valueA: number | string = '';
        let valueB: number | string = '';

        if (sortConfig.key === 'name') {
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
        } else if (sortConfig.key === 'score') {
          valueA = a.score;
          valueB = b.score;
        }

        if (valueA < valueB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTeams;
  }, [teams, sortConfig]);

  const requestSort = (key: 'name' | 'score') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const renderArrow = (key: 'name' | 'score') => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

    const handleDeleteSelectedTeams = async () => {
    try {
      await Promise.all(selectedTeamIds.map(id => api.deleteTeam(id)));
      alert('Selected teams deleted successfully');
      fetchTeams();
      setSelectedTeamIds([]);
    } catch (error) {
      alert('Failed to delete selected teams');
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await api.deleteTeam(teamId);
      alert('Team deleted successfully'); 
      fetchTeams();
    } catch (error) {
      alert('Failed to delete team'); 
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;

    try {
      await api.createTeam(newTeamName);
      alert('Team created successfully'); 
      setNewTeamName('');
      fetchTeams();
    } catch (error) {
      alert('Failed to create team'); 
    }
  };

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTeamName(e.target.value);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Logout
        </button>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Game Settings</h2>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Total Players</label>
            <input
              type="number"
              min={2}
              max={20}
              value={localTotalPlayers}
              onChange={e => handleSettingsChange('totalPlayers', Number(e.target.value))}
              className="w-32 px-2 py-1 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Timer Duration (seconds)</label>
            <input
              type="number"
              min={10}
              max={600}
              value={localTimerDuration}
              onChange={e => handleSettingsChange('timerDuration', Number(e.target.value))}
              className="w-32 px-2 py-1 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTeamName}
            onChange={handleTeamNameChange}
            placeholder="Enter team name"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button onClick={handleCreateTeam} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Create Team
          </button>
        </div>
      </div>

            <div className="mb-4">
        {selectedTeamIds.length > 0 && (
          <button 
            onClick={handleDeleteSelectedTeams}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
            disabled={selectedTeamIds.length === 0}
          >
            Delete Selected ({selectedTeamIds.length})
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('name')}
              >
                Team Name {renderArrow('name')}
              </th>
              <th 
                className="px-6 py-3 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('score')}
              >
                Score {renderArrow('score')}
              </th>
              <th className="px-6 py-3 text-left">Actions</th>
              <th className="px-6 py-3 text-left">
                <input 
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTeamIds(sortedTeams.map(t => t.id));
                    } else {
                      setSelectedTeamIds([]);
                    }
                  }}
                  checked={selectedTeamIds.length === sortedTeams.length && sortedTeams.length > 0}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team) => (
              <tr key={team.id} className="border-b">
                <td className="px-6 py-4">{team.name}</td>
                                <td className="px-6 py-4">{team.score}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="checkbox"
                    checked={selectedTeamIds.includes(team.id)}
                    onChange={() => {
                      setSelectedTeamIds(prev => 
                        prev.includes(team.id) 
                          ? prev.filter(id => id !== team.id) 
                          : [...prev, team.id]
                      );
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
