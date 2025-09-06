import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Gift, 
  Coffee, 
  Calendar, 
  Star, 
  Trophy, 
  Zap, 
  Heart,
  Search,
  Clock,
  Users,
  Award,
  Crown,
  Sparkles,
  Check,
  Plus,
  Minus,
  X,
  RefreshCw
} from 'lucide-react'
import { api } from '../services/api.demo'
import toast from 'react-hot-toast'

interface Reward {
  id: number
  title: string
  description: string
  points: number
  category: string
  icon: React.ComponentType<any>
  color: string
  bgColor: string
  available: boolean
  popular?: boolean
  image?: string
}

interface Badge {
  id: number
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  bgColor: string
  earned: boolean
  progress?: number
  requirement: string
}

const Marketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [userPoints, setUserPoints] = useState(1250)
  const [cart, setCart] = useState<Reward[]>([])
  const [recognitions, setRecognitions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Calculate user points based on recognitions
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getRecognitions()
        setRecognitions(data)
        
        // Calculate points: 25 points for each recognition sent/received
        const totalPoints = data.length * 25 + 1000 // Base points + earned points
        setUserPoints(totalPoints)
      } catch (error) {
        console.error('Failed to load data:', error)
        toast.error('Failed to load marketplace data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Demo mode - no real-time updates needed

  const categories = [
    { id: 'all', name: 'All Rewards', icon: ShoppingBag },
    { id: 'perks', name: 'Work Perks', icon: Coffee },
    { id: 'gifts', name: 'Gift Cards', icon: Gift },
    { id: 'experiences', name: 'Experiences', icon: Star },
    { id: 'badges', name: 'Achievement Badges', icon: Trophy },
  ]

  const rewards: Reward[] = [
    {
      id: 1,
      title: 'Extra Break Time',
      description: 'Take an extra 30-minute break this week',
      points: 100,
      category: 'perks',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      available: true,
      popular: true
    },
    {
      id: 2,
      title: 'Coffee Shop Gift Card',
      description: '$10 gift card to your favorite coffee shop',
      points: 200,
      category: 'gifts',
      icon: Coffee,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      available: true,
      popular: true
    },
    {
      id: 3,
      title: 'Lunch with CEO',
      description: 'One-on-one lunch with the CEO',
      points: 500,
      category: 'experiences',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      available: true
    },
    {
      id: 4,
      title: 'Work from Home Day',
      description: 'Extra work from home day this month',
      points: 150,
      category: 'perks',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      available: true
    },
    {
      id: 5,
      title: 'Amazon Gift Card',
      description: '$25 Amazon gift card',
      points: 300,
      category: 'gifts',
      icon: Gift,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      available: true
    },
    {
      id: 6,
      title: 'Team Lunch',
      description: 'Company-sponsored team lunch',
      points: 400,
      category: 'experiences',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      available: true
    },
    {
      id: 7,
      title: 'Conference Pass',
      description: 'Attend a professional conference of your choice',
      points: 800,
      category: 'experiences',
      icon: Star,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      available: false
    },
    {
      id: 8,
      title: 'Spotify Premium',
      description: '3 months of Spotify Premium subscription',
      points: 250,
      category: 'gifts',
      icon: Sparkles,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      available: true
    }
  ]

  const badges: Badge[] = [
    {
      id: 1,
      name: 'Recognition Champion',
      description: 'Sent 50+ recognitions this month',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      earned: true,
      requirement: 'Send 50 recognitions'
    },
    {
      id: 2,
      name: 'Team Player',
      description: 'Received recognition from 5+ different people',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      earned: true,
      requirement: 'Get recognized by 5+ people'
    },
    {
      id: 3,
      name: 'Streak Master',
      description: 'Maintained a 30-day recognition streak',
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      earned: false,
      progress: 23,
      requirement: '30-day streak'
    },
    {
      id: 4,
      name: 'Value Ambassador',
      description: 'Recognized all company values',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      earned: false,
      progress: 4,
      requirement: 'Recognize all 6 values'
    },
    {
      id: 5,
      name: 'Recognition Royalty',
      description: 'Top 10% of recognizers this quarter',
      icon: Crown,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      earned: false,
      progress: 67,
      requirement: 'Top 10% recognizer'
    }
  ]

  const filteredRewards = rewards.filter(reward => {
    const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (reward: Reward) => {
    if (reward.available && userPoints >= reward.points) {
      setCart([...cart, reward])
      setUserPoints(userPoints - reward.points)
      toast.success(`${reward.title} added to cart! 🛒`)
    } else if (!reward.available) {
      toast.error('This reward is currently unavailable')
    } else {
      toast.error('Not enough points for this reward')
    }
  }

  const removeFromCart = (rewardId: number) => {
    const reward = cart.find(r => r.id === rewardId)
    if (reward) {
      setCart(cart.filter(r => r.id !== rewardId))
      setUserPoints(userPoints + reward.points)
      toast.success(`${reward.title} removed from cart`)
    }
  }

  const redeemRewards = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    // In a real app, this would make an API call to redeem rewards
    toast.success(`Successfully redeemed ${cart.length} rewards! 🎉`)
    setCart([])
  }

  const totalCartPoints = cart.reduce((sum, reward) => sum + reward.points, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recognition Marketplace</h2>
            <p className="text-gray-600">Redeem your recognition points for amazing rewards and achievements</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-secondary-100 px-4 py-2 rounded-lg">
              <Trophy className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-primary-800">{userPoints} Points</span>
            </div>
            {cart.length > 0 && (
              <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">{cart.length} in cart</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Rewards Grid */}
        <div className="lg:col-span-3">
          {/* Search */}
          <div className="card mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rewards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Rewards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRewards.map((reward, index) => {
              const Icon = reward.icon
              const canAfford = userPoints >= reward.points
              const inCart = cart.some(r => r.id === reward.id)
              
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`card relative ${!reward.available ? 'opacity-60' : ''}`}
                >
                  {reward.popular && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 ${reward.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${reward.color}`} />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{reward.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-gray-900">{reward.points} pts</span>
                      </div>
                      {!reward.available && (
                        <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                      )}
                    </div>
                    
                    {inCart ? (
                      <button
                        onClick={() => removeFromCart(reward.id)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                        <span>Remove from Cart</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(reward)}
                        disabled={!reward.available || !canAfford}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          !reward.available || !canAfford
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          {!canAfford ? 'Not enough points' : 'Add to Cart'}
                        </span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Cart */}
          {cart.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Cart</h3>
              <div className="space-y-3">
                {cart.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{reward.title}</p>
                      <p className="text-xs text-gray-600">{reward.points} pts</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(reward.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="font-semibold text-gray-900">{totalCartPoints} pts</span>
                </div>
                <button 
                  onClick={redeemRewards}
                  className="w-full btn-primary"
                >
                  Redeem Rewards
                </button>
              </div>
            </div>
          )}

          {/* Achievement Badges */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Badges</h3>
            <div className="space-y-3">
              {badges.map((badge) => {
                const Icon = badge.icon
                return (
                  <div key={badge.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 ${badge.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${badge.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{badge.name}</p>
                      <p className="text-xs text-gray-600">{badge.requirement}</p>
                      {badge.progress !== undefined && !badge.earned && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-primary-500 h-1 rounded-full" 
                              style={{ width: `${badge.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{badge.progress}% complete</p>
                        </div>
                      )}
                      {badge.earned && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Check className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">Earned!</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Points History */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center items-center py-4">
                  <RefreshCw className="w-5 h-5 animate-spin text-primary-600" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Base points</span>
                    <span className="text-green-600 font-medium">+1000 pts</span>
                  </div>
                  {recognitions.slice(0, 5).map((recognition, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Recognition: {recognition.value}</span>
                      <span className="text-blue-600 font-medium">+25 pts</span>
                    </div>
                  ))}
                  {cart.length > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Cart items</span>
                      <span className="text-red-600 font-medium">-{totalCartPoints} pts</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Marketplace
