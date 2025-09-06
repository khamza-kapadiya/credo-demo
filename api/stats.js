// Vercel serverless function for stats
const sqlite3 = require('sqlite3').verbose();

// Use in-memory database for Vercel
const db = new sqlite3.Database(':memory:');

// Initialize database with sample data
db.serialize(() => {
  // Create tables
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
