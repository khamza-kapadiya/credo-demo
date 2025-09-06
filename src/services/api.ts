// API service for communicating with the backend
const API_BASE_URL = 'http://192.168.1.150:5000/api';

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

export interface RecognitionStats {
  totalSent: number;
  totalReceived: number;
  teamMembers: number;
  streak: number;
}

// API functions
export const api = {
  // Get all recognitions
  getRecognitions: async (): Promise<Recognition[]> => {
    const response = await fetch(`${API_BASE_URL}/recognitions`);
    if (!response.ok) {
      throw new Error('Failed to fetch recognitions');
    }
    return response.json();
  },

  // Add new recognition
  addRecognition: async (recognition: {
    from_user: string;
    to_user: string;
    message: string;
    value: string;
    points?: number;
  }): Promise<Recognition> => {
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

  // Get team members
  getTeamMembers: async (): Promise<TeamMember[]> => {
    const response = await fetch(`${API_BASE_URL}/team-members`);
    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }
    return response.json();
  },

  // Get recognition stats
  getStats: async (): Promise<RecognitionStats> => {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  },
};
