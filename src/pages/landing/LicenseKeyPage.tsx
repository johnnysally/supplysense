import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useDeviceCheck } from '../../hooks/useDeviceCheck'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import toast from 'react-hot-toast'

export default function LicenseKeyPage() {
  const [licenseKey, setLicenseKey] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { activateDevice } = useDeviceCheck()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!licenseKey) {
      toast.error('License key is required')
      return
    }

    const deviceId = activateDevice(licenseKey)

    setLoading(true)
    try {
      await authService.activateLicense(licenseKey, deviceId)
      toast.success('License activated! You can now sign in.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Activation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-600">SupplySense</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Activate License</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="License Key" placeholder="SSS-XXXX-XXXX-XXXX" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} />
            <Button type="submit" loading={loading} className="w-full">Activate</Button>
          </form>
        </div>
      </div>
    </div>
  )
}