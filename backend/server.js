const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./credo.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Create recognitions table
  db.run(`CREATE TABLE IF NOT EXISTS recognitions (
    id TEXT PRIMARY KEY,
    from_user TEXT NOT NULL,
    to_user TEXT NOT NULL,
    message TEXT NOT NULL,
    value TEXT NOT NULL,
    points INTEGER DEFAULT 25,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create team_members table
  db.run(`CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL
  )`, () => {
    // Insert sample team members if table is empty
    db.get("SELECT COUNT(*) as count FROM team_members", (err, row) => {
      if (row.count === 0) {
        const sampleMembers = [
          ['Sarah Chen', 'SC', 'Senior Developer', 'Engineering'],
          ['Mike Johnson', 'MJ', 'Product Manager', 'Product'],
          ['Emma Wilson', 'EW', 'Frontend Developer', 'Engineering'],
          ['Alex Rivera', 'AR', 'UX Designer', 'Design'],
          ['David Kim', 'DK', 'Data Scientist', 'Analytics']
        ];
        
        const stmt = db.prepare("INSERT INTO team_members (name, avatar, role, department) VALUES (?, ?, ?, ?)");
        sampleMembers.forEach(member => {
          stmt.run(member);
        });
        stmt.finalize();
        console.log('Sample team members inserted');
      }
    });
  });
}

// API Routes

// Get all recognitions
app.get('/api/recognitions', (req, res) => {
  db.all("SELECT * FROM recognitions ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new recognition
app.post('/api/recognitions', (req, res) => {
  const { from_user, to_user, message, value, points = 25 } = req.body;
  const id = uuidv4();
  
  db.run(
    "INSERT INTO recognitions (id, from_user, to_user, message, value, points) VALUES (?, ?, ?, ?, ?, ?)",
    [id, from_user, to_user, message, value, points],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Get the newly created recognition
      db.get("SELECT * FROM recognitions WHERE id = ?", [id], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        // Emit real-time update to all connected clients
        io.emit('new_recognition', row);
        
        res.status(201).json(row);
      });
    }
  );
});

// Get team members
app.get('/api/team-members', (req, res) => {
  db.all("SELECT * FROM team_members", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get recognition stats
app.get('/api/stats', (req, res) => {
  db.get("SELECT COUNT(*) as totalSent FROM recognitions", (err, sentRow) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    db.get("SELECT COUNT(*) as teamMembers FROM team_members", (err, teamRow) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({
        totalSent: sentRow.totalSent,
        totalReceived: sentRow.totalSent, // Simplified for demo
        teamMembers: teamRow.teamMembers,
        streak: 7 // This would be calculated from real data
      });
    });
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Network access: http://192.168.1.150:${PORT}`);
  console.log(`📊 Database: SQLite (credo.db)`);
  console.log(`🔄 Real-time: WebSocket enabled`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
