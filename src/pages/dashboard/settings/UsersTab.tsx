import { useState, useEffect } from 'react'
import { settingsService } from '../../../services/settingsService'
import Table from '../../../components/common/Table'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import Input from '../../../components/common/Input'
import { DEPARTMENT_OPTIONS } from '../../../utils/constants'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', role: 'user', department: 'other' })
  const [creating, setCreating] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try { const res = await settingsService.getUsers(); setUsers(Array.isArray(res) ? res : res.users || []) }
    catch (err) { toast.error('Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleCreate = async () => {
    if (!form.fullName || !form.email || !form.password) { toast.error('Required fields missing'); return }
    setCreating(true)
    try { await settingsService.createUser(form); toast.success('User created'); setShowCreate(false); fetch() }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Failed') }
    finally { setCreating(false) }
  }

  const handleDelete = async (id: string) => {
    try { await settingsService.deleteUser(id); toast.success('Deactivated'); fetch() }
    catch (err) { toast.error('Failed') }
  }

  const columns = [
    { key: 'fullName', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (u: any) => <span className="capitalize">{u.role}</span> },
    { key: 'department', header: 'Department', render: (u: any) => <span className="capitalize">{u.department}</span> },
    { key: 'actions', header: '', render: (u: any) => <Button variant="ghost" size="sm" onClick={() => handleDelete(u._id)}>Deactivate</Button> }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Users</h3>
        <Button size="sm" onClick={() => setShowCreate(true)}><Plus size={14} className="mr-1" /> Add</Button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden">
        <Table columns={columns} data={users} loading={loading} />
      </div>
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add User">
        <div className="space-y-3">
          <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800">
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800">
              {DEPARTMENT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <Button onClick={handleCreate} loading={creating} className="w-full">Create</Button>
        </div>
      </Modal>
    </div>
  )
}