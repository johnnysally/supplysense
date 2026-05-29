import { useState, useEffect } from 'react'
import { inventoryService } from '../../services/inventoryService'
import { useAuthStore } from '../../store/authStore'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { formatCurrency } from '../../utils/helpers'
import { Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export default function InventoryPage() {
  const organization = useAuthStore((state) => state.organization)
  const isERP = organization?.mode === 'erp'
  const [data, setData] = useState<any>({ products: [] })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [showStock, setShowStock] = useState<any>(null)
  const [form, setForm] = useState({ sku: '', name: '', stockLevel: '0', reorderThreshold: '10', unitCost: '', sellingPrice: '' })
  const [stockForm, setStockForm] = useState({ quantity: '', type: 'increase', reason: '' })
  const [creating, setCreating] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try { const res = await inventoryService.getAll({ page, search: search || undefined }); setData(res) }
    catch (err) { toast.error('Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page])

  const handleCreate = async () => {
    if (!form.sku || !form.name) { toast.error('SKU and name required'); return }
    setCreating(true)
    try {
      await inventoryService.create({ ...form, stockLevel: parseInt(form.stockLevel), reorderThreshold: parseInt(form.reorderThreshold), unitCost: parseFloat(form.unitCost) || 0, sellingPrice: parseFloat(form.sellingPrice) || 0 })
      toast.success('Product created')
      setShowCreate(false)
      fetchData()
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed') }
    finally { setCreating(false) }
  }

  const handleStockAdjust = async () => {
    try {
      await inventoryService.adjustStock(showStock._id, parseInt(stockForm.quantity), stockForm.type, stockForm.reason)
      toast.success('Stock updated')
      setShowStock(null)
      fetchData()
    } catch (err) { toast.error('Failed') }
  }

  const columns = [
    { key: 'sku', header: 'SKU', render: (p: any) => <span className="font-mono text-xs">{p.sku}</span> },
    { key: 'name', header: 'Name', render: (p: any) => <span className="font-medium">{p.name}</span> },
    { key: 'stockLevel', header: 'Stock', render: (p: any) => <span className={p.stockLevel <= p.reorderThreshold ? 'text-red-600 font-medium' : ''}>{p.stockLevel}</span> },
    { key: 'reorderThreshold', header: 'Threshold' },
    { key: 'unitCost', header: 'Cost', render: (p: any) => formatCurrency(p.unitCost) },
    { key: 'sellingPrice', header: 'Price', render: (p: any) => formatCurrency(p.sellingPrice) },
    { key: 'actions', header: '', render: (p: any) => (
      <Button variant="ghost" size="sm" onClick={() => { setShowStock(p); setStockForm({ quantity: '', type: 'increase', reason: '' }) }}>Stock</Button>
    )}
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Inventory</h1>
          {isERP && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Synced from ERP</p>}
        </div>
        {!isERP && <Button onClick={() => setShowCreate(true)}><Plus size={16} className="mr-1" /> Add Product</Button>}
      </div>
      <div className="flex gap-2 mb-4">
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchData()} />
        <Button onClick={fetchData}><Search size={16} /></Button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table columns={columns} data={data.products || []} loading={loading} />
      </div>
      {data.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: data.pagination.pages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded text-sm ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>{i + 1}</button>
          ))}
        </div>
      )}
      {!isERP && (
        <>
          <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Product">
            <div className="space-y-3">
              <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Stock Level" type="number" value={form.stockLevel} onChange={(e) => setForm({ ...form, stockLevel: e.target.value })} />
              <Input label="Reorder Threshold" type="number" value={form.reorderThreshold} onChange={(e) => setForm({ ...form, reorderThreshold: e.target.value })} />
              <Input label="Unit Cost" type="number" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} />
              <Input label="Selling Price" type="number" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
              <Button onClick={handleCreate} loading={creating} className="w-full">Create</Button>
            </div>
          </Modal>
          <Modal isOpen={!!showStock} onClose={() => setShowStock(null)} title={`Adjust Stock: ${showStock?.name}`}>
            <div className="space-y-3">
              <Input label="Quantity" type="number" value={stockForm.quantity} onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })} />
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={stockForm.type} onChange={(e) => setStockForm({ ...stockForm, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800">
                  <option value="increase">Increase</option>
                  <option value="decrease">Decrease</option>
                </select>
              </div>
              <Input label="Reason" value={stockForm.reason} onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })} />
              <Button onClick={handleStockAdjust} className="w-full">Update</Button>
            </div>
          </Modal>
        </>
      )}
    </div>
  )
}