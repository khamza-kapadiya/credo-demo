// Smart API service that uses demo data locally and real API in production
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment ? 'http://localhost:5000/api' : '/api';

export interface Recognition {
  id: string | number;
  from_user: string;
  to_user: string;
  message: string;
  value: string;
  points: number;
  created_at: string;
}

export interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  role: string;
  department: string;
}

export interface Stats {
  totalSent: number;
  totalReceived: number;
  teamMembers: number;
  streak: number;
}

// Demo data for local development
const demoRecognitions: Recognition[] = [
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

const demoTeamMembers: TeamMember[] = [
  { id: 1, name: "Sarah Chen", avatar: "SC", role: "Senior Full-Stack Developer", department: "Engineering" },
  { id: 2, name: "Mike Johnson", avatar: "MJ", role: "Product Manager", department: "Product" },
  { id: 3, name: "Emma Wilson", avatar: "EW", role: "Frontend Developer", department: "Engineering" },
  { id: 4, name: "Alex Rivera", avatar: "AR", role: "Senior UX Designer", department: "Design" },
  { id: 5, name: "David Kim", avatar: "DK", role: "Data Scientist", department: "Analytics" }
];

const demoStats: Stats = {
  totalSent: 24,
  totalReceived: 18,
  teamMembers: 5,
  streak: 12
};

export const api = {
  getRecognitions: async (): Promise<Recognition[]> => {
    if (isDevelopment) {
      // Use demo data in development
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      return [...demoRecognitions];
    }

    // Use real API in production
    try {
      const response = await fetch(`${API_BASE_URL}/recognitions`);
      if (!response.ok) {
        throw new Error('Failed to fetch recognitions');
      }
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [...demoRecognitions]; // Fallback to demo data
    }
  },

  addRecognition: async (recognition: Omit<Recognition, 'id' | 'created_at'>): Promise<Recognition> => {
    if (isDevelopment) {
      // Use demo data in development
      await new Promise(resolve => setTimeout(resolve, 500));
      const newRecognition: Recognition = {
        ...recognition,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      demoRecognitions.unshift(newRecognition);
      return newRecognition;
    }

    // Use real API in production
    try {
      const response = await fetch(`${API_BASE_URL}/recognitions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recognition),
      });
      if (!response.ok) {
        throw new Error('Failed to add recognition');
      }
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      // Return mock response if API fails
      return {
        ...recognition,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
    }
  },

  getTeamMembers: async (): Promise<TeamMember[]> => {
    if (isDevelopment) {
      // Use demo data in development
      await new Promise(resolve => setTimeout(resolve, 300));
      return [...demoTeamMembers];
    }

    // Use real API in production
    try {
      const response = await fetch(`${API_BASE_URL}/team-members`);
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [...demoTeamMembers]; // Fallback to demo data
    }
  },

  getStats: async (): Promise<Stats> => {
    if (isDevelopment) {
      // Use demo data in development
      await new Promise(resolve => setTimeout(resolve, 300));
      return { ...demoStats };
    }

    // Use real API in production
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { ...demoStats }; // Fallback to demo data
    }
  },
};
