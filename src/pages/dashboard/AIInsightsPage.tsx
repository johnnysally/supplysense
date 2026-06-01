import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { aiInsightsService } from '../../services/aiInsightsService'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { Search, TrendingUp, AlertTriangle, Lock, Sparkles, ChevronRight, BarChart3, Brain, Target, Shield, Zap, Package, Truck, Users, UserRound, Trash2, Clock, ArrowUpRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AIInsightsPage() {
  const organization = useAuthStore((state) => state.organization)
  const currency = (organization as any)?.settings?.currency || 'KSh'
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [history, setHistory] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('ss-ai-history') || '[]') } catch { return [] }
  })
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    aiInsightsService.getGeneral().catch((err: any) => { if (err?.response?.status === 403) setBlocked(true) })
  }, [])

  const saveToHistory = (res: any) => {
    const entry = { query: res.query || category || query, category: res.category, timestamp: new Date().toISOString(), preview: (res.key_findings || res.insights || '').slice(0, 120) }
    const updated = [entry, ...history.filter(h => h.query !== entry.query)].slice(0, 20)
    setHistory(updated)
    localStorage.setItem('ss-ai-history', JSON.stringify(updated))
  }

  const clearHistory = () => { setHistory([]); localStorage.removeItem('ss-ai-history'); toast.success('History cleared') }

  const handleSearch = async () => {
    if (!query && !category) { toast.error('Enter a query or select category'); return }
    setLoading(true)
    try {
      const res = await aiInsightsService.search(query, category)
      setResult(res)
      saveToHistory(res)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) { toast.error('Search failed') }
    finally { setLoading(false) }
  }

  const handleQuickSearch = async (q: string) => {
    setQuery(''); setCategory(q)
    setLoading(true)
    try {
      const res = await aiInsightsService.search('', q)
      setResult(res)
      saveToHistory(res)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) { toast.error('Search failed') }
    finally { setLoading(false) }
  }

  const loadFromHistory = (entry: any) => {
    setQuery(entry.query || '')
    setCategory(entry.category || '')
    handleQuickSearch(entry.category || entry.query)
  }

