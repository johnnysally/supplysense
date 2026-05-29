import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../common/Button'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('supplysense-cookie-consent')
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('supplysense-cookie-consent', 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('supplysense-cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg p-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            We use cookies to enhance your experience. By continuing to use this site, you agree to our use of cookies.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={handleDecline}>Decline</Button>
          <Button size="sm" onClick={handleAccept}>Accept</Button>
        </div>
      </div>
    </div>
  )
}