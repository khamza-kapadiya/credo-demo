// Vercel serverless function for team members
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize SQLite database
const dbPath = path.join(__dirname, '../backend/credo.db');
const db = new sqlite3.Database(dbPath);

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Get all team members
    db.all('SELECT * FROM team_members', (err, rows) => {
      if (err) {
        console.error('Error fetching team members:', err);
        res.status(500).json({ error: 'Failed to fetch team members' });
        return;
      }
      res.json(rows || []);
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
