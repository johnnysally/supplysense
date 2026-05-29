import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import CookieConsent from '../../components/landing/CookieConsent'
import { Package, Truck, BarChart3, Shield, Zap, Users } from 'lucide-react'
import api from '../../services/api'

export default function LandingPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState<any>({
    systemName: 'SupplySense',
    general: { heroTitle: 'Intelligent Supply Chain Management', heroSubtitle: 'Predict, monitor, and optimize your supply chain with AI-powered insights.', aboutContent: '', email: '', phone: '', address: '' },
    footer: { copyright: 'SupplySense Systems', columns: [] },
    legal: { terms: '', privacy: '', cookies: '' },
    pricing: { trial: { duration: 14 }, standard: { monthly: 0, yearly: 0, permanent: 0 }, proplus: { monthly: 0, yearly: 0, permanent: 0 } },
    paymentConfig: { currency: 'KSh' }
  })
  const [legalModal, setLegalModal] = useState<string | null>(null)

  useEffect(() => {
    api.get('/client/auth/public-settings').then(res => { if (res.data) setSettings(prev => ({ ...prev, ...res.data })) }).catch(() => {})
  }, [])

  const g = settings.general
  const currency = settings.paymentConfig?.currency || 'KSh'
  const pricing = settings.pricing || {}
  const symbol = currency === 'KSh' ? 'KSh' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'

  const plans = [
    { plan: 'Free Trial', price: `${pricing.trial?.duration || 14} days`, sub: 'No credit card required', features: ['1 user', 'Up to 50 products', 'Basic tracking', 'Dashboard alerts'], label: 'Get Started', popular: false, billingCards: null },
    { plan: 'Standard', price: `${symbol}${pricing.standard?.monthly || 0}`, sub: '/mo', features: ['Up to 10 users', 'Up to 5,000 products', 'AI predictions', 'Email alerts', '1 ERP connector'], label: 'Get Started', popular: true, billingCards: [{ label: 'Monthly', price: `${symbol}${pricing.standard?.monthly || 0}` }, { label: 'Yearly', price: `${symbol}${pricing.standard?.yearly || 0}` }, { label: 'Permanent', price: `${symbol}${pricing.standard?.permanent || 0}` }] },
    { plan: 'Pro+', price: `${symbol}${pricing.proplus?.monthly || 0}`, sub: '/mo', features: ['Unlimited users', 'Unlimited products', 'Full AI suite', 'SMS + WhatsApp', 'Unlimited ERPs', 'White-label', 'Priority support'], label: 'Get Started', popular: false, billingCards: [{ label: 'Monthly', price: `${symbol}${pricing.proplus?.monthly || 0}` }, { label: 'Yearly', price: `${symbol}${pricing.proplus?.yearly || 0}` }, { label: 'Permanent', price: `${symbol}${pricing.proplus?.permanent || 0}` }] }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 px-4 text-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">{g.heroTitle}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">{g.heroSubtitle}</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/pricing')}>Get Started Free</Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>Launch App</Button>
          </div>
        </section>

        <section id="features" className="py-20 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Everything you need</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Powerful features to manage your entire supply chain</p>
          </div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{ icon: Package, title: 'Inventory Tracking', desc: 'Real-time stock levels and AI-powered stockout predictions.' },
              { icon: Truck, title: 'Supplier Management', desc: 'Score suppliers, track performance, get recommendations.' },
              { icon: BarChart3, title: 'AI Insights', desc: 'Demand forecasting, anomaly detection, smart recommendations.' },
              { icon: Zap, title: 'Order Management', desc: 'Track orders from placement to delivery.' },
              { icon: Shield, title: 'Smart Alerts', desc: 'Get notified via email, SMS, or WhatsApp.' },
              { icon: Users, title: 'Team Management', desc: 'Add users, manage devices, control access.' }
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4"><f.icon size={24} className="text-primary-600" /></div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {g.aboutContent && (
          <section id="about" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">About {settings.systemName}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{g.aboutContent}</p>
            </div>
          </section>
        )}

        <section id="pricing" className="py-20 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Simple Pricing</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Start free, upgrade when you're ready</p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((p, i) => (
              <div key={i} className={`p-8 rounded-xl border text-center relative flex flex-col ${p.popular ? 'border-primary-500 border-2' : 'border-gray-200 dark:border-gray-700'}`}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-3 py-0.5 rounded-full text-xs font-medium">Popular</span>}
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{p.plan}</h3>
                <p className="text-4xl font-bold text-primary-600 mt-4">{p.price}<span className="text-sm text-gray-500">{p.sub}</span></p>
                {p.billingCards && (
                  <div className="grid grid-cols-3 gap-1 mt-4">
                    {p.billingCards.map((card, j) => (
                      <div key={j} className="bg-green-50 dark:bg-green-900/20 rounded-lg px-2 py-2 text-center border border-green-200 dark:border-green-800">
                        <p className="text-xs text-green-700 dark:text-green-400 font-medium">{card.label}</p>
                        <p className="text-sm font-bold text-green-700 dark:text-green-400">{card.price}</p>
                      </div>
                    ))}
                  </div>
                )}
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-6 space-y-2 text-left flex-1">{p.features.map((f, j) => <li key={j}>✓ {f}</li>)}</ul>
                <Button className="w-full mt-8" onClick={() => navigate('/pricing')}>{p.label}</Button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer settings={settings} onLegalClick={(type) => setLegalModal(type)} />
      <Modal isOpen={!!legalModal} onClose={() => setLegalModal(null)} title={legalModal === 'terms' ? 'Terms & Conditions' : legalModal === 'privacy' ? 'Privacy Policy' : 'Cookies Policy'} size="lg">
        <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: settings.legal?.[legalModal || ''] || '<p>Not yet configured.</p>' }} />
      </Modal>
      <CookieConsent />
    </div>
  )
}