const formatText = (text: any): string => {
  if (!text) return ''
  if (Array.isArray(text)) return text.map(t => formatText(t)).join('\n\n')
  if (typeof text !== 'string') return String(text)
  
  let formatted = text.replace(/\$/g, currency + ' ')
  formatted = formatted.replace(/\b(\d{1,3}(,\d{3})*(\.\d{2})?)\b/g, (match) => {
    const num = parseFloat(match.replace(/,/g, ''))
    if (num > 0 && match.includes('.') === false && num >= 10) {
      return `${currency} ${num.toLocaleString()}`
    }
    return match
  })
  
  return formatted
}

  const getRecPriority = (rec: any) => rec?.priority || rec?.risk_level || 'LOW'
  const getRecDesc = (rec: any) => typeof rec === 'string' ? rec : rec?.description || rec?.action || rec?.recommendation || ''
  const getRecAction = (rec: any) => rec?.action || ''
  const getRecTimeline = (rec: any) => rec?.timeline || ''
  const getRecImpact = (rec: any) => rec?.impact || ''

  const insights = result?.key_findings || result?.insights || ''
  const metrics = result?.supporting_metrics || result?.charts || {}
  const recommendations = result?.recommendations || []
  const detailedAnalysis = result?.detailed_analysis || result?.detailed_explanation || null
  const confidence = result?.confidence_score || result?.confidence || 0.85

  const suggestedQueries = [
    { label: 'Inventory Health', query: 'inventory', icon: Package, color: 'blue' },
    { label: 'Supplier Reliability', query: 'suppliers', icon: Truck, color: 'green' },
    { label: 'Customer Churn', query: 'customers', icon: Users, color: 'purple' },
    { label: 'Revenue Analysis', query: 'revenue', icon: TrendingUp, color: 'yellow' },
    { label: 'Order Status', query: 'orders', icon: Sparkles, color: 'pink' },
    { label: 'Employee Performance', query: 'employees', icon: UserRound, color: 'indigo' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800',
    green: 'from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800',
    yellow: 'from-yellow-500/10 to-yellow-600/5 border-yellow-200 dark:border-yellow-800',
    pink: 'from-pink-500/10 to-pink-600/5 border-pink-200 dark:border-pink-800',
    indigo: 'from-indigo-500/10 to-indigo-600/5 border-indigo-200 dark:border-indigo-800',
  }

  if (blocked) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">AI Insights</h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-16 text-center">
          <Lock size={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-5" />
          <p className="text-gray-500 dark:text-gray-400 font-semibold text-xl">Feature Locked</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 max-w-md mx-auto">Upgrade to Standard or Pro+ to unlock AI-powered insights.</p>
          <Link to="/pricing"><Button variant="primary" size="lg" className="mt-6">Upgrade Plan</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">AI Insights</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Powered by advanced machine learning</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
          <Brain size={18} className="text-primary-600" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-400">Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedQueries.map((sq, i) => (
              <button key={i} onClick={() => handleQuickSearch(sq.query)} className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 flex items-center gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left ${colorMap[sq.color]}`}>
                <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm"><sq.icon size={22} className="text-primary-600" /></div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{sq.label}</span>
                <ChevronRight size={16} className="ml-auto text-gray-400" />
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex gap-3">
              <Input placeholder="Ask anything about your supply chain..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="flex-1" />
              <select value={category} onChange={(e) => { setCategory(e.target.value); setQuery('') }} className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800">
                <option value="">All</option><option value="inventory">Inventory</option><option value="suppliers">Suppliers</option><option value="customers">Customers</option><option value="orders">Orders</option><option value="transactions">Transactions</option><option value="employees">Employees</option>
              </select>
              <Button onClick={handleSearch} loading={loading} size="lg"><Search size={18} className="mr-2" /> Analyze</Button>
            </div>
          </div>

          {!result && (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <Brain size={64} className="mx-auto text-gray-200 dark:text-gray-700 mb-5" />
              <p className="text-gray-400 dark:text-gray-500 text-lg font-medium">Ask a question or select a category</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">AI will analyze your data and provide actionable insights</p>
            </div>
          )}

          {result && (
            <div ref={resultsRef} className="space-y-6 animate-in fade-in duration-300">
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={20} className="text-primary-600" />
                  <p className="text-sm font-semibold text-primary-700 dark:text-primary-400">AI Analysis</p>
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">{(confidence * 100).toFixed(0)}% confidence</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">{formatText(insights)}</p>
              </div>

              {detailedAnalysis && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailedAnalysis.executive_summary && (
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Executive Summary</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{detailedAnalysis.executive_summary}</p>
                    </div>
                  )}
                  {detailedAnalysis.risks && (
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Risks Identified</p>
                      <ul className="space-y-1">
                        {(Array.isArray(detailedAnalysis.risks) ? detailedAnalysis.risks : []).slice(0, 3).map((risk: string, i: number) => (
                          <li key={i} className="text-sm text-red-600 dark:text-red-400 flex items-start gap-2"><AlertTriangle size={14} className="mt-0.5 flex-shrink-0" /> {risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><Target size={16} className="text-primary-600" /> Action Plan</p>
                  <div className="space-y-2">
                    {recommendations.map((rec: any, i: number) => {
                      const priority = getRecPriority(rec)
                      const desc = getRecDesc(rec)
                      const action = getRecAction(rec)
                      const timeline = getRecTimeline(rec)
                      const impact = getRecImpact(rec)
                      const isHigh = priority === 'CRITICAL' || priority === 'HIGH'
                      return (
                        <div key={i} className={`p-4 rounded-xl border flex items-start gap-3 ${isHigh ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : priority === 'MEDIUM' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}`}>
                          <div className={`p-2 rounded-lg ${isHigh ? 'bg-red-100 dark:bg-red-800' : priority === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-800' : 'bg-green-100 dark:bg-green-800'}`}>
                            {isHigh ? <AlertTriangle size={16} className="text-red-600" /> : <Zap size={16} className="text-yellow-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isHigh ? 'bg-red-100 text-red-700' : priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{priority}</span>
                              {action && <span className="text-xs text-gray-500">{action}</span>}
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{formatText(desc)}</p>
                            <div className="flex gap-3 mt-1">
                              {timeline && <span className="text-xs text-gray-400"><Clock size={10} className="inline mr-1" />{timeline}</span>}
                              {impact && <span className="text-xs text-gray-400"><ArrowUpRight size={10} className="inline mr-1" />{impact}</span>}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {Object.keys(metrics).length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><Shield size={16} className="text-primary-600" /> Key Metrics</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(metrics).map(([key, value]: [string, any]) => {
                      if (typeof value === 'number') {
                        return (
                          <div key={key} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                            <p className="text-xs text-gray-500 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value % 1 !== 0 ? value.toFixed(1) : value.toLocaleString()}</p>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Clock size={16} className="text-primary-600" /> History</p>
              {history.length > 0 && (
                <button onClick={clearHistory} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors" title="Clear history"><Trash2 size={14} /></button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No searches yet</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.map((entry, i) => (
                  <button key={i} onClick={() => loadFromHistory(entry)} className="w-full text-left p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{entry.query || entry.category}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{entry.preview}</p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}