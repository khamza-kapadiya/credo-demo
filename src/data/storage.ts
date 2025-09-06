// This file acts like a simple database for our app
// In a real app, this would connect to a real database

export interface Recognition {
  id: number
  from: string
  to: string
  message: string
  value: string
  timestamp: string
  points: number
}

export interface TeamMember {
  id: number
  name: string
  avatar: string
  role: string
  department: string
}

// Helper functions to save/load data from browser's localStorage
const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data))
}

const loadFromStorage = (key: string, defaultValue: any) => {
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : defaultValue
}

// Our "database" - now with persistence!
let recognitions: Recognition[] = loadFromStorage('credo_recognitions', [
  {
    id: 1,
    from: "Sarah Chen",
    to: "Mike Johnson", 
    message: "Great work on the project launch!",
    value: "Excellence",
    timestamp: new Date().toISOString(),
    points: 25
  }
])

let teamMembers: TeamMember[] = loadFromStorage('credo_team_members', [
  { id: 1, name: "Sarah Chen", avatar: "SC", role: "Senior Developer", department: "Engineering" },
  { id: 2, name: "Mike Johnson", avatar: "MJ", role: "Product Manager", department: "Product" },
  { id: 3, name: "Emma Wilson", avatar: "EW", role: "Frontend Developer", department: "Engineering" },
  { id: 4, name: "Alex Rivera", avatar: "AR", role: "UX Designer", department: "Design" },
  { id: 5, name: "David Kim", avatar: "DK", role: "Data Scientist", department: "Analytics" }
])

// Functions to interact with our "database"
export const getRecognitions = (): Recognition[] => {
  return recognitions
}

export const addRecognition = (recognition: Omit<Recognition, 'id' | 'timestamp'>): Recognition => {
  const newRecognition: Recognition = {
    ...recognition,
    id: recognitions.length + 1,
    timestamp: new Date().toISOString()
  }
  recognitions.push(newRecognition)
  
  // Save to localStorage so data persists
  saveToStorage('credo_recognitions', recognitions)
  
  return newRecognition
}

export const getTeamMembers = (): TeamMember[] => {
  return teamMembers
}

export const getRecognitionStats = () => {
  return {
    totalSent: recognitions.length,
    totalReceived: recognitions.length, // Simplified for demo
    teamMembers: teamMembers.length,
    streak: 7 // This would be calculated from real data
  }
}

// Debug function to see all your data in the console
export const debugShowAllData = () => {
  console.log('=== CREDO DATA DEBUG ===')
  console.log('All Recognitions:', recognitions)
  console.log('All Team Members:', teamMembers)
  console.log('localStorage recognitions:', localStorage.getItem('credo_recognitions'))
  console.log('========================')
}
