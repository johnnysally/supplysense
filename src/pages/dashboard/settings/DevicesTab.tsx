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
    if (type === 'mobile' || type === 'tablet') return <Smartphone size={16} />
    return <Monitor size={16} />
  }

  return (
    <div>
      <h3 className="font-semibold mb-4">Devices</h3>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : devices.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No devices</p>
      ) : (
        <div className="space-y-3">
          {devices.map((device) => (
            <div key={device._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><DeviceIcon type={device.deviceType} /></div>
                <div>
                  <p className="text-sm font-medium">{device.deviceName}</p>
                  <p className="text-xs text-gray-500">{device.deviceId?.substring(0, 20)}... · Last active: {formatDate(device.lastActive)}</p>
                </div>
                {device.trustLevel === 'trusted' && <Shield size={14} className="text-green-500" />}
              </div>
              {device.isActive && <Button variant="danger" size="sm" onClick={() => handleDeactivate(device._id)}>Deactivate</Button>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}