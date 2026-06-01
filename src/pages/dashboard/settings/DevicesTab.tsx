import { useState, useEffect } from 'react'
import { settingsService } from '../../../services/settingsService'
import Button from '../../../components/common/Button'
import { formatDate } from '../../../utils/helpers'
import { Shield, Smartphone, Monitor } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DevicesTab() {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    setLoading(true)
    try { const res = await settingsService.getDevices(); setDevices(Array.isArray(res) ? res : []) }
    catch (err) { toast.error('Failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleDeactivate = async (id: string) => {
    try { await settingsService.deactivateDevice(id, 'Admin deactivation'); toast.success('Deactivated'); fetch() }
    catch (err) { toast.error('Failed') }
  }

  const DeviceIcon = ({ type }: { type: string }) => {
    if (type === 'mobile' || type === 'tablet') return <Smartphone size={16} className="text-gray-500 dark:text-gray-400" />
    return <Monitor size={16} className="text-gray-500 dark:text-gray-400" />
  }

  return (
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Devices</h3>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : devices.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Monitor size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No devices</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Devices will appear here when users activate their licenses.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {devices.map((device) => (
            <div key={device._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <DeviceIcon type={device.deviceType} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{device.deviceName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-mono">{device.deviceId?.substring(0, 20)}...</span>
                    <span className="mx-2">·</span>
                    Last active: {formatDate(device.lastActive)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${device.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {device.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {device.trustLevel === 'trusted' && (
                      <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <Shield size={12} /> Trusted
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {device.isActive && (
                <Button variant="danger" size="sm" onClick={() => handleDeactivate(device._id)}>Deactivate</Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}