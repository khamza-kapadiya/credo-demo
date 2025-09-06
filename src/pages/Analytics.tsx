import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Award, 
  Target,
  Zap,
  Heart,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { api } from '../services/api.smart' // Smart API: demo locally, real API in production
import toast from 'react-hot-toast'

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [recognitions, setRecognitions] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [recData, teamData] = await Promise.all([
          api.getRecognitions(),
          api.getTeamMembers()
        ])
        setRecognitions(recData)
        setTeamMembers(teamData)
      } catch (error) {
        console.error('Failed to load analytics data:', error)
        toast.error('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Demo mode - no real-time updates needed

  // Process real data for charts
  const processAnalyticsData = () => {
    // Group recognitions by value
    const valueCounts = recognitions.reduce((acc, rec) => {
      acc[rec.value] = (acc[rec.value] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Create value distribution data
    const valueDistribution = Object.entries(valueCounts).map(([value, count]) => ({
      name: value,
      value: count,
      color: getValueColor(value)
    }))

    // Group by month (simplified)
    const monthlyData = recognitions.reduce((acc, rec) => {
      const month = new Date(rec.created_at).toLocaleDateString('en-US', { month: 'short' })
      if (!acc[month]) {
        acc[month] = { sent: 0, received: 0, total: 0 }
      }
      acc[month].sent += 1
      acc[month].total += 1
      return acc
    }, {} as Record<string, any>)

    const recognitionTrends = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      sent: (data as any).sent,
      received: (data as any).received,
      total: (data as any).total
    }))

    // Department data (simplified - using team members)
    const departmentData = teamMembers.reduce((acc, member) => {
      acc[member.department] = (acc[member.department] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const departmentChartData = Object.entries(departmentData).map(([dept, count]) => ({
      name: dept,
      value: count,
      color: getDepartmentColor(dept)
    }))

    return {
      valueDistribution,
      recognitionTrends,
      departmentData: departmentChartData
    }
  }

  const getValueColor = (value: string) => {
    const colors: Record<string, string> = {
      'Excellence': '#0ea5e9',
      'Collaboration': '#d946ef',
      'Innovation': '#10b981',
      'Impact': '#f59e0b',
      'Leadership': '#ef4444',
      'Technical Excellence': '#8b5cf6'
    }
    return colors[value] || '#6b7280'
  }

  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, string> = {
      'Engineering': '#0ea5e9',
      'Design': '#d946ef',
      'Marketing': '#10b981',
      'Sales': '#f59e0b',
      'Product': '#8b5cf6',
      'Analytics': '#06b6d4'
    }
    return colors[dept] || '#6b7280'
  }

  const analyticsData = processAnalyticsData()

  // Use real data or fallback to mock data
  const recognitionTrends = analyticsData.recognitionTrends.length > 0 
    ? analyticsData.recognitionTrends 
    : [
        { month: 'Jan', sent: 12, received: 8, total: 20 },
        { month: 'Feb', sent: 19, received: 15, total: 34 },
        { month: 'Mar', sent: 25, received: 22, total: 47 },
        { month: 'Apr', sent: 18, received: 16, total: 34 },
        { month: 'May', sent: 28, received: 24, total: 52 },
        { month: 'Jun', sent: 32, received: 28, total: 60 },
      ]

  const departmentData = analyticsData.departmentData.length > 0 
    ? analyticsData.departmentData 
    : [
        { name: 'Engineering', value: 45, color: '#0ea5e9' },
        { name: 'Design', value: 25, color: '#d946ef' },
        { name: 'Marketing', value: 20, color: '#10b981' },
        { name: 'Sales', value: 10, color: '#f59e0b' },
      ]

  const valueDistribution = analyticsData.valueDistribution.length > 0 
    ? analyticsData.valueDistribution 
    : [
        { name: 'Excellence', value: 35, color: '#0ea5e9' },
        { name: 'Collaboration', value: 28, color: '#d946ef' },
        { name: 'Innovation', value: 20, color: '#10b981' },
        { name: 'Leadership', value: 17, color: '#f59e0b' },
      ]

  const weeklyActivity = [
    { day: 'Mon', recognitions: 8, engagement: 75 },
    { day: 'Tue', recognitions: 12, engagement: 82 },
    { day: 'Wed', recognitions: 15, engagement: 88 },
    { day: 'Thu', recognitions: 18, engagement: 92 },
    { day: 'Fri', recognitions: 22, engagement: 95 },
    { day: 'Sat', recognitions: 5, engagement: 45 },
    { day: 'Sun', recognitions: 3, engagement: 30 },
  ]


  const topRecognizers = [
    { name: 'Sarah Chen', department: 'Engineering', recognitions: 45, points: 2250 },
    { name: 'Mike Johnson', department: 'Product', recognitions: 38, points: 1900 },
    { name: 'Emma Wilson', department: 'Engineering', recognitions: 32, points: 1600 },
    { name: 'Alex Rivera', department: 'Design', recognitions: 28, points: 1400 },
    { name: 'David Kim', department: 'Analytics', recognitions: 25, points: 1250 },
  ]

  // Calculate real metrics
  const totalRecognitions = recognitions.length
  const totalTeamMembers = teamMembers.length
  const avgRecognitionsPerPerson = totalTeamMembers > 0 ? (totalRecognitions / totalTeamMembers).toFixed(1) : '0'
  const topValue = valueDistribution.length > 0 ? valueDistribution[0].name : 'Excellence'

  const keyMetrics = [
    {
      title: 'Total Recognitions',
      value: totalRecognitions.toString(),
      change: '+18%',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Team Members',
      value: totalTeamMembers.toString(),
      change: '+5%',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Avg per Person',
      value: avgRecognitionsPerPerson,
      change: '-12%',
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Top Value',
      value: topValue,
      change: '+3%',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
            <p className="text-gray-600">Track recognition trends, engagement metrics, and team performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-green-600 font-medium">{metric.change}</p>
                </div>
                <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
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
            <AreaChart data={recognitionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="sent" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
              <Area type="monotone" dataKey="received" stackId="1" stroke="#d946ef" fill="#d946ef" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {departmentData.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                  <span className="text-gray-600">{dept.name}</span>
                </div>
                <span className="font-medium text-gray-900">{String(dept.value)}</span>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Activity & Engagement</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="recognitions" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="engagement" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Value Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recognition Values</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={valueDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Recognizers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Recognizers</h3>
          <div className="space-y-4">
            {topRecognizers.map((recognizer, index) => (
              <div key={recognizer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{recognizer.name}</p>
                    <p className="text-sm text-gray-600">{recognizer.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{recognizer.recognitions}</p>
                  <p className="text-sm text-gray-600">{recognizer.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Growth Trend</span>
            </div>
            <p className="text-sm text-blue-700">
              Recognition activity has increased by 18% this month, with Friday being the most active day.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">Team Engagement</span>
            </div>
            <p className="text-sm text-green-700">
              Engineering team leads in recognition activity, contributing 45% of total recognitions.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">Value Focus</span>
            </div>
            <p className="text-sm text-purple-700">
              "Excellence" is the most recognized value, representing 35% of all recognitions.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics
