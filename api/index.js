// Vercel serverless function for the backend API
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database - handle Vercel's file system
let dbPath;
try {
  // Try to use the backend database file
  dbPath = path.join(__dirname, '../backend/credo.db');
} catch (error) {
  // Fallback to temporary database for Vercel
  dbPath = ':memory:';
}

const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Create recognitions table
  db.run(`
    CREATE TABLE IF NOT EXISTS recognitions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user TEXT NOT NULL,
      to_user TEXT NOT NULL,
      message TEXT NOT NULL,
      value TEXT NOT NULL,
      points INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create team_members table
  db.run(`
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT NOT NULL
    )
  `);

  // Insert sample data if tables are empty
  db.get("SELECT COUNT(*) as count FROM recognitions", (err, row) => {
    if (err) {
      console.error('Error checking recognitions:', err);
      return;
    }
    
    if (row.count === 0) {
      const sampleRecognitions = [
        {
          from_user: "Sarah Chen",
          to_user: "Mike Johnson",
          message: "Outstanding leadership on the Q4 product launch! Your strategic vision and execution were exceptional.",
          value: "Excellence",
          points: 50
        },
        {
          from_user: "Emma Wilson",
          to_user: "Alex Rivera",
          message: "Your UX designs for the new dashboard are absolutely stunning! The user feedback has been overwhelmingly positive.",
          value: "Innovation",
          points: 40
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO recognitions (from_user, to_user, message, value, points)
        VALUES (?, ?, ?, ?, ?)
      `);

      sampleRecognitions.forEach(rec => {
        stmt.run(rec.from_user, rec.to_user, rec.message, rec.value, rec.points);
      });

      stmt.finalize();
    }
  });

  db.get("SELECT COUNT(*) as count FROM team_members", (err, row) => {
    if (err) {
      console.error('Error checking team_members:', err);
      return;
    }
    
    if (row.count === 0) {
      const sampleMembers = [
        { name: "Sarah Chen", avatar: "SC", role: "Senior Full-Stack Developer", department: "Engineering" },
        { name: "Mike Johnson", avatar: "MJ", role: "Product Manager", department: "Product" },
        { name: "Emma Wilson", avatar: "EW", role: "Frontend Developer", department: "Engineering" },
        { name: "Alex Rivera", avatar: "AR", role: "Senior UX Designer", department: "Design" },
        { name: "David Kim", avatar: "DK", role: "Data Scientist", department: "Analytics" }
      ];

      const stmt = db.prepare(`
        INSERT INTO team_members (name, avatar, role, department)
        VALUES (?, ?, ?, ?)
      `);

      sampleMembers.forEach(member => {
        stmt.run(member.name, member.avatar, member.role, member.department);
      });

      stmt.finalize();
    }
  });
});

// API Routes

// Get all recognitions
app.get('/recognitions', (req, res) => {
  db.all('SELECT * FROM recognitions ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching recognitions:', err);
      res.status(500).json({ error: 'Failed to fetch recognitions' });
      return;
    }
    res.json(rows);
  });
});

// Add new recognition
app.post('/recognitions', (req, res) => {
  const { from_user, to_user, message, value, points } = req.body;
  
  if (!from_user || !to_user || !message || !value || !points) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  db.run(
    'INSERT INTO recognitions (from_user, to_user, message, value, points) VALUES (?, ?, ?, ?, ?)',
    [from_user, to_user, message, value, points],
    function(err) {
      if (err) {
        console.error('Error adding recognition:', err);
        res.status(500).json({ error: 'Failed to add recognition' });
        return;
      }
      
      res.json({
        id: this.lastID,
        from_user,
        to_user,
        message,
        value,
        points,
        created_at: new Date().toISOString()
      });
    }
  );
});

// Get all team members
app.get('/team-members', (req, res) => {
  db.all('SELECT * FROM team_members', (err, rows) => {
    if (err) {
      console.error('Error fetching team members:', err);
      res.status(500).json({ error: 'Failed to fetch team members' });
      return;
    }
    res.json(rows);
  });
});

// Get stats
app.get('/stats', (req, res) => {
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
        totalSent: recCount.totalRecognitions,
        totalReceived: recCount.totalRecognitions,
        teamMembers: memberCount.totalMembers,
        streak: 12
      });
    });
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Credo API is running' });
});

// Export for Vercel
module.exports = app;
