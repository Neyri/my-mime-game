import { API_URL } from '../config';
import axios from 'axios';

console.log('API URL:', API_URL);

export interface Team {
  id: string;
  name: string;
  score: number;
}

export interface GameData {
  characters: string[];
  actions: string[];
}

export const api = {
  async getGameSettings(): Promise<{ totalPlayers: number; timerDuration: number }> {
    const response = await fetch(`${API_URL}/game-settings`);
    if (!response.ok) throw new Error('Failed to fetch game settings');
    return response.json();
  },

  async updateGameSettings(settings: { totalPlayers: number; timerDuration: number }): Promise<void> {
    const response = await fetch(`${API_URL}/game-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error('Failed to update game settings');
  },
  // Game data
  async getGameData(): Promise<GameData> {
    const response = await fetch(`${API_URL}/game-data`);
    if (!response.ok) throw new Error('Failed to fetch game data');
    return response.json();
  },

  // Teams
  async getTeams(): Promise<Team[]> {
    const response = await fetch(`${API_URL}/teams`);
    if (!response.ok) throw new Error('Failed to fetch teams');
    return response.json();
  },

  async createTeam(name: string): Promise<Team> {
    const response = await fetch(`${API_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to create team');
    return response.json();
  },

  async updateScore(teamId: string, scoreChange: { newScore: number }): Promise<Team> {
    const response = await fetch(`${API_URL}/teams/${teamId}/score`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreChange)
    });
    if (!response.ok) throw new Error('Failed to update score');
    return response.json();
  },

  async deleteTeam(teamId: string): Promise<void> {
    const response = await fetch(`${API_URL}/teams/${teamId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete team');
  },

  async saveGame(teamId: string, score: number): Promise<void> {
    // Update the team's score using the existing endpoint
    console.log(score)
    await api.updateScore(teamId, { newScore: score });
  },

  // Admin API endpoints
  getAdminTeams: async (): Promise<Team[]> => {
    const response = await axios.get('/api/admin/teams', {
      headers: {
        Authorization: 'Bearer admin123'
      }
    });
    return response.data;
  },

  createAdminTeam: async (name: string): Promise<Team> => {
    const response = await axios.post('/api/admin/teams', { name }, {
      headers: {
        Authorization: 'Bearer admin123'
      }
    });
    return {
      id: response.data.id,
      name,
      score: 0
    };
  },

  updateAdminTeamScore: async (teamId: string, score: number): Promise<void> => {
    await axios.put(`/api/admin/teams/${teamId}/score`, { score }, {
      headers: {
        Authorization: 'Bearer admin123'
      }
    });
  },

  deleteAdminTeam: async (teamId: string): Promise<void> => {
    await axios.delete(`/api/admin/teams/${teamId}`, {
      headers: {
        Authorization: 'Bearer admin123'
      }
    });
  }
};
