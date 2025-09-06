// Vercel serverless function for stats
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
    // Get stats
    db.get('SELECT COUNT(*) as totalRecognitions FROM recognitions', (err, recCount) => {
      if (err) {
        console.error('Error fetching recognition count:', err);
        res.status(500).json({ error: 'Failed to fetch stats' });
        return;
      }

      db.get('SELECT COUNT(*) as totalMembers FROM team_members', (err, memberCount) => {
        if (err) {
          console.error('Error fetching member count:', err);
          res.status(500).json({ error: 'Failed to fetch stats' });
          return;
        }

        res.json({
          totalSent: recCount?.totalRecognitions || 0,
          totalReceived: recCount?.totalRecognitions || 0,
          teamMembers: memberCount?.totalMembers || 0,
          streak: 12
        });
      });
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
