import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import RecognitionFeed from './pages/RecognitionFeed'
import KudosCenter from './pages/KudosCenter'
import Marketplace from './pages/Marketplace'
import Analytics from './pages/Analytics'
import DatabaseViewer from './pages/DatabaseViewer'

export type Page = 'dashboard' | 'feed' | 'kudos' | 'marketplace' | 'analytics' | 'database'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'feed':
        return <RecognitionFeed />
      case 'kudos':
        return <KudosCenter />
      case 'marketplace':
        return <Marketplace />
      case 'analytics':
        return <Analytics />
      case 'database':
        return <DatabaseViewer />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          currentPage={currentPage}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderPage()}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default App
