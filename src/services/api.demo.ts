// Demo API service - works without backend
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

// Mock data for demo
const mockRecognitions: Recognition[] = [
  {
    id: "1",
    from_user: "Sarah Chen",
    to_user: "Mike Johnson", 
    message: "Great work on the project launch!",
    value: "Excellence",
    points: 25,
    created_at: new Date().toISOString()
  }
];

const mockTeamMembers: TeamMember[] = [
  { id: 1, name: "Sarah Chen", avatar: "SC", role: "Senior Developer", department: "Engineering" },
  { id: 2, name: "Mike Johnson", avatar: "MJ", role: "Product Manager", department: "Product" },
  { id: 3, name: "Emma Wilson", avatar: "EW", role: "Frontend Developer", department: "Engineering" },
  { id: 4, name: "Alex Rivera", avatar: "AR", role: "UX Designer", department: "Design" },
  { id: 5, name: "David Kim", avatar: "DK", role: "Data Scientist", department: "Analytics" }
];

export const api = {
  getRecognitions: async (): Promise<Recognition[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockRecognitions];
  },

  addRecognition: async (recognition: Omit<Recognition, 'id' | 'created_at'>): Promise<Recognition> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRecognition: Recognition = {
      ...recognition,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    mockRecognitions.unshift(newRecognition);
    return newRecognition;
  },

  getTeamMembers: async (): Promise<TeamMember[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockTeamMembers];
  },

  getStats: async (): Promise<Stats> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      totalSent: mockRecognitions.length,
      totalReceived: mockRecognitions.length,
      teamMembers: mockTeamMembers.length,
      streak: 7
    };
  },
};
