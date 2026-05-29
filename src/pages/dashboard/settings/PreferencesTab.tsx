import { useState, useEffect } from 'react'
import { settingsService } from '../../../services/settingsService'
import Button from '../../../components/common/Button'
import toast from 'react-hot-toast'

export default function PreferencesTab() {
  const [prefs, setPrefs] = useState<any>({ dateFormat: 'DD/MM/YYYY', notificationChannels: { email: true, sms: false, whatsapp: false } })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    settingsService.getPreferences().then(res => { if (res?.settings) setPrefs(res.settings) }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try { await settingsService.updatePreferences(prefs); toast.success('Saved') }
    catch (err) { toast.error('Failed') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Date Format</label>
        <select value={prefs.dateFormat} onChange={(e) => setPrefs({ ...prefs, dateFormat: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800">
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Notifications</p>
        <div className="space-y-2">
          {['email', 'sms', 'whatsapp'].map(ch => (
            <label key={ch} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={prefs.notificationChannels?.[ch] || false} onChange={() => setPrefs({ ...prefs, notificationChannels: { ...prefs.notificationChannels, [ch]: !prefs.notificationChannels?.[ch] } })} className="w-4 h-4 rounded text-primary-600" />
              <span className="text-sm capitalize">{ch}</span>
            </label>
          ))}
        </div>
      </div>
      <Button onClick={handleSave} loading={saving}>Save</Button>
    </div>
  )
}