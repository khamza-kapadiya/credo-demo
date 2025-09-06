import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Send, 
  Users, 
  Sparkles, 
  Clock, 
  Calendar,
  Heart,
  Target,
  Zap,
  Search,
  X,
  Check,
  Lightbulb,
  MessageSquare,
  Star
} from 'lucide-react'
import { api, type TeamMember } from '../services/api.demo'
import toast from 'react-hot-toast'

// Remove the duplicate interface since we're importing it

interface RecognitionValue {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  description: string
}

const KudosCenter: React.FC = () => {
  const [selectedRecipient, setSelectedRecipient] = useState<TeamMember | null>(null)
  const [selectedValue, setSelectedValue] = useState<RecognitionValue | null>(null)
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [scheduledTime, setScheduledTime] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const recognitionRef = useRef<any>(null)

  // Load team members from API
  React.useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const members = await api.getTeamMembers()
        setTeamMembers(members)
      } catch (error) {
        console.error('Failed to load team members:', error)
        toast.error('Failed to load team members')
      } finally {
        // Loading complete
      }
    }
    
    loadTeamMembers()
  }, [])

  const recognitionValues: RecognitionValue[] = [
    {
      id: 'excellence',
      name: 'Excellence',
      icon: Star,
      color: 'text-yellow-500',
      description: 'Outstanding performance and quality'
    },
    {
      id: 'collaboration',
      name: 'Collaboration',
      icon: Users,
      color: 'text-blue-500',
      description: 'Great teamwork and cooperation'
    },
    {
      id: 'innovation',
      name: 'Innovation',
      icon: Lightbulb,
      color: 'text-purple-500',
      description: 'Creative thinking and new ideas'
    },
    {
      id: 'leadership',
      name: 'Leadership',
      icon: Target,
      color: 'text-green-500',
      description: 'Inspiring and guiding others'
    },
    {
      id: 'dedication',
      name: 'Dedication',
      icon: Heart,
      color: 'text-red-500',
      description: 'Commitment and perseverance'
    },
    {
      id: 'impact',
      name: 'Impact',
      icon: Zap,
      color: 'text-orange-500',
      description: 'Making a significant difference'
    }
  ]

  const aiSuggestions = [
    "Great work on the recent project! Your attention to detail really made the difference.",
    "Thank you for your excellent collaboration on the team initiative.",
    "Your innovative approach to solving this challenge was impressive!",
    "Outstanding leadership during the recent sprint. You kept everyone motivated!",
    "Your dedication to quality and continuous improvement is inspiring."
  ]

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setIsRecording(true)
      }

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setMessage(transcript)
        setIsRecording(false)
      }

      recognitionRef.current.onerror = () => {
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current.start()
    } else {
      alert('Speech recognition not supported in this browser')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSendKudos = async () => {
    if (!selectedRecipient || !selectedValue || !message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      // Save the recognition via API
      const newRecognition = await api.addRecognition({
        from_user: 'You', // In a real app, this would be the logged-in user
        to_user: selectedRecipient.name,
        message: message.trim(),
        value: selectedValue.name,
        points: 25 // Points earned for sending recognition
      })

      console.log('Recognition saved:', newRecognition)

      // Reset form
      setSelectedRecipient(null)
      setSelectedValue(null)
      setMessage('')
      setScheduledTime('')
      setIsPrivate(false)
      
      // Show success message
      toast.success(`Kudos sent to ${selectedRecipient.name}! 🎉`)
      
    } catch (error) {
      console.error('Error sending kudos:', error)
      toast.error('Failed to send kudos. Please try again.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Kudos</h2>
            <p className="text-gray-600">Recognize your colleagues and spread positivity across the team</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Suggestions Panel */}
      <AnimatePresence>
        {showAISuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary-600" />
                AI Recognition Suggestions
              </h3>
              <button
                onClick={() => setShowAISuggestions(false)}
                className="p-1 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(suggestion)}
                  className="p-3 bg-white rounded-lg border border-primary-200 hover:border-primary-300 transition-colors text-left"
                >
                  <p className="text-sm text-gray-700">{suggestion}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recipient Selection */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Recipient</h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedRecipient(member)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    selectedRecipient?.id === member.id
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {member.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                  {selectedRecipient?.id === member.id && (
                    <Check className="w-5 h-5 text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kudos Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compose Recognition</h3>

            {/* Recognition Value Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What value are you recognizing?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {recognitionValues.map((value) => {
                  const Icon = value.icon
                  return (
                    <button
                      key={value.id}
                      onClick={() => setSelectedValue(value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedValue?.id === value.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Icon className={`w-6 h-6 ${value.color}`} />
                        <span className="font-medium text-gray-900">{value.name}</span>
                        <span className="text-xs text-gray-500 text-center">{value.description}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Message Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Recognition Message
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a heartfelt message about what they did and how it made a difference..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2 rounded-lg transition-colors ${
                      isRecording
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {isRecording ? 'Recording... Speak now' : 'Click the mic to use voice-to-text'}
              </p>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Delivery (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="private" className="text-sm text-gray-700">
                  Private recognition (only visible to recipient)
                </label>
              </div>
            </div>

            {/* Send Button */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {selectedRecipient && selectedValue && message.trim() && (
                  <span className="text-green-600">✓ Ready to send</span>
                )}
              </div>
              <button
                onClick={handleSendKudos}
                disabled={!selectedRecipient || !selectedValue || !message.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="w-4 h-4" />
                <span>Send Kudos</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-primary-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Quick Templates</h4>
          <p className="text-sm text-gray-600 mb-4">Use pre-written templates for common recognitions</p>
          <button className="btn-secondary w-full">Browse Templates</button>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-secondary-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Scheduled Kudos</h4>
          <p className="text-sm text-gray-600 mb-4">Plan recognitions for team meetings and milestones</p>
          <button className="btn-secondary w-full">Schedule</button>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">Team Kudos</h4>
          <p className="text-sm text-gray-600 mb-4">Send recognition to multiple team members at once</p>
          <button className="btn-secondary w-full">Team Recognition</button>
        </div>
      </div>
    </div>
  )
}

export default KudosCenter
