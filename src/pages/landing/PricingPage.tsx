import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import CookieConsent from '../../components/landing/CookieConsent'
import api from '../../services/api'

export default function PricingPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState<any>({ systemName: 'SupplySense', pricing: { trial: { duration: 14 }, standard: { monthly: 0, yearly: 0, permanent: 0 }, proplus: { monthly: 0, yearly: 0, permanent: 0 } }, paymentConfig: { currency: 'KSh' } })
  const [billingModal, setBillingModal] = useState<{ plan: string } | null>(null)

  useEffect(() => { api.get('/client/auth/public-settings').then(res => { if (res.data) setSettings((prev: any) => ({ ...prev, ...res.data })) }).catch(() => {}) }, [])

  const currency = settings.paymentConfig?.currency || 'KSh'
  const pricing = settings.pricing || {}
  const symbol = currency === 'KSh' ? 'KSh' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'

  const handlePlanClick = (plan: string) => {
    if (plan === 'trial') navigate('/register?plan=trial')
    else setBillingModal({ plan })
  }
  const handleBillingSelect = (cycle: string) => { setBillingModal(null); navigate(`/register?plan=${billingModal?.plan}&billing=${cycle}`) }
  const getPlanPrice = (plan: string, cycle: string) => pricing[plan]?.[cycle] || 0

  const plans = [
    { plan: 'trial', name: 'Free Trial', price: `${pricing.trial?.duration || 14} days`, sub: 'No credit card required', features: ['1 user', 'Up to 50 products', 'Basic tracking', 'Dashboard alerts'], label: 'Get Started', popular: false },
    { plan: 'standard', name: 'Standard', price: `${symbol}${pricing.standard?.monthly || 0}`, sub: '/mo', features: ['Up to 10 users', 'Up to 5,000 products', 'AI predictions', 'Email alerts', '1 ERP connector'], label: 'Get Started', popular: true },
    { plan: 'proplus', name: 'Pro+', price: `${symbol}${pricing.proplus?.monthly || 0}`, sub: '/mo', features: ['Unlimited users', 'Unlimited products', 'Full AI suite', 'SMS + WhatsApp', 'Unlimited ERPs', 'White-label', 'Priority support'], label: 'Get Started', popular: false }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto text-center mb-12"><h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Simple, Transparent Pricing</h1><p className="text-gray-500 dark:text-gray-400 mt-2">Start free, upgrade when you're ready.</p></div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <div key={i} className={`p-8 rounded-xl border text-center relative flex flex-col bg-white dark:bg-gray-800 ${p.popular ? 'border-primary-500 border-2' : 'border-gray-200 dark:border-gray-700'}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-3 py-0.5 rounded-full text-xs font-medium">Popular</span>}
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{p.name}</h3>
              <p className="text-4xl font-bold text-primary-600 mt-4">{p.price}<span className="text-sm text-gray-500">{p.sub}</span></p>
              {p.plan !== 'trial' && (
                <div className="grid grid-cols-3 gap-1 mt-4">
                  {['monthly', 'yearly', 'permanent'].map(cycle => (
                    <div key={cycle} className="bg-green-50 dark:bg-green-900/20 rounded-lg px-2 py-2 text-center border border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-700 dark:text-green-400 font-medium capitalize">{cycle}</p>
                      <p className="text-sm font-bold text-green-700 dark:text-green-400">{symbol}{getPlanPrice(p.plan, cycle)}</p>
                    </div>
                  ))}
                </div>
              )}
              <ul className="text-sm text-gray-600 dark:text-gray-400 mt-6 space-y-2 text-left flex-1">{p.features.map((f, j) => <li key={j}>✓ {f}</li>)}</ul>
              <Button className="w-full mt-8" onClick={() => handlePlanClick(p.plan)}>{p.label}</Button>
            </div>
          ))}
        </div>
      </main>
      <Footer settings={settings} onLegalClick={() => {}} />
      <CookieConsent />
      <Modal isOpen={!!billingModal} onClose={() => setBillingModal(null)} title={`Choose Billing — ${billingModal?.plan === 'standard' ? 'Standard' : 'Pro+'}`}>
        <div className="space-y-3">
          {['monthly', 'yearly', 'permanent'].map(cycle => (
            <button key={cycle} onClick={() => handleBillingSelect(cycle)} className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left">
              <div><p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{cycle}</p><p className="text-sm text-gray-500">{cycle === 'monthly' ? 'Billed every month' : cycle === 'yearly' ? 'Billed annually' : 'One-time payment'}</p></div>
              <span className="text-lg font-bold text-primary-600">{symbol}{getPlanPrice(billingModal?.plan || 'standard', cycle)}</span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}