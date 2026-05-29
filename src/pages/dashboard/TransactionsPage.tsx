import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { transactionService } from '../../services/transactionService'
import { useAuthStore } from '../../store/authStore'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { formatDate, formatCurrency } from '../../utils/helpers'
import { TRANSACTION_TYPES } from '../../utils/constants'
import { Plus, Search, Lock, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TransactionsPage() {
  const organization = useAuthStore((state) => state.organization)
  const isERP = organization?.mode === 'erp'
  const [tab, setTab] = useState<'all' | 'invoices'>('all')
  const [data, setData] = useState<any>({ transactions: [], blocked: false })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ type: 'sale', amount: '', quantity: '1', description: '', paymentMethod: 'cash', invoiceNumber: '', dueDate: '', invoiceStatus: 'paid' })
  const [creating, setCreating] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await transactionService.getAll({ page, search: search || undefined })
      setData({ transactions: res.transactions || [], blocked: false, pagination: res.pagination })
    } catch (err: any) {
      if (err?.response?.status === 403) setData({ transactions: [], blocked: true })
      else toast.error('Failed to load')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page])

  const handleCreate = async () => {
    if (!form.amount) { toast.error('Amount required'); return }
    setCreating(true)
    try {
      await transactionService.create({ ...form, amount: parseFloat(form.amount), quantity: parseInt(form.quantity) })
      toast.success('Created')
      setShowCreate(false)
      setForm({ type: 'sale', amount: '', quantity: '1', description: '', paymentMethod: 'cash', invoiceNumber: '', dueDate: '', invoiceStatus: 'paid' })
      fetchData()
    } catch (err) { toast.error('Failed') }
    finally { setCreating(false) }
  }

  if (data.blocked) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Transactions</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl border p-12 text-center">
          <Lock size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 font-medium text-lg">Feature Locked</p>
          <Link to="/pricing"><Button variant="primary" size="sm" className="mt-4">Upgrade Plan</Button></Link>
        </div>
      </div>
    )
  }

  const allColumns = [
    { key: 'transactionNumber', header: 'Ref', render: (t: any) => <span className="font-mono text-xs">{t.transactionNumber}</span> },
    { key: 'type', header: 'Type', render: (t: any) => <span className="capitalize text-xs">{TRANSACTION_TYPES[t.type] || t.type}</span> },
    { key: 'amount', header: 'Amount', render: (t: any) => <span className="font-medium">{formatCurrency(t.amount)}</span> },
    { key: 'description', header: 'Description', render: (t: any) => <span className="text-xs text-gray-500">{t.description || '—'}</span> },
    { key: 'transactionDate', header: 'Date', render: (t: any) => <span className="text-xs">{formatDate(t.transactionDate)}</span> }
  ]

  const invoiceColumns = [
    { key: 'invoiceNumber', header: 'Invoice #', render: (t: any) => <span className="font-mono text-xs font-medium">{t.invoiceNumber || t.transactionNumber}</span> },
    { key: 'description', header: 'Client', render: (t: any) => <span className="text-xs">{t.description || '—'}</span> },
    { key: 'amount', header: 'Amount', render: (t: any) => <span className="font-bold">{formatCurrency(t.amount)}</span> },
    { key: 'invoiceStatus', header: 'Status', render: (t: any) => (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${t.invoiceStatus === 'paid' ? 'bg-green-100 text-green-700' : t.invoiceStatus === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>
        {t.invoiceStatus || 'paid'}
      </span>
    )},
    { key: 'dueDate', header: 'Due Date', render: (t: any) => <span className="text-xs">{t.dueDate ? formatDate(t.dueDate) : '—'}</span> }
  ]

  const invoiceData = (data.transactions || []).filter((t: any) => t.invoiceNumber)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Transactions</h1>
          {isERP && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Synced from ERP</p>}
        </div>
        {!isERP && tab === 'all' && <Button onClick={() => setShowCreate(true)}><Plus size={16} className="mr-1" /> New</Button>}
      </div>

      <div className="flex gap-4 mb-4 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => setTab('all')} className={`pb-3 text-sm font-medium border-b-2 ${tab === 'all' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>All</button>
        <button onClick={() => setTab('invoices')} className={`pb-3 text-sm font-medium border-b-2 flex items-center gap-1 ${tab === 'invoices' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}><FileText size={14} /> Invoices ({invoiceData.length})</button>
      </div>

      <div className="flex gap-2 mb-4">
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchData()} />
        <Button onClick={fetchData}><Search size={16} /></Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
        <Table columns={tab === 'all' ? allColumns : invoiceColumns} data={tab === 'all' ? (data.transactions || []) : invoiceData} loading={loading} />
      </div>

      {data.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: data.pagination.pages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded text-sm ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>{i + 1}</button>
          ))}
        </div>
      )}

      {!isERP && tab === 'all' && (
        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Transaction">
          <div className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800">
                {Object.entries(TRANSACTION_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <Input label="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Button onClick={handleCreate} loading={creating} className="w-full">Create</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}