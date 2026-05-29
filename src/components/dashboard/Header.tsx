import { useState, useEffect } from 'react'
import { Menu, Sun, Moon } from 'lucide-react'
import { useDashboardStore } from '../../store/dashboardStore'
import { useAuthStore } from '../../store/authStore'
import ProfileDropdown from './ProfileDropdown'

export default function Header() {
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar)
  const user = useAuthStore((state) => state.user)
  const [time, setTime] = useState(new Date())
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('supplysense-theme') === 'dark'
    return false
  })

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('supplysense-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('supplysense-theme', 'light')
    }
  }, [dark])

  const getGreeting = () => {
    const hour = time.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-6 h-16">
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 lg:hidden">
          <Menu size={20} />
        </button>

        <div className="flex-1 ml-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {getGreeting()}, <span className="font-medium text-gray-700 dark:text-gray-200">{user?.fullName || 'User'}</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(time)}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-mono font-medium text-gray-700 dark:text-gray-200">{formatTime(time)}</p>
          </div>

          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}