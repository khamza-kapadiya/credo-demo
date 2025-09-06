// Vercel serverless function for team members
const sqlite3 = require('sqlite3').verbose();

// Use in-memory database for Vercel
const db = new sqlite3.Database(':memory:');

// Initialize database with sample data
db.serialize(() => {
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

  // Insert sample data
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

module.exports = function handler(req, res) {
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
};
