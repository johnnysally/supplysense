import { useState, useEffect } from 'react'
import { alertService } from '../../services/alertService'
import Button from '../../components/common/Button'
import { formatDate } from '../../utils/helpers'
import { ALERT_SEVERITY_COLORS } from '../../utils/constants'
import { Check, Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AlertSystemPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAlerts = async () => {
    setLoading(true)
    try { const res = await alertService.getAll({ limit: '50' }); setAlerts(res.alerts || []) }
    catch (err) { toast.error('Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAlerts() }, [])

  const handleMarkRead = async (id: string) => { await alertService.markAsRead(id); fetchAlerts() }
  const handleMarkAll = async () => { await alertService.markAllRead(); fetchAlerts(); toast.success('All marked as read') }
  const handleDismiss = async (id: string) => { await alertService.dismissAlert(id); fetchAlerts() }
  const handleAction = async (id: string, action: string) => { await alertService.actionAlert(id, action); fetchAlerts(); toast.success('Action recorded') }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Alerts</h1>
        <Button variant="secondary" onClick={handleMarkAll}>Mark All Read</Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border">No alerts</div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert._id} className={`bg-white dark:bg-gray-800 rounded-xl border p-4 flex items-start gap-4 ${!alert.isRead ? 'border-primary-300 dark:border-primary-700' : 'border-gray-200 dark:border-gray-700'}`}>
              <span className={`px-2 py-0.5 rounded text-xs font-medium mt-0.5 ${ALERT_SEVERITY_COLORS[alert.severity] || ''}`}>{alert.severity}</span>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{alert.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-2">{formatDate(alert.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1">
                {!alert.isRead && <button onClick={() => handleMarkRead(alert._id)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" title="Mark read"><Eye size={14} /></button>}
                {!alert.isActioned && <button onClick={() => handleAction(alert._id, 'Resolved')} className="p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600" title="Resolve"><Check size={14} /></button>}
                <button onClick={() => handleDismiss(alert._id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" title="Dismiss"><X size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}