import { useState, useRef, useEffect } from 'react'
import { User, Key, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { getInitials } from '../../utils/helpers'

export default function ProfileDropdown() {
  const user = useAuthStore((state) => state.user)
  const organization = useAuthStore((state) => state.organization)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [showMenu, setShowMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    clearAuth()
    window.location.href = '/'
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
          {user ? getInitials(user.fullName) : 'U'}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.fullName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
        </div>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">{organization?.name} — {organization?.plan}</p>
          </div>

          <button
            onClick={() => { setShowMenu(false); document.dispatchEvent(new CustomEvent('open-profile-modal')) }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <User size={16} /> Manage Profile
          </button>

          <button
            onClick={() => { setShowMenu(false); document.dispatchEvent(new CustomEvent('open-password-modal')) }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Key size={16} /> Change Password
          </button>

          <div className="border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}