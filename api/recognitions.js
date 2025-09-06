// Simple Vercel serverless function for recognitions

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
    // Return static recognitions data
    const recognitions = [
      {
        id: "1",
        from_user: "Sarah Chen",
        to_user: "Mike Johnson", 
        message: "Outstanding leadership on the Q4 product launch! Your strategic vision and execution were exceptional. The team couldn't have done it without you.",
        value: "Excellence",
        points: 50,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "2",
        from_user: "Emma Wilson",
        to_user: "Alex Rivera",
        message: "Your UX designs for the new dashboard are absolutely stunning! The user feedback has been overwhelmingly positive. You truly understand our users.",
        value: "Innovation",
        points: 40,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "3",
        from_user: "David Kim",
        to_user: "Sarah Chen",
        message: "Thank you for the amazing code review session! Your insights helped me optimize the algorithm by 30%. Your mentorship is invaluable.",
        value: "Collaboration",
        points: 35,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    res.json(recognitions);
  } else if (req.method === 'POST') {
    // Add new recognition
    const { from_user, to_user, message, value, points } = req.body;
    
    if (!from_user || !to_user || !message || !value || !points) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const id = generateUUID();
    const created_at = new Date().toISOString();
    
    // Return the new recognition (in a real app, this would be saved to database)
    res.json({
      id,
      from_user,
      to_user,
      message,
      value,
      points,
      created_at
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};