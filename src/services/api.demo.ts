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

// Enhanced mock data for production-quality demo
const mockRecognitions: Recognition[] = [
  {
    id: "1",
    from_user: "Sarah Chen",
    to_user: "Mike Johnson", 
    message: "Outstanding leadership on the Q4 product launch! Your strategic vision and execution were exceptional. The team couldn't have done it without you.",
    value: "Excellence",
    points: 50,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: "2",
    from_user: "Emma Wilson",
    to_user: "Alex Rivera",
    message: "Your UX designs for the new dashboard are absolutely stunning! The user feedback has been overwhelmingly positive. You truly understand our users.",
    value: "Innovation",
    points: 40,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
  },
  {
    id: "3",
    from_user: "David Kim",
    to_user: "Sarah Chen",
    message: "Thank you for the amazing code review session! Your insights helped me optimize the algorithm by 30%. Your mentorship is invaluable.",
    value: "Collaboration",
    points: 35,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
  },
  {
    id: "4",
    from_user: "Mike Johnson",
    to_user: "Emma Wilson",
    message: "Incredible work debugging that complex production issue at 2 AM! Your dedication and problem-solving skills saved the day.",
    value: "Reliability",
    points: 45,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
  },
  {
    id: "5",
    from_user: "Alex Rivera",
    to_user: "David Kim",
    message: "Your data visualization presentation was phenomenal! You made complex analytics accessible to everyone. Truly inspiring work.",
    value: "Communication",
    points: 30,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: "6",
    from_user: "Emma Wilson",
    to_user: "Sarah Chen",
    message: "Thank you for organizing the team building event! It brought us all closer together and boosted morale significantly.",
    value: "Team Spirit",
    points: 25,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: "7",
    from_user: "David Kim",
    to_user: "Alex Rivera",
    message: "Your attention to detail in the user research phase was outstanding. The insights you gathered shaped our entire product strategy.",
    value: "Attention to Detail",
    points: 40,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  }
];

const mockTeamMembers: TeamMember[] = [
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
      totalSent: 24, // More realistic numbers
      totalReceived: 18,
      teamMembers: mockTeamMembers.length,
      streak: 12 // Impressive streak!
    };
  },
};
