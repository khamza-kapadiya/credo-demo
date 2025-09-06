import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Table, 
  Users, 
  Heart,
  RefreshCw,
  Eye,
} from 'lucide-react'
import { api } from '../services/api.demo'
import toast from 'react-hot-toast'

const DatabaseViewer: React.FC = () => {
  const [recognitions, setRecognitions] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'recognitions' | 'team'>('recognitions')

  const loadData = async () => {
    setLoading(true)
    try {
      const [recData, teamData] = await Promise.all([
        api.getRecognitions(),
        api.getTeamMembers()
      ])
      setRecognitions(recData)
      setTeamMembers(teamData)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load database data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Database className="w-6 h-6 mr-2 text-blue-600" />
              Database Viewer
            </h2>
            <p className="text-gray-600">View and manage your SQLite database</p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('recognitions')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'recognitions'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Recognitions ({recognitions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'team'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team Members ({teamMembers.length})</span>
          </button>
        </div>
      </div>

      {/* Data Tables */}
      {loading ? (
        <div className="card text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading database...</p>
        </div>
      ) : (
        <div className="card">
          {activeTab === 'recognitions' ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Table className="w-5 h-5 mr-2" />
                Recognitions Table
              </h3>
              {recognitions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No recognitions found</p>
                  <p className="text-sm">Send some kudos to see them here!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">From</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">To</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Value</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Message</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Points</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recognitions.map((recognition) => (
                        <motion.tr
                          key={recognition.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 font-mono text-xs text-gray-500">
                            {recognition.id.substring(0, 8)}...
                          </td>
                          <td className="py-3 px-4 font-medium">{recognition.from_user}</td>
                          <td className="py-3 px-4 font-medium">{recognition.to_user}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {recognition.value}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate">{recognition.message}</td>
                          <td className="py-3 px-4 font-medium text-green-600">{recognition.points}</td>
                          <td className="py-3 px-4 text-gray-500 text-xs">
                            {formatDate(recognition.created_at)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Table className="w-5 h-5 mr-2" />
                Team Members Table
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Avatar</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">{member.id}</td>
                        <td className="py-3 px-4 font-medium">{member.name}</td>
                        <td className="py-3 px-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {member.avatar}
                          </div>
                        </td>
                        <td className="py-3 px-4">{member.role}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                            {member.department}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Database Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <Database className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <h4 className="font-semibold text-gray-900">Database Type</h4>
          <p className="text-sm text-gray-600">SQLite</p>
        </div>
        <div className="card text-center">
          <Table className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <h4 className="font-semibold text-gray-900">Tables</h4>
          <p className="text-sm text-gray-600">2 (recognitions, team_members)</p>
        </div>
        <div className="card text-center">
          <Eye className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <h4 className="font-semibold text-gray-900">Location</h4>
          <p className="text-sm text-gray-600">backend/credo.db</p>
        </div>
      </div>
    </div>
  )
}

export default DatabaseViewer
