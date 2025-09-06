import React from 'react'
import { motion } from 'framer-motion'
import {
  Menu,
  Bell,
  Search,
  Plus,
  Trophy
} from 'lucide-react'
import { Page } from '../App'

interface HeaderProps {
  onMenuClick: () => void
  currentPage: Page
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, currentPage }) => {
  const getPageTitle = (page: Page) => {
    switch (page) {
      case 'dashboard': return 'Dashboard'
      case 'feed': return 'Recognition Feed'
      case 'kudos': return 'Send Kudos'
      case 'marketplace': return 'Marketplace'
      case 'analytics': return 'Analytics'
      default: return 'Dashboard'
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 w-full">
      <div className="flex items-center justify-between w-full">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle(currentPage)}</h1>
            <p className="text-sm text-gray-500">
              {currentPage === 'dashboard' && 'Welcome back! Here\'s your recognition overview'}
              {currentPage === 'feed' && 'See what your team is celebrating'}
              {currentPage === 'kudos' && 'Recognize your colleagues and spread positivity'}
              {currentPage === 'marketplace' && 'Redeem your recognition points for rewards'}
              {currentPage === 'analytics' && 'Track recognition trends and insights'}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search people, recognitions..."
              className="bg-transparent border-none outline-none text-sm placeholder-gray-500"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Quick Kudos</span>
            </motion.button>

            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">1,250 pts</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
