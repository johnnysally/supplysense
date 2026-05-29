import { useState, useEffect } from 'react'
import { settingsService } from '../../../services/settingsService'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/common/Input'
import toast from 'react-hot-toast'
import { Plus, Trash2, Link2, RefreshCw, Check, X, RotateCcw } from 'lucide-react'

const ERP_TYPES = [
  { value: 'odoo', label: 'Odoo' }, { value: 'zoho', label: 'Zoho' }, { value: 'sap', label: 'SAP Business One' },
  { value: 'dynamics', label: 'Microsoft Dynamics' }, { value: 'shopify', label: 'Shopify' }, { value: 'woocommerce', label: 'WooCommerce' },
  { value: 'hdm', label: 'HDM ERP' }, { value: 'smartpos', label: 'SmartPOS' }, { value: 'custom', label: 'Custom API' }, { value: 'csv', label: 'CSV Import' }
]

const SYNC_INTERVALS = [
  { value: 'realtime', label: 'Real-time (5 min)' }, { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' }, { value: 'manual', label: 'Manual only' }
]

export default function ERPTab() {
  const [connections, setConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [form, setForm] = useState({ type: 'hdm', name: '', url: '', apiKey: '', username: '', password: '', database: '', consumerKey: '', consumerSecret: '', syncInterval: 'daily' })
  const [saving, setSaving] = useState(false)

  const fetchConnections = async () => {
    setLoading(true)
    try { const res = await settingsService.getERPConnections(); setConnections(Array.isArray(res) ? res : []) }
    catch (err) { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchConnections() }, [])

  const handleSave = async () => {
    if (!form.name || !form.url) { toast.error('Name and URL required'); return }
    setSaving(true)
    try { await settingsService.addERPConnection(form); toast.success('Connection added'); setShowAdd(false); fetchConnections() }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleTest = async (id: string) => {
    setTesting(id)
    try { const res = await settingsService.testERPConnection(id); toast.success(res?.message || 'Connected') }
    catch (err: any) { toast.error('Connection failed') }
    finally { setTesting(null) }
  }

  const handleSync = async (id: string) => {
    setSyncing(id)
    try {
      const res = await settingsService.syncERPConnection(id)
      toast.success(`Imported: ${res?.productsImported || 0} products, ${res?.customersImported || 0} customers, ${res?.transactionsImported || 0} transactions`)
      fetchConnections()
    } catch (err: any) { toast.error('Sync failed') }
    finally { setSyncing(null) }
  }

  const handleUnsync = async (id: string) => {
    if (!confirm('Remove all data imported from this ERP? Manual data will be kept.')) return
    setSyncing(id)
    try {
      const res = await settingsService.unsyncERPConnection(id)
      toast.success(`Removed: ${res.removed?.products || 0} products, ${res.removed?.customers || 0} customers`)
      fetchConnections()
    } catch (err: any) { toast.error('Unsync failed') }
    finally { setSyncing(null) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this connection?')) return
    try { await settingsService.deleteERPConnection(id); toast.success('Deleted'); fetchConnections() }
    catch (err) { toast.error('Failed') }
  }

  const connectionFields = () => {
    switch (form.type) {
      case 'odoo': return <><Input label="Odoo URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /><Input label="API Key" type="password" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} /><Input label="Database" value={form.database} onChange={(e) => setForm({ ...form, database: e.target.value })} /></>
      case 'hdm': case 'smartpos': case 'custom':
        return <><Input label="API URL" placeholder="https://server.pxxl.click" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /><Input label="API Key" type="password" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} /></>
      default: return <><Input label="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /><Input label="API Key" type="password" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} /></>
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">ERP Connections</h3>
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus size={14} className="mr-1" /> Add</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : connections.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border p-8 text-center">
          <Link2 size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500">No ERP connections</p>
          <Button size="sm" className="mt-4" onClick={() => setShowAdd(true)}>Add Connection</Button>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {connections.map((conn) => (
            <div key={conn._id} className="bg-white dark:bg-gray-800 rounded-xl border p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg"><Link2 size={18} className="text-primary-600" /></div>
                  <div>
                    <p className="font-medium text-sm">{conn.name}</p>
                    <p className="text-xs text-gray-500">
                      {ERP_TYPES.find(t => t.value === conn.type)?.label || conn.type}
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${conn.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {conn.isActive ? <Check size={10} className="inline" /> : <X size={10} className="inline" />} {conn.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {SYNC_INTERVALS.find(s => s.value === conn.syncInterval)?.label || conn.syncInterval}
                      {conn.lastSync && ` · Last: ${new Date(conn.lastSync).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleTest(conn._id)} loading={testing === conn._id}><RefreshCw size={14} /></Button>
                  <Button variant="primary" size="sm" onClick={() => handleSync(conn._id)} loading={syncing === conn._id && syncing !== conn._id + 'unsync'}><RefreshCw size={14} className="mr-1" /> Sync</Button>
                  <button onClick={() => handleUnsync(conn._id)} className="p-1.5 rounded hover:bg-yellow-50 text-yellow-600" title="Unsync data"><RotateCcw size={14} /></button>
                  <button onClick={() => handleDelete(conn._id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add ERP Connection" size="lg">
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          <Input label="Connection Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div>
            <label className="block text-sm font-medium mb-1">ERP Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800">
              {ERP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          {connectionFields()}
          <div>
            <label className="block text-sm font-medium mb-1">Sync Interval</label>
            <select value={form.syncInterval} onChange={(e) => setForm({ ...form, syncInterval: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800">
              {SYNC_INTERVALS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <Button onClick={handleSave} loading={saving} className="w-full">Add Connection</Button>
        </div>
      </Modal>
    </div>
  )
}