import { Bell, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { ALERT_SEVERITY_COLORS } from '../../utils/constants'
import { formatDate } from '../../utils/helpers'

interface Alert {
  _id: string
  title: string
  message: string
  severity: string
  createdAt: string
  isRead: boolean
}

interface AlertFeedProps {
  alerts: Alert[]
}

export default function AlertFeed({ alerts }: AlertFeedProps) {
  const severityIcons: Record<string, any> = {
    info: Info,
    warning: AlertTriangle,
    critical: AlertCircle
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4">Recent Alerts</h3>
      {alerts.length === 0 ? (
        <p className="text-sm text-gray-400">No alerts</p>
      ) : (
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => {
            const Icon = severityIcons[alert.severity] || Info
            return (
              <div key={alert._id} className="flex items-start gap-3">
                <div className={`p-1 rounded ${ALERT_SEVERITY_COLORS[alert.severity]?.split(' ')[0]}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{alert.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(alert.createdAt)}</p>
                </div>
                {!alert.isRead && <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}