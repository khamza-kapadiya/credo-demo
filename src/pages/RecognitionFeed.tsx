import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Filter,
  Search,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  RefreshCw
} from 'lucide-react'
import { api } from '../services/api.smart' // Smart API: demo locally, real API in production
import toast from 'react-hot-toast'

interface Recognition {
  id: string | number
  from_user: string
  to_user: string
  message: string
  value: string
  points: number
  created_at: string
  likes?: number
  comments?: number
  shares?: number
  isLiked?: boolean
  tags?: string[]
  image?: string
}

const RecognitionFeed: React.FC = () => {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [recognitions, setRecognitions] = useState<Recognition[]>([])
  const [loading, setLoading] = useState(true)

  // Load recognitions from API
  useEffect(() => {
    const loadRecognitions = async () => {
      try {
        const data = await api.getRecognitions()
        // Add mock engagement data for display
        const recognitionsWithEngagement = data.map(rec => ({
          ...rec,
          likes: Math.floor(Math.random() * 50) + 5,
          comments: Math.floor(Math.random() * 20) + 1,
          shares: Math.floor(Math.random() * 10),
          isLiked: Math.random() > 0.7,
          tags: [rec.value.toLowerCase(), 'teamwork', 'appreciation']
        }))
        setRecognitions(recognitionsWithEngagement)
      } catch (error) {
        console.error('Failed to load recognitions:', error)
        toast.error('Failed to load recognitions')
      } finally {
        setLoading(false)
      }
    }

    loadRecognitions()
  }, [])

  // Demo mode - no real-time updates needed

  const filteredRecognitions = recognitions.filter(recognition => {
    const matchesFilter = filter === 'all' || 
      recognition.value.toLowerCase().includes(filter.toLowerCase()) ||
      (recognition.tags && recognition.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())))
    
    const matchesSearch = searchQuery === '' ||
      recognition.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recognition.from_user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recognition.to_user.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleLike = (id: string | number) => {
    // In a real app, this would make an API call
    console.log(`Liked recognition ${id}`)
  }

  const handleComment = (id: string | number) => {
    // In a real app, this would open a comment modal
    console.log(`Comment on recognition ${id}`)
  }

  const handleShare = (id: string | number) => {
    // In a real app, this would open share options
    console.log(`Share recognition ${id}`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search recognitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Recognitions</option>
                <option value="leadership">Leadership</option>
                <option value="excellence">Excellence</option>
                <option value="innovation">Innovation</option>
                <option value="collaboration">Collaboration</option>
                <option value="mentorship">Mentorship</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>Trending: Leadership</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>24 active today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recognition Posts */}
      <div className="space-y-6">
        {loading ? (
          <div className="card text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Loading recognitions...</p>
          </div>
        ) : filteredRecognitions.length === 0 ? (
          <div className="card text-center py-12">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">No recognitions found</p>
            <p className="text-sm text-gray-500">Try adjusting your filters or send some kudos!</p>
          </div>
        ) : (
          filteredRecognitions.map((recognition, index) => (
          <motion.div
            key={recognition.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {getInitials(recognition.from_user)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{recognition.from_user}</span>
                    <span className="text-gray-500">→</span>
                    <span className="font-semibold text-gray-900">{recognition.to_user}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{formatTimeAgo(recognition.created_at)}</span>
                    <span>•</span>
                    <span>{recognition.points} points</span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Recognition Value Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 text-sm font-medium rounded-full">
                <Award className="w-4 h-4 mr-1" />
                {recognition.value}
              </span>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-800 leading-relaxed">{recognition.message}</p>
            </div>

            {/* Post Image (if available) */}
            {recognition.image && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={recognition.image}
                  alt="Recognition"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Tags */}
            {recognition.tags && recognition.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {recognition.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Engagement Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <span>{recognition.likes || 0} likes</span>
                <span>{recognition.comments || 0} comments</span>
                <span>{recognition.shares || 0} shares</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleLike(recognition.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    recognition.isLiked
                      ? 'bg-red-50 text-red-600'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${recognition.isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">Like</span>
                </button>
                
                <button
                  onClick={() => handleComment(recognition.id)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">Comment</span>
                </button>
                
                <button
                  onClick={() => handleShare(recognition.id)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Share</span>
                </button>
              </div>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Boost</span>
              </button>
            </div>
          </motion.div>
          ))
        )}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="btn-primary">
          Load More Recognitions
        </button>
      </div>
    </div>
  )
}

export default RecognitionFeed
