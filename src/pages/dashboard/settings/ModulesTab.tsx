import { useState, useEffect } from 'react'
import { settingsService } from '../../../services/settingsService'
import { useAuthStore } from '../../../store/authStore'
import { Link } from 'react-router-dom'
import Button from '../../../components/common/Button'
import toast from 'react-hot-toast'
import { LayoutDashboard, ArrowLeftRight, Package, ShoppingCart, Users, Truck, UserRound, BarChart3, Bell, Settings, Database, Lock } from 'lucide-react'

const allModules = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, locked: true, plans: ['trial', 'standard', 'proplus'] },
  { key: 'transactions', label: 'Transactions', icon: ArrowLeftRight, plans: ['standard', 'proplus'] },
  { key: 'orders', label: 'Orders', icon: ShoppingCart, plans: ['trial', 'standard', 'proplus'] },
  { key: 'inventory', label: 'Inventory', icon: Package, plans: ['trial', 'standard', 'proplus'] },
  { key: 'suppliers', label: 'Suppliers', icon: Truck, plans: ['trial', 'standard', 'proplus'] },
  { key: 'customers', label: 'Customers', icon: Users, plans: ['trial', 'standard', 'proplus'] },
  { key: 'employees', label: 'Employees', icon: UserRound, plans: ['standard', 'proplus'] },
  { key: 'aiInsights', label: 'AI Insights', icon: BarChart3, plans: ['standard', 'proplus'] },
  { key: 'reports', label: 'Reports', icon: BarChart3, plans: ['trial', 'standard', 'proplus'] },
  { key: 'alerts', label: 'Alerts', icon: Bell, plans: ['trial', 'standard', 'proplus'] },
  { key: 'settings', label: 'Settings', icon: Settings, locked: true, plans: ['trial', 'standard', 'proplus'] },
]

export default function ModulesTab() {
  const organization = useAuthStore((state) => state.organization)
  const updateOrganization = useAuthStore((state) => state.updateOrganization)
  const [enabled, setEnabled] = useState<Record<string, boolean>>({})
  const [mode, setMode] = useState('standalone')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const plan = organization?.plan || 'trial'

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await settingsService.getPreferences()
        setEnabled(res.enabledModules || {})
        setMode(res.mode || 'standalone')
      } catch (err) { toast.error('Failed to load') }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const toggleModule = (key: string) => {
    setEnabled(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsService.updatePreferences({ enabledModules: enabled, mode })
      updateOrganization({ enabledModules: enabled, mode })
      toast.success('Settings saved')
    } catch (err) { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const isPlanSupported = (mod: typeof allModules[0]) => mod.plans.includes(plan)

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-2xl space-y-6">
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">System Mode</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setMode('standalone')} className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'standalone' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
            <Database size={24} className="text-primary-600 mb-2" />
            <p className="font-semibold text-gray-900 dark:text-gray-100">Standalone</p>
            <p className="text-xs text-gray-500 mt-1">Manage everything manually</p>
          </button>
          <button onClick={() => setMode('erp')} className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'erp' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
            <svg className="w-6 h-6 text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            <p className="font-semibold text-gray-900 dark:text-gray-100">Connect ERP</p>
            <p className="text-xs text-gray-500 mt-1">Sync data from external systems</p>
          </button>
        </div>
        {mode === 'erp' && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-400">
            In ERP mode, data is synced from your external system. Manual entry (+ buttons) will be hidden.
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Enabled Modules</h3>
        <p className="text-xs text-gray-500 mb-4">Toggle modules on or off. Locked modules are required or not available on your plan.</p>
        <div className="space-y-2">
          {allModules.map((mod) => {
            const supported = isPlanSupported(mod)
            const isLocked = mod.locked || !supported
            const isOn = enabled[mod.key] !== false

            return (
              <div key={mod.key} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isLocked ? 'bg-gray-50 dark:bg-gray-900/50 opacity-60' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <mod.icon size={20} className={isOn && supported ? 'text-primary-600' : 'text-gray-400'} />
                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">{mod.label}</span>
                {isLocked && !supported ? (
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-gray-400" />
                    <Link to="/pricing" className="text-xs text-primary-600 hover:underline font-medium">Upgrade</Link>
                  </div>
                ) : mod.locked ? (
                  <span className="text-xs text-gray-400">Required</span>
                ) : (
                  <button
                    onClick={() => toggleModule(mod.key)}
                    className={`relative w-12 h-7 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 ${isOn ? 'bg-primary-600 shadow-md' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 flex items-center justify-center ${isOn ? 'translate-x-5' : 'translate-x-0'}`}>
                      {isOn ? (
                        <svg className="w-3 h-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      ) : (
                        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      )}
                    </span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Button onClick={handleSave} loading={saving} className="w-full">Save Settings</Button>
    </div>
  )
}