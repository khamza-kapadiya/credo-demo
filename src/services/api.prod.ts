// API service for communicating with the backend (Production)
const API_BASE_URL = '/api'; // Use relative URLs for Vercel deployment

export interface Recognition {
  id: string;
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

export const api = {
  getRecognitions: async (): Promise<Recognition[]> => {
    const response = await fetch(`${API_BASE_URL}/recognitions`);
    if (!response.ok) {
      throw new Error('Failed to fetch recognitions');
    }
    return response.json();
  },

  addRecognition: async (recognition: Omit<Recognition, 'id' | 'created_at'>): Promise<Recognition> => {
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
  },

  getTeamMembers: async (): Promise<TeamMember[]> => {
    const response = await fetch(`${API_BASE_URL}/team-members`);
    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }
    return response.json();
  },

  getStats: async (): Promise<Stats> => {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  },
};
