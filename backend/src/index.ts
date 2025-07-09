import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { characters, actions } from './gameData.js';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import crypto from 'crypto';

// Initialize Firebase Admin
import serviceAccount from './service-account.json' assert { type: 'json' };
initializeApp({
  credential: cert(serviceAccount as any),
  databaseURL: "https://weekend-pacs-default-rtdb.europe-west1.firebasedatabase.app/"
});

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Firebase reference
const db = getDatabase();
const teamsRef = db.ref('teams');
// Firebase reference for game settings
const settingsRef = db.ref('gameSettings');

// Admin middleware
const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Get game settings
app.get('/api/game-settings', async (req, res) => {
  try {
    const snapshot = await settingsRef.once('value');
    const settings = snapshot.val();
    const defaultSettings = { totalPlayers: 6, timerDuration: 60, numberOfTeams: 2 };
    res.json({ ...defaultSettings, ...settings });
  } catch (error) {
    console.error('Error fetching game settings:', error);
    res.status(500).json({ error: 'Failed to fetch game settings' });
  }
});

// Update game settings
app.put('/api/game-settings', isAdmin, async (req, res) => {
  try {
    const { totalPlayers, timerDuration, numberOfTeams } = req.body;
    if (
      typeof totalPlayers !== 'number' ||
      typeof timerDuration !== 'number' ||
      typeof numberOfTeams !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid settings' });
    }
    await settingsRef.set({ totalPlayers, timerDuration, numberOfTeams });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating game settings:', error);
    res.status(500).json({ error: 'Failed to update game settings' });
  }
});

// Routes
app.get('/api/game-data', (req, res) => {
  res.json({
    characters: characters,
    actions: actions
  });
});

app.get('/api/teams', async (req, res) => {
  try {
    const snapshot = await teamsRef.once('value');
    const teams = snapshot.val() || {};
    res.json(Object.values(teams));
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

app.post('/api/teams', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const team = {
      id: crypto.randomUUID(),
      name,
      score: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await teamsRef.child(team.id).set(team);
    res.status(201).json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

app.put('/api/teams/:id/score', async (req, res) => {
  try {
    const { id } = req.params;
    const { newScore } = req.body;

    const teamRef = teamsRef.child(id);
    const snapshot = await teamRef.once('value');
    const team = snapshot.val();

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    await teamRef.update({
      score: newScore,
      updatedAt: new Date().toISOString()
    });

    res.json({
      ...team,
      score: newScore,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

app.delete('/api/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const teamRef = teamsRef.child(id);
    const snapshot = await teamRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Team not found' });
    }

    await teamRef.remove();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

// Admin endpoints
app.get('/api/admin/teams', isAdmin, async (req, res) => {
  try {
    const snapshot = await teamsRef.once('value');
    const teams = snapshot.val() || {};
    res.json(Object.values(teams));
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

app.post('/api/admin/teams', isAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const teamId = crypto.randomUUID();
    await teamsRef.child(teamId).set({
      id: teamId,
      name,
      score: 0
    });

    res.status(201).json({ id: teamId });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

app.put('/api/admin/teams/:id/score', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    if (score === undefined) {
      return res.status(400).json({ error: 'Score is required' });
    }

    await teamsRef.child(id).update({ score });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating team score:', error);
    res.status(500).json({ error: 'Failed to update team score' });
  }
});

app.delete('/api/admin/teams/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await teamsRef.child(id).remove();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
