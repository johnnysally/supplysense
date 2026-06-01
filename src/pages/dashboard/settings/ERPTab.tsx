import { useState, useEffect } from 'react'
import { settingsService } from '../../../services/settingsService'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/common/Input'
import toast from 'react-hot-toast'
import { Plus, Trash2, Plug, RefreshCw, Check, X, RotateCcw, Zap, Clock, Activity, ExternalLink, AlertCircle } from 'lucide-react'

const ERP_TYPES = [
  { value: 'odoo', label: 'Odoo', color: 'purple' }, { value: 'zoho', label: 'Zoho', color: 'blue' },
  { value: 'sap', label: 'SAP Business One', color: 'orange' }, { value: 'dynamics', label: 'Microsoft Dynamics', color: 'sky' },
  { value: 'shopify', label: 'Shopify', color: 'green' }, { value: 'woocommerce', label: 'WooCommerce', color: 'pink' },
  { value: 'hdm', label: 'HDM ERP', color: 'indigo' }, { value: 'smartpos', label: 'SmartPOS', color: 'emerald' },
  { value: 'custom', label: 'Custom API', color: 'gray' }, { value: 'csv', label: 'CSV Import', color: 'slate' }
]

const SYNC_INTERVALS = [
  { value: 'realtime', label: 'Real-time (5 min)', icon: Zap }, { value: 'hourly', label: 'Hourly', icon: Clock },
  { value: 'daily', label: 'Daily', icon: Clock }, { value: 'manual', label: 'Manual only', icon: Activity }
]

