import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { aiInsightsService } from '../../services/aiInsightsService'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { Search, TrendingUp, AlertTriangle, Lightbulb, Lock, Sparkles, ChevronRight, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AIInsightsPage() {
  const organization = useAuthStore((state) => state.organization)
  const currency = (organization as any)?.settings?.currency || 'KSh'
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [generalLoading, setGeneralLoading] = useState(true)
  const [generalData, setGeneralData] = useState<any>(null)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    aiInsightsService.getGeneral()
      .then(setGeneralData)
      .catch((err) => { if (err?.response?.status === 403) setBlocked(true) })
      .finally(() => setGeneralLoading(false))
  }, [])

  const handleSearch = async () => {
    if (!query && !category) { toast.error('Enter a query or select category'); return }
    setLoading(true)
    try { const res = await aiInsightsService.search(query, category); setResult(res) }
    catch (err) { toast.error('Search failed') }
    finally { setLoading(false) }
  }

  const handleQuickSearch = async (q: string) => {
    setQuery(''); setCategory(q)
    setLoading(true)
    try { const res = await aiInsightsService.search('', q); setResult(res) }
    catch (err) { toast.error('Search failed') }
    finally { setLoading(false) }
  }

  const formatInsight = (text: string) => {
    if (!text) return ''
    return text.replace(/\$/g, currency + ' ')
  }

  const suggestedQueries = [
    { label: 'Inventory Health', query: 'inventory', icon: TrendingUp },
    { label: 'Supplier Reliability', query: 'suppliers', icon: AlertTriangle },
    { label: 'Customer Churn', query: 'customers', icon: Lightbulb },
    { label: 'Revenue Analysis', query: 'revenue', icon: BarChart3 },
    { label: 'Order Status', query: 'orders', icon: Sparkles },
    { label: 'Employee Performance', query: 'employees', icon: TrendingUp },
  ]

  if (blocked) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">AI Insights</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Lock size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Feature Locked</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Upgrade to Standard or Pro+ to access AI-powered insights.</p>
          <Link to="/pricing"><Button variant="primary" size="sm" className="mt-4">Upgrade Plan</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">AI Insights</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {suggestedQueries.map((sq, i) => (
          <button key={i} onClick={() => handleQuickSearch(sq.query)} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3 hover:border-primary-500 hover:shadow-md transition-all text-left">
            <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg"><sq.icon size={20} className="text-primary-600" /></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{sq.label}</span>
            <ChevronRight size={16} className="ml-auto text-gray-400" />
          </button>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
        <div className="flex gap-2 mb-4">
          <Input placeholder="Ask anything..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setQuery('') }} className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800">
            <option value="">All</option>
            <option value="inventory">Inventory</option>
            <option value="suppliers">Suppliers</option>
            <option value="customers">Customers</option>
            <option value="orders">Orders</option>
            <option value="transactions">Transactions</option>
            <option value="employees">Employees</option>
          </select>
          <Button onClick={handleSearch} loading={loading}><Search size={16} /></Button>
        </div>
        {result && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">💡 AI Analysis</p>
              <p className="text-sm text-blue-800 dark:text-blue-300">{formatInsight(result.insights)}</p>
            </div>
            {result.recommendations?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">📋 Recommendations</p>
                <div className="space-y-2">
                  {result.recommendations.map((rec: any, i: number) => (
                    <div key={i} className={`p-3 rounded-lg border flex items-start gap-3 ${
                      rec.priority === 'HIGH' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                      rec.priority === 'MEDIUM' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                      'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    }`}>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${rec.priority === 'HIGH' ? 'bg-red-100 text-red-700' : rec.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{rec.priority}</span>
                      <p className="text-sm">{formatInsight(rec.description)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {result.charts && Object.keys(result.charts).length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">📊 Data</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(result.charts).map(([key, value]: [string, any]) => {
                    if (typeof value === 'number') {
                      return (
                        <div key={key} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}</p>
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
      {!result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">Select a category or type a question to get AI-powered insights.</p>
        </div>
      )}
    </div>
  )
}