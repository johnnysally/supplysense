import { useState, useEffect } from 'react'
import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'
import { Mail, Phone, MessageCircle, BookOpen, Video, Headphones } from 'lucide-react'
import api from '../../services/api'

const helpCategories = [
  { icon: BookOpen, title: 'Documentation', desc: 'Browse our detailed guides.', action: 'View Docs', link: '#' },
  { icon: Video, title: 'Video Tutorials', desc: 'Watch step-by-step tutorials.', action: 'Watch Videos', link: '#' },
  { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with our support team.', action: 'Start Chat', link: '#' },
  { icon: Headphones, title: 'Support Center', desc: 'Submit a ticket.', action: 'Open Ticket', link: '#' }
]

export default function HelpPage() {
  const [settings, setSettings] = useState<any>({})
  useEffect(() => { api.get('/client/auth/public-settings').then(res => { if (res.data) setSettings(res.data) }).catch(() => {}) }, [])
  const g = settings.general || {}

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">Help Center</h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-12">How can we help you today?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {helpCategories.map((cat, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl"><cat.icon size={24} className="text-primary-600" /></div>
                <div className="flex-1"><h3 className="font-semibold text-gray-900 dark:text-gray-100">{cat.title}</h3><p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">{cat.desc}</p><a href={cat.link} className="text-sm font-medium text-primary-600 hover:underline">{cat.action} →</a></div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Still need help?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Contact our support team directly.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {g.email && <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Mail size={16} className="text-primary-600" /><span>{g.email}</span></div>}
              {g.phone && <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Phone size={16} className="text-primary-600" /><span>{g.phone}</span></div>}
              {!g.email && !g.phone && <p className="text-sm text-gray-400">Contact information not yet configured.</p>}
            </div>
          </div>
        </div>
      </main>
      <Footer settings={settings} onLegalClick={() => {}} />
    </div>
  )
}