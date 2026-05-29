import { useState, useEffect } from 'react'
import { orderService } from '../../services/orderService'
import { useAuthStore } from '../../store/authStore'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { formatDate, formatCurrency } from '../../utils/helpers'
import { ORDER_STATUS_LABELS } from '../../utils/constants'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const organization = useAuthStore((state) => state.organization)
  const isERP = organization?.mode === 'erp'
  const [data, setData] = useState<any>({ orders: [] })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [showStatus, setShowStatus] = useState<any>(null)
  const [form, setForm] = useState({ productId: '', supplierId: '', quantity: '1', unitPrice: '', priority: 'medium' })
  const [statusForm, setStatusForm] = useState({ status: '', notes: '' })
  const [creating, setCreating] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try { const res = await orderService.getAll({ page }); setData(res) }
    catch (err) { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page])

  const handleCreate = async () => {
    if (!form.productId || !form.supplierId || !form.unitPrice) { toast.error('Fill required fields'); return }
    setCreating(true)
    try {
      await orderService.create({ ...form, quantity: parseInt(form.quantity), unitPrice: parseFloat(form.unitPrice) })
      toast.success('Order created')
      setShowCreate(false)
      fetchData()
    } catch (err) { toast.error('Failed') }
    finally { setCreating(false) }
  }

  const handleStatusUpdate = async () => {
    if (!statusForm.status) return
    try {
      await orderService.updateStatus(showStatus._id, statusForm.status, statusForm.notes)
      toast.success('Status updated')
      setShowStatus(null)
      fetchData()
    } catch (err) { toast.error('Failed') }
  }

  const columns = [
    { key: 'orderNumber', header: 'Order #', render: (o: any) => <span className="font-mono text-xs">{o.orderNumber}</span> },
    { key: 'productId', header: 'Product', render: (o: any) => o.productId?.name || '—' },
    { key: 'supplierId', header: 'Supplier', render: (o: any) => o.supplierId?.name || '—' },
    { key: 'quantity', header: 'Qty' },
    { key: 'totalAmount', header: 'Total', render: (o: any) => formatCurrency(o.totalAmount) },
    { key: 'status', header: 'Status', render: (o: any) => (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${o.status === 'delivered' ? 'bg-green-100 text-green-800' : o.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
        {ORDER_STATUS_LABELS[o.status] || o.status}
      </span>
    )},
    { key: 'actions', header: '', render: (o: any) => (
      <Button variant="ghost" size="sm" onClick={() => { setShowStatus(o); setStatusForm({ status: o.status, notes: '' }) }}>Update</Button>
    )}
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orders</h1>
          {isERP && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Synced from ERP</p>}
        </div>
        {!isERP && <Button onClick={() => setShowCreate(true)}><Plus size={16} className="mr-1" /> New Order</Button>}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table columns={columns} data={data.orders || []} loading={loading} />
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
          <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Order">
            <div className="space-y-3">
              <Input label="Product ID" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} />
              <Input label="Supplier ID" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} />
              <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              <Input label="Unit Price" type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} />
              <Button onClick={handleCreate} loading={creating} className="w-full">Create</Button>
            </div>
          </Modal>
          <Modal isOpen={!!showStatus} onClose={() => setShowStatus(null)} title="Update Status">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={statusForm.status} onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800">
                  {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <Input label="Notes" value={statusForm.notes} onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })} />
              <Button onClick={handleStatusUpdate} className="w-full">Update</Button>
            </div>
          </Modal>
        </>
      )}
    </div>
  )
}