import { useState, useEffect } from 'react'
import { settingsService } from '../../../services/settingsService'
import { useAuthStore } from '../../../store/authStore'
import Button from '../../../components/common/Button'
import { CURRENCIES } from '../../../utils/constants'
import toast from 'react-hot-toast'

export default function PreferencesTab() {
  const organization = useAuthStore((state) => state.organization)
  const updateOrganization = useAuthStore((state) => state.updateOrganization)
  const [prefs, setPrefs] = useState<any>({
    dateFormat: 'DD/MM/YYYY',
    currency: 'KSh',
    notificationChannels: { email: true, sms: false, whatsapp: false }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    settingsService.getPreferences().then(res => {
      if (res?.settings) setPrefs({
        dateFormat: res.settings.dateFormat || 'DD/MM/YYYY',
        currency: res.settings.currency || 'KSh',
        notificationChannels: res.settings.notificationChannels || { email: true, sms: false, whatsapp: false }
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsService.updatePreferences({
        dateFormat: prefs.dateFormat,
        currency: prefs.currency,
        notificationChannels: prefs.notificationChannels
      })
      updateOrganization({ settings: { ...organization?.settings, currency: prefs.currency, dateFormat: prefs.dateFormat, notificationChannels: prefs.notificationChannels } } as any)
      toast.success('Preferences saved')
    } catch (err) { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-xl space-y-6">
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Currency</h3>
        <p className="text-xs text-gray-500 mb-3">Affects all money displays — transactions, inventory, reports, AI insights.</p>
        <div className="grid grid-cols-4 gap-2">
          {CURRENCIES.map((cur) => (
            <button key={cur} onClick={() => setPrefs({ ...prefs, currency: cur })}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${prefs.currency === cur ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 shadow-sm' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}
            >{cur}</button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Date Format</h3>
        <select value={prefs.dateFormat} onChange={(e) => setPrefs({ ...prefs, dateFormat: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm">
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Notifications</h3>
        <div className="space-y-3">
          {['email', 'sms', 'whatsapp'].map(ch => (
            <label key={ch} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={prefs.notificationChannels?.[ch] || false}
                onChange={() => setPrefs({ ...prefs, notificationChannels: { ...prefs.notificationChannels, [ch]: !prefs.notificationChannels?.[ch] } })}
                className="w-4 h-4 rounded text-primary-600" />
              <span className="text-sm capitalize">{ch}</span>
            </label>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} loading={saving} className="w-full">Save Preferences</Button>
    </div>
  )
}