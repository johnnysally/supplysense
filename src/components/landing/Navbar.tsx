import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import api from '../../services/api'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [systemName, setSystemName] = useState('SupplySense')
  const supportRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    api.get('/client/auth/public-settings').then(res => {
      if (res.data?.systemName) setSystemName(res.data.systemName)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (supportRef.current && !supportRef.current.contains(e.target as Node)) setSupportOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const scrollToTop = () => { setMobileOpen(false); setSupportOpen(false); navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  
  const scrollTo = (id: string) => {
    setMobileOpen(false); setSupportOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }) }, 100)
    } else {
      const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const goTo = (path: string) => { setMobileOpen(false); setSupportOpen(false); navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const handlePricing = () => {
    if (location.pathname === '/') scrollTo('pricing')
    else goTo('/pricing')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={scrollToTop} className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors">{systemName}</button>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => scrollTo('features')} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Features</button>
          <button onClick={() => scrollTo('about')} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">About</button>
          <button onClick={handlePricing} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Pricing</button>
          <div className="relative" ref={supportRef}>
            <button onClick={() => setSupportOpen(!supportOpen)} className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Support <ChevronDown size={14} /></button>
            {supportOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                <button onClick={() => goTo('/faq')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">FAQ</button>
                <button onClick={() => goTo('/help')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Help Center</button>
                <button onClick={() => scrollTo('support')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Contact</button>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/pricing" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">Get Started</Link>
          <Link to="/login" className="border border-primary-600 text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">Launch</Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">{mobileOpen ? <X size={24} /> : <Menu size={24} />}</button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-2">
          <button onClick={() => scrollTo('features')} className="block w-full text-left text-sm font-medium text-gray-600 dark:text-gray-400 py-2">Features</button>
          <button onClick={() => scrollTo('about')} className="block w-full text-left text-sm font-medium text-gray-600 dark:text-gray-400 py-2">About</button>
          <button onClick={handlePricing} className="block w-full text-left text-sm font-medium text-gray-600 dark:text-gray-400 py-2">Pricing</button>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
            <p className="text-xs text-gray-400 uppercase px-2 py-1">Support</p>
            <button onClick={() => goTo('/faq')} className="block w-full text-left text-sm font-medium text-gray-600 dark:text-gray-400 py-2">FAQ</button>
            <button onClick={() => goTo('/help')} className="block w-full text-left text-sm font-medium text-gray-600 dark:text-gray-400 py-2">Help Center</button>
            <button onClick={() => scrollTo('support')} className="block w-full text-left text-sm font-medium text-gray-600 dark:text-gray-400 py-2">Contact</button>
          </div>
          <div className="flex gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Link to="/pricing" className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center">Get Started</Link>
            <Link to="/login" className="flex-1 border border-primary-600 text-primary-600 px-4 py-2 rounded-lg text-sm font-medium text-center">Launch</Link>
          </div>
        </div>
      )}
    </nav>
  )
}