export default function ERPTab() {
  const [connections, setConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [form, setForm] = useState({ type: 'hdm', name: '', url: '', apiKey: '', username: '', password: '', database: '', consumerKey: '', consumerSecret: '', syncInterval: 'daily' })
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchConnections = async () => { setLoading(true); try { const res = await settingsService.getERPConnections(); setConnections(Array.isArray(res) ? res : []) } catch (err) { toast.error('Failed to load') } finally { setLoading(false) } }
  useEffect(() => { fetchConnections() }, [])

  const handleSave = async () => { if (!form.name || !form.url) { toast.error('Name and URL required'); return }; setSaving(true); try { await settingsService.addERPConnection(form); toast.success('Connection added'); setShowAdd(false); fetchConnections() } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed') } finally { setSaving(false) } }
  const handleTest = async (id: string) => { setTesting(id); try { const res = await settingsService.testERPConnection(id); toast.success(res?.message || 'Connected') } catch (err: any) { toast.error('Test failed') } finally { setTesting(null) } }
  const handleSync = async (id: string) => { setSyncing(id); try { const res = await settingsService.syncERPConnection(id); toast.success(`${res?.productsImported || 0} products, ${res?.customersImported || 0} customers imported`); fetchConnections() } catch (err: any) { toast.error('Sync failed') } finally { setSyncing(null) } }
  const handleUnsync = async (id: string) => { if (!confirm('Remove all imported data? Manual data stays.')) return; setSyncing(id); try { const res = await settingsService.unsyncERPConnection(id); toast.success(`${res.removed?.products || 0} products removed`); fetchConnections() } catch (err: any) { toast.error('Unsync failed') } finally { setSyncing(null) } }
  const handleDelete = async (id: string) => { if (!confirm('Delete connection?')) return; try { await settingsService.deleteERPConnection(id); toast.success('Deleted'); fetchConnections() } catch (err) { toast.error('Failed') } }

  const getColorClasses = (color: string) => {
    const map: Record<string, string> = { purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', sky: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400', green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', gray: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400', slate: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400' }
    return map[color] || map.gray
  }

  const connectionFields = () => {
    switch (form.type) { case 'odoo': return <><Input label="Odoo URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /><Input label="API Key" type="password" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} /><Input label="Database" value={form.database} onChange={(e) => setForm({ ...form, database: e.target.value })} /></>; case 'hdm': case 'smartpos': case 'custom': return <><Input label="API URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /><Input label="API Key" type="password" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} /></>; default: return <><Input label="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /><Input label="API Key" type="password" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} /></> }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4"><div><h3 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">ERP Connections</h3><p className="text-xs text-gray-500 mt-0.5">Connect external systems to sync data automatically</p></div><Button size="sm" onClick={() => setShowAdd(true)}><Plus size={14} className="mr-1" /> Add Connection</Button></div>

      {loading ? (<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>) : connections.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center"><Plug size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" /><p className="text-gray-500 dark:text-gray-400 font-medium">No ERP connections</p><p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Connect HDM ERP, SmartPOS, Odoo, Shopify, or other systems.</p><Button size="sm" className="mt-5" onClick={() => setShowAdd(true)}><Plus size={14} className="mr-1" /> Add Connection</Button></div>
      ) : (
        <div className="space-y-3">
          {connections.map((conn) => { const erpInfo = ERP_TYPES.find(t => t.value === conn.type); const isExpanded = expanded === conn._id
            return (
              <div key={conn._id} className={`bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-200 ${conn.isActive ? 'border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-2xl border ${getColorClasses(erpInfo?.color || 'gray')}`}><Plug size={22} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap"><p className="font-semibold text-gray-900 dark:text-gray-100">{conn.name}</p><span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getColorClasses(erpInfo?.color || 'gray')}`}>{erpInfo?.label || conn.type}</span><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${conn.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>{conn.isActive ? <Check size={10} /> : <X size={10} />} {conn.isActive ? 'Active' : 'Inactive'}</span></div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400"><span className="flex items-center gap-1"><Clock size={12} /> {SYNC_INTERVALS.find(s => s.value === conn.syncInterval)?.label || conn.syncInterval}</span>{conn.lastSync ? (<span className="flex items-center gap-1 text-green-600 dark:text-green-400"><Check size={12} /> Last: {new Date(conn.lastSync).toLocaleDateString()}</span>) : (<span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400"><AlertCircle size={12} /> Never synced</span>)}</div>
                        {isExpanded && (<div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-xs space-y-1"><p><span className="text-gray-500 dark:text-gray-400">URL:</span> <span className="font-mono text-gray-700 dark:text-gray-300">{conn.url}</span></p>{conn.database && <p><span className="text-gray-500 dark:text-gray-400">Database:</span> <span className="text-gray-700 dark:text-gray-300">{conn.database}</span></p>}</div>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => setExpanded(isExpanded ? null : conn._id)}><ExternalLink size={13} className="mr-1" /> Details</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleTest(conn._id)} loading={testing === conn._id}><Activity size={13} className="mr-1" /> Test</Button>
                      <Button size="sm" onClick={() => handleSync(conn._id)} loading={syncing === conn._id && syncing !== conn._id + 'unsync'}><RefreshCw size={13} className="mr-1" /> Sync</Button>
                      <Button variant="secondary" size="sm" onClick={() => handleUnsync(conn._id)} className="!text-yellow-600 !bg-yellow-50 hover:!bg-yellow-100 dark:!bg-yellow-900/20 dark:hover:!bg-yellow-900/40"><RotateCcw size={13} className="mr-1" /> Unsync</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(conn._id)}><Trash2 size={13} className="mr-1" /> Delete</Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add ERP Connection" size="lg">
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          <Input label="Connection Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ERP Type</label><div className="grid grid-cols-2 gap-2">{ERP_TYPES.map(t => (<button key={t.value} onClick={() => setForm({ ...form, type: t.value })} className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${form.type === t.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}><Plug size={16} /> {t.label}</button>))}</div></div>
          {connectionFields()}
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sync Interval</label><div className="grid grid-cols-2 gap-2">{SYNC_INTERVALS.map(s => (<button key={s.value} onClick={() => setForm({ ...form, syncInterval: s.value })} className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${form.syncInterval === s.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}><s.icon size={16} /> {s.label}</button>))}</div></div>
          <Button onClick={handleSave} loading={saving} className="w-full">Add Connection</Button>
        </div>
      </Modal>
    </div>
  )
}