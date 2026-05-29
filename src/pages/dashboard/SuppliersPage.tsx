import { useState, useEffect } from 'react'
import { supplierService } from '../../services/supplierService'
import { useAuthStore } from '../../store/authStore'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SuppliersPage() {
  const organization = useAuthStore((state) => state.organization)
  const isERP = organization?.mode === 'erp'
  const [data, setData] = useState<any>({ suppliers: [] })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', contactPerson: '', deliveryTimeline: '', paymentTerms: '' })
  const [creating, setCreating] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try { const res = await supplierService.getAll({ page }); setData(res) }
    catch (err) { toast.error('Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [page])

  const handleCreate = async () => {
    if (!form.name || !form.email) { toast.error('Name and email required'); return }
    setCreating(true)
    try {
      await supplierService.create({ ...form, deliveryTimeline: parseInt(form.deliveryTimeline) || 0 })
      toast.success('Supplier created')
      setShowCreate(false)
      setForm({ name: '', email: '', phone: '', contactPerson: '', deliveryTimeline: '', paymentTerms: '' })
      fetchData()
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed') }
    finally { setCreating(false) }
  }

  const columns = [
    { key: 'name', header: 'Name', render: (s: any) => <span className="font-medium">{s.name}</span> },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'reliabilityScore', header: 'Reliability', render: (s: any) => (
      <span className={`font-medium ${s.reliabilityScore >= 80 ? 'text-green-600' : s.reliabilityScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{s.reliabilityScore}%</span>
    )},
    { key: 'totalOrders', header: 'Orders' }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Suppliers</h1>
          {isERP && <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Synced from ERP</p>}
        </div>
        {!isERP && <Button onClick={() => setShowCreate(true)}><Plus size={16} className="mr-1" /> Add Supplier</Button>}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table columns={columns} data={data.suppliers || []} loading={loading} />
      </div>
      {data.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: data.pagination.pages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded text-sm ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>{i + 1}</button>
          ))}
        </div>
      )}
      {!isERP && (
        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Supplier">
          <div className="space-y-3">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Contact Person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
            <Input label="Delivery Timeline (days)" type="number" value={form.deliveryTimeline} onChange={(e) => setForm({ ...form, deliveryTimeline: e.target.value })} />
            <Input label="Payment Terms" value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} />
            <Button onClick={handleCreate} loading={creating} className="w-full">Create</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}