import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import api from '../../services/api'
import { formatCurrency } from '../../utils/helpers'
import { AlertTriangle, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const formData = location.state?.formData || {}

  const plan = searchParams.get('plan') || 'standard'
  const billing = searchParams.get('billing') || 'monthly'

  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [step, setStep] = useState<'select' | 'auto_form' | 'manual_guide' | 'success'>('select')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [phone, setPhone] = useState(formData.phone || '')
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    api.get('/client/auth/public-settings').then(res => { if (res.data) setSettings(res.data) }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading || !settings) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>

  const pricing = settings.pricing || {}
  const currency = settings.paymentConfig?.currency || 'KSh'
  const amount = pricing[plan]?.[billing] || 0
  const planName = plan === 'standard' ? 'Standard' : 'Pro+'

  const enabledMethods = []
  if (settings.paymentConfig?.stripeEnabled) enabledMethods.push({ key: 'stripe', label: 'Credit/Debit Card (Stripe)', icon: '💳', auto: true })
  if (settings.paymentConfig?.paypalEnabled) enabledMethods.push({ key: 'paypal', label: 'PayPal', icon: '🅿️', auto: true })
  if (settings.paymentConfig?.mpesaEnabled) {
    if (settings.paymentConfig?.mpesaSubMethods?.stkPush) enabledMethods.push({ key: 'mpesa_stk', label: 'M-Pesa STK Push', icon: '📱', auto: true })
    if (settings.paymentConfig?.mpesaSubMethods?.sendMoney) enabledMethods.push({ key: 'mpesa_send', label: 'M-Pesa Send Money', icon: '💰', auto: false })
    if (settings.paymentConfig?.mpesaSubMethods?.paybill) enabledMethods.push({ key: 'mpesa_paybill', label: 'M-Pesa Paybill', icon: '🏦', auto: false })
    if (settings.paymentConfig?.mpesaSubMethods?.till) enabledMethods.push({ key: 'mpesa_till', label: 'M-Pesa Till', icon: '🛒', auto: false })
  }

  const handleMethodSelect = (key: string, auto: boolean) => {
    setPaymentMethod(key)
    if (auto) setStep('auto_form')
    else setStep('manual_guide')
  }

  const handleFinalSubmit = async () => {
    setProcessing(true)
    try {
      const payload: any = {
        ...formData,
        plan,
        billingCycle: billing,
        amount,
        currency,
        paymentMethod,
        paymentDetails: { phoneNumber: phone }
      }

      if (paymentMethod === 'mpesa_stk' || paymentMethod === 'stripe' || paymentMethod === 'paypal') {
        payload.paymentConfirmed = true
        payload.confirmationMethod = paymentMethod === 'mpesa_stk' ? 'auto_mpesa_callback' : paymentMethod === 'stripe' ? 'auto_stripe' : 'auto_paypal'
      }

      await api.post('/client/auth/register-with-payment', payload)
      setStep('success')
      toast.success('Application submitted')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Submission failed')
    } finally {
      setProcessing(false)
    }
  }

  const manualGuide = () => {
    const nums = settings.paymentConfig?.mpesaNumbers || {}
    if (paymentMethod === 'mpesa_send') return <div className="space-y-2 text-sm"><p>1. <strong>M-Pesa → Send Money</strong></p><p>2. Phone: <strong>{nums.sendMoneyPhone || '07XX XXX XXX'}</strong></p><p>3. Name: <strong>SupplySense</strong></p><p>4. Amount: <strong>{formatCurrency(amount, currency)}</strong></p><p>5. Enter PIN and send</p></div>
    if (paymentMethod === 'mpesa_paybill') return <div className="space-y-2 text-sm"><p>1. <strong>M-Pesa → Paybill</strong></p><p>2. Business: <strong>{nums.paybillBusinessNumber || 'XXXXXX'}</strong></p><p>3. Account: <strong>{phone || 'Your phone'}</strong></p><p>4. Amount: <strong>{formatCurrency(amount, currency)}</strong></p></div>
    if (paymentMethod === 'mpesa_till') return <div className="space-y-2 text-sm"><p>1. <strong>M-Pesa → Buy Goods</strong></p><p>2. Till: <strong>{nums.tillNumber || 'XXXXXX'}</strong></p><p>3. Amount: <strong>{formatCurrency(amount, currency)}</strong></p></div>
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">Checkout</h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">{planName} · {billing} · {formatCurrency(amount, currency)}</p>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            {step === 'select' && (
              <>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">Select Payment Method</h3>
                <div className="space-y-2">
                  {enabledMethods.map(m => (
                    <button key={m.key} onClick={() => handleMethodSelect(m.key, m.auto)} className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left">
                      <span className="text-2xl">{m.icon}</span><span className="text-sm font-medium text-gray-900 dark:text-gray-100">{m.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 'auto_form' && (
              <>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                  {paymentMethod === 'stripe' ? 'Card Payment' : paymentMethod === 'mpesa_stk' ? 'M-Pesa STK Push' : 'PayPal Payment'}
                </h3>
                {paymentMethod === 'mpesa_stk' && (
                  <div className="space-y-3">
                    <Input label="M-Pesa Phone" placeholder="2547XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <p className="text-xs text-gray-400">You'll receive a popup to enter your PIN.</p>
                  </div>
                )}
                {paymentMethod === 'stripe' && <p className="text-sm text-gray-500">Card payment will be processed securely via Stripe.</p>}
                {paymentMethod === 'paypal' && <p className="text-sm text-gray-500">You'll be redirected to PayPal to complete payment.</p>}
                <Button onClick={() => setShowConfirm(true)} className="w-full">Submit Application · {formatCurrency(amount, currency)}</Button>
                <button onClick={() => setStep('select')} className="w-full text-sm text-gray-500 hover:underline">← Back</button>
              </>
            )}

            {step === 'manual_guide' && (
              <>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">Payment Instructions</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">{manualGuide()}</div>
                <Input label="Your Phone Number" placeholder="2547XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">⚠️ Complete payment on your phone first, then submit.</p>
                </div>
                <Button onClick={() => setShowConfirm(true)} className="w-full">I Have Paid — Submit Application</Button>
                <button onClick={() => setStep('select')} className="w-full text-sm text-gray-500 hover:underline">← Back</button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer settings={settings} onLegalClick={() => {}} />

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Submission">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">Before submitting:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Amount: <strong>{formatCurrency(amount, currency)}</strong></li>
                <li>Plan: <strong>{planName}</strong> · <strong>{billing}</strong></li>
                <li>Your account will be reviewed by admin</li>
                <li>License key sent within 24 hours upon approval</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowConfirm(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleFinalSubmit} loading={processing} className="flex-1">Confirm & Submit</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={step === 'success'} onClose={() => navigate('/login')} title="Application Submitted">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"><Check size={32} className="text-green-600" /></div>
          <p className="text-gray-600 dark:text-gray-400">Your application has been submitted for review.</p>
          <p className="text-sm text-gray-500">License key will be sent via SMS & Email after admin approval.</p>
          <Button onClick={() => navigate('/login')} className="w-full">Go to Login</Button>
        </div>
      </Modal>
    </div>
  )
}