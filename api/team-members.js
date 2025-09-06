// Simple Vercel serverless function for team members
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
    // Return static team members data
    const teamMembers = [
      { id: 1, name: "Sarah Chen", avatar: "SC", role: "Senior Full-Stack Developer", department: "Engineering" },
      { id: 2, name: "Mike Johnson", avatar: "MJ", role: "Product Manager", department: "Product" },
      { id: 3, name: "Emma Wilson", avatar: "EW", role: "Frontend Developer", department: "Engineering" },
      { id: 4, name: "Alex Rivera", avatar: "AR", role: "Senior UX Designer", department: "Design" },
      { id: 5, name: "David Kim", avatar: "DK", role: "Data Scientist", department: "Analytics" },
      { id: 6, name: "Lisa Zhang", avatar: "LZ", role: "Backend Developer", department: "Engineering" },
      { id: 7, name: "James Rodriguez", avatar: "JR", role: "DevOps Engineer", department: "Infrastructure" },
      { id: 8, name: "Maria Garcia", avatar: "MG", role: "QA Engineer", department: "Quality Assurance" },
      { id: 9, name: "Ahmed Hassan", avatar: "AH", role: "Mobile Developer", department: "Engineering" },
      { id: 10, name: "Priya Patel", avatar: "PP", role: "Product Designer", department: "Design" }
    ];
    
    res.json(teamMembers);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
