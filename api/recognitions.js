// Vercel serverless function for recognitions
const sqlite3 = require('sqlite3').verbose();

// Use in-memory database for Vercel
const db = new sqlite3.Database(':memory:');

// Initialize database with sample data
db.serialize(() => {
  // Create recognitions table
  db.run(`
    CREATE TABLE IF NOT EXISTS recognitions (
      id TEXT PRIMARY KEY,
      from_user TEXT NOT NULL,
      to_user TEXT NOT NULL,
      message TEXT NOT NULL,
      value TEXT NOT NULL,
      points INTEGER NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  // Insert sample data
  db.get("SELECT COUNT(*) as count FROM recognitions", (err, row) => {
    if (err) {
      console.error('Error checking recognitions:', err);
      return;
    }
    
    if (row.count === 0) {
      const sampleRecognitions = [
        {
          id: generateUUID(),
          from_user: "Sarah Chen",
          to_user: "Mike Johnson",
          message: "Outstanding leadership on the Q4 product launch! Your strategic vision and execution were exceptional.",
          value: "Excellence",
          points: 50,
          created_at: new Date().toISOString()
        },
        {
          id: generateUUID(),
          from_user: "Emma Wilson",
          to_user: "Alex Rivera",
          message: "Your UX designs for the new dashboard are absolutely stunning! The user feedback has been overwhelmingly positive.",
          value: "Innovation",
          points: 40,
          created_at: new Date().toISOString()
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO recognitions (id, from_user, to_user, message, value, points, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      sampleRecognitions.forEach(rec => {
        stmt.run(rec.id, rec.from_user, rec.to_user, rec.message, rec.value, rec.points, rec.created_at);
      });

      stmt.finalize();
    }
  });
});

// Generate UUID function
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = function handler(req, res) {
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
