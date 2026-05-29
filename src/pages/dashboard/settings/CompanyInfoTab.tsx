import { useState, useEffect } from 'react'
import { settingsService } from '../../../services/settingsService'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import toast from 'react-hot-toast'

export default function CompanyInfoTab() {
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    settingsService.getCompanyInfo().then(setForm).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try { await settingsService.updateCompanyInfo(form); toast.success('Updated') }
    catch (err) { toast.error('Failed') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-xl space-y-4">
      <Input label="Company Name" value={form.organizationName || ''} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} />
      <Input label="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Phone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input label="Industry" value={form.industry || ''} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
      <Input label="Timezone" value={form.timezone || ''} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
      <Button onClick={handleSave} loading={saving}>Save</Button>
    </div>
  )
}