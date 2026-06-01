import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, Trash2 } from 'lucide-react'
import api from '../../services/api'
import Button from '../common/Button'

const SUGGESTIONS = [
  'What features do you offer?',
  'How much does it cost?',
  'Do you have a free trial?',
  'How does AI help my business?',
  'Can I connect my ERP?'
]

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState<{ role: string; text: string }[]>([
    { role: 'bot', text: 'Hi! 👋 I\'m the SupplySense assistant. Ask me about features, pricing, or how to get started!' }
  ])
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState<any>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get('/client/auth/public-settings').then(res => {
      if (res.data?.aiConfig) setConfig(res.data.aiConfig)
    }).catch(() => {})
  }, [])

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight }, [chat])

  if (!config?.landingChatEnabled) return null

  const sendMessage = async (msg: string) => {
    if (!msg.trim()) return
    setChat(prev => [...prev, { role: 'user', text: msg }])
    setMessage('')
    setLoading(true)

    try {
      const { data } = await api.post('/landing/chat', { message: msg })
      const reply = data?.data?.reply || data?.data?.key_findings || 'I\'m here to help!'
      setChat(prev => [...prev, { role: 'bot', text: typeof reply === 'string' ? reply : reply[0] || 'Got it!' }])
    } catch (err) {
      setChat(prev => [...prev, { role: 'bot', text: 'Sorry, I\'m having trouble connecting. Please try again or email support@supplysense.com.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => sendMessage(message)
  const handleSuggestion = (suggestion: string) => sendMessage(suggestion)
  const handleClear = () => setChat([{ role: 'bot', text: 'Hi! 👋 I\'m the SupplySense assistant. Ask me about features, pricing, or how to get started!' }])

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg text-white transition-all hover:scale-110"
          style={{ backgroundColor: config?.chatbotColor || '#2563eb' }}>
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col" style={{ height: '520px' }}>
          <div className="flex items-center justify-between px-4 py-3 text-white rounded-t-2xl" style={{ backgroundColor: config?.chatbotColor || '#2563eb' }}>
            <div className="flex items-center gap-2"><Bot size={20} /><span className="font-medium text-sm">{config?.chatbotTitle || 'SupplySense Assistant'}</span></div>
            <div className="flex items-center gap-1">
              <button onClick={handleClear} className="p-1 rounded-lg hover:bg-white/20" title="Clear chat"><Trash2 size={16} /></button>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/20"><X size={18} /></button>
            </div>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-br-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'}`}>{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md"><div className="flex gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} /><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} /></div></div>
              </div>
            )}
          </div>

          {chat.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-400 mb-2">Tap a suggestion:</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => handleSuggestion(s)}
                    className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..." className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <Button size="sm" onClick={handleSend} loading={loading} style={{ backgroundColor: config?.chatbotColor || '#2563eb' }}><Send size={14} /></Button>
          </div>
        </div>
      )}
    </>
  )
}