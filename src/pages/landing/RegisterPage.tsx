import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import api from '../../services/api'
import { Copy, Check, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const plan = searchParams.get('plan') || 'trial'
  const billing = searchParams.get('billing') || 'monthly'
  const navigate = useNavigate()

  const [form, setForm] = useState({ organizationName: '', fullName: '', email: '', phone: '', password: '' })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [licenseKey, setLicenseKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [legalModal, setLegalModal] = useState<string | null>(null)
  const [settings, setSettings] = useState<any>({})

  const planName = plan === 'trial' ? 'Free Trial' : plan === 'standard' ? 'Standard' : 'Pro+'
  const isFree = plan === 'trial'

  useEffect(() => { api.get('/client/auth/public-settings').then(res => { if (res.data) setSettings(res.data) }).catch(() => {}) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) { toast.error('You must agree to the Terms & Conditions and Privacy Policy'); return }
    if (!form.organizationName || !form.fullName || !form.email || !form.password) { toast.error('Please fill in all required fields'); return }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }

    setLoading(true)
    try {
      const res = await api.post('/client/auth/register', { ...form, plan, billingCycle: isFree ? 'trial' : billing })

      if (isFree) {
        setLicenseKey(res.data.organization?.licenseKey || res.data.licenseKey)
      } else {
        navigate(`/checkout?plan=${plan}&billing=${billing}`, { state: { formData: form } })
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (licenseKey) {
      await navigator.clipboard.writeText(licenseKey)
      setCopied(true)
      toast.success('License key copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (licenseKey) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} className="text-green-600" /></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Account Created!</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Your free trial is ready</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your License Key</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <code className="flex-1 text-sm font-mono text-primary-600 font-bold select-all">{licenseKey}</code>
                <button onClick={handleCopy} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-500" />}
                </button>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">⚠️ Keep this key safe!</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">You will need it to activate your device when logging in. It cannot be recovered.</p>
            </div>
            <Link to="/activate"><Button className="w-full">Go to Activation <ArrowRight size={16} className="ml-2" /></Button></Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-600">SupplySense</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{isFree ? 'Create your free account' : 'Create your account'}</p>
          <div className="inline-block mt-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-full">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-400">{planName}</span>
            {!isFree && <span className="text-sm text-primary-600"> · {billing}</span>}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Company Name" value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} required />
            <Input label="Your Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="w-4 h-4 rounded text-primary-600 mt-0.5" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                I agree to the{' '}
                <button type="button" onClick={() => setLegalModal('terms')} className="text-primary-600 hover:underline">Terms & Conditions</button>
                {' '}and{' '}
                <button type="button" onClick={() => setLegalModal('privacy')} className="text-primary-600 hover:underline">Privacy Policy</button>
              </span>
            </label>

            <Button type="submit" loading={loading} className="w-full" disabled={!agreedToTerms}>
              {isFree ? 'Start Free Trial' : 'Continue to Payment'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Sign in</Link>
        </p>
      </div>

      <Modal isOpen={!!legalModal} onClose={() => setLegalModal(null)} title={legalModal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'} size="lg">
        <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: settings.legal?.[legalModal || ''] || '<p>Not yet configured.</p>' }} />
      </Modal>
    </div>
  )
}