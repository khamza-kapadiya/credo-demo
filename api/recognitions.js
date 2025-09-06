// Vercel serverless function for recognitions
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize SQLite database
const dbPath = path.join(__dirname, '../backend/credo.db');
const db = new sqlite3.Database(dbPath);

// Generate UUID function
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Get all recognitions
    db.all('SELECT * FROM recognitions ORDER BY created_at DESC', (err, rows) => {
      if (err) {
        console.error('Error fetching recognitions:', err);
        res.status(500).json({ error: 'Failed to fetch recognitions' });
        return;
      }
      res.json(rows || []);
    });
  } else if (req.method === 'POST') {
    // Add new recognition
    const { from_user, to_user, message, value, points } = req.body;
    
    if (!from_user || !to_user || !message || !value || !points) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const id = generateUUID();
    const created_at = new Date().toISOString();

    db.run(
      'INSERT INTO recognitions (id, from_user, to_user, message, value, points, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, from_user, to_user, message, value, points, created_at],
      function(err) {
        if (err) {
          console.error('Error adding recognition:', err);
          res.status(500).json({ error: 'Failed to add recognition' });
          return;
        }
        
        res.json({
          id,
          from_user,
          to_user,
          message,
          value,
          points,
          created_at
        });
      }
    );
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
