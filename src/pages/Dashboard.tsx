import React from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  Users,
  Trophy,
  Zap,
  Calendar,
  Target,
  Star
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { api } from '../services/api.smart' // Smart API: demo locally, real API in production

const Dashboard: React.FC = () => {
  // State for real-time data
  const [stats, setStats] = React.useState({
    totalSent: 0,
    totalReceived: 0,
    teamMembers: 0,
    streak: 7
  })

  // Load initial data
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const statsData = await api.getStats()
        setStats(statsData)
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }

    loadData()
  }, [])

  // Demo mode - no real-time updates needed

  // Mock data for charts (we'll keep this for now since it's just visual)
  const recognitionData = [
    { month: 'Jan', sent: 12, received: 8 },
    { month: 'Feb', sent: 19, received: 15 },
    { month: 'Mar', sent: 25, received: 22 },
    { month: 'Apr', sent: 18, received: 16 },
    { month: 'May', sent: 28, received: 24 },
    { month: 'Jun', sent: 32, received: 28 },
  ]

  const teamData = [
    { name: 'Engineering', value: 45, color: '#0ea5e9' },
    { name: 'Design', value: 25, color: '#d946ef' },
    { name: 'Marketing', value: 20, color: '#10b981' },
    { name: 'Sales', value: 10, color: '#f59e0b' },
  ]

  const weeklyTrends = [
    { day: 'Mon', recognitions: 8 },
    { day: 'Tue', recognitions: 12 },
    { day: 'Wed', recognitions: 15 },
    { day: 'Thu', recognitions: 18 },
    { day: 'Fri', recognitions: 22 },
    { day: 'Sat', recognitions: 5 },
    { day: 'Sun', recognitions: 3 },
  ]

  // Convert real stats to display format
  const displayStats = [
    {
      title: 'Kudos Sent',
      value: stats.totalSent.toString(),
      change: '+12%',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Kudos Received',
      value: stats.totalReceived.toString(),
      change: '+8%',
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Team Members',
      value: stats.teamMembers.toString(),
      change: '+2',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Recognition Streak',
      value: `${stats.streak} days`,
      change: '🔥',
      icon: Zap,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ]

  const recentRecognitions = [
    {
      id: 1,
      from: 'Sarah Chen',
      to: 'You',
      message: 'Amazing work on the new feature launch! Your attention to detail really made the difference.',
      value: 'Excellence',
      time: '2 hours ago',
      likes: 12,
    },
    {
      id: 2,
      from: 'You',
      to: 'Mike Johnson',
      message: 'Thanks for helping me debug that complex issue. Your problem-solving skills are incredible!',
      value: 'Collaboration',
      time: '4 hours ago',
      likes: 8,
    },
    {
      id: 3,
      from: 'Alex Rivera',
      to: 'You',
      message: 'Your presentation was outstanding! Clear, engaging, and perfectly structured.',
      value: 'Communication',
      time: '1 day ago',
      likes: 15,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h2>
            <p className="text-primary-100 text-lg">
              You're on a 7-day recognition streak! Keep spreading the positivity.
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white opacity-80">Real-time connected</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recognition Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recognition Trends</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span>Sent</span>
              <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
              <span>Received</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recognitionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sent" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="received" fill="#d946ef" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Team Recognition Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Recognition Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={teamData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {teamData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {teamData.map((team) => (
              <div key={team.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }}></div>
                  <span className="text-gray-600">{team.name}</span>
                </div>
                <span className="font-medium text-gray-900">{team.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="recognitions" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Recognitions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Recognitions</h3>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentRecognitions.map((recognition) => (
            <div key={recognition.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{recognition.from}</span>
                  <span className="text-gray-500">→</span>
                  <span className="font-medium text-gray-900">{recognition.to}</span>
                  <span className="text-xs text-gray-500">{recognition.time}</span>
                </div>
                <p className="text-gray-700 mb-2">{recognition.message}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                    {recognition.value}
                  </span>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{recognition.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-primary-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Send Kudos</h4>
          <p className="text-sm text-gray-600 mb-4">Recognize a colleague for their great work</p>
          <button className="btn-primary w-full">Get Started</button>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-secondary-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Set Goals</h4>
          <p className="text-sm text-gray-600 mb-4">Create recognition goals for your team</p>
          <button className="btn-secondary w-full">Create Goal</button>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Schedule</h4>
          <p className="text-sm text-gray-600 mb-4">Plan recognition moments in advance</p>
          <button className="btn-secondary w-full">Schedule</button>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard