// Local API service that connects to the backend server
const API_BASE_URL = 'http://localhost:5000/api';

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

export const api = {
  getRecognitions: async (): Promise<Recognition[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/recognitions`);
      if (!response.ok) {
        throw new Error('Failed to fetch recognitions');
      }
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  addRecognition: async (recognition: Omit<Recognition, 'id' | 'created_at'>): Promise<Recognition> => {
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
      throw error;
    }
  },

  getTeamMembers: async (): Promise<TeamMember[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/team-members`);
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getStats: async (): Promise<Stats> => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};
