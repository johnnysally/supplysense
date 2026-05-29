import { useState } from 'react'
import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  { q: 'What is SupplySense?', a: 'SupplySense is an AI-powered supply chain management platform that integrates with your existing ERP systems to provide predictive insights, real-time tracking, and smart recommendations.' },
  { q: 'How does the free trial work?', a: 'You get 14 days of full access with no credit card required. After the trial, you can upgrade to a Standard or Pro+ plan.' },
  { q: 'Can I connect my existing ERP?', a: 'Yes. We integrate with Odoo, Zoho, SAP Business One, Microsoft Dynamics, and you can also import via CSV.' },
  { q: 'What payment methods do you accept?', a: 'Stripe (cards), M-Pesa (STK Push, Send Money, Paybill, Till), and PayPal.' },
  { q: 'Is my data secure?', a: 'Yes. Each organization\'s data is fully isolated with encryption, JWT authentication, and role-based access control.' },
  { q: 'How does the AI work?', a: 'Our AI analyzes your historical data to predict stockouts, detect anomalies, score suppliers, and recommend actions.' },
  { q: 'What currencies do you support?', a: 'KSh, USD, EUR, and GBP. The admin sets the currency and all pricing converts automatically.' },
  { q: 'Can I add multiple users?', a: 'Yes. Depending on your plan, you can add users with different roles (Admin, Manager, Department User).' },
  { q: 'What happens when my trial expires?', a: 'You lose dashboard access until you upgrade. Your data is preserved.' }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-12">Find answers to common questions</p>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-750">
                  <span className="font-medium text-gray-900 dark:text-gray-100 pr-4">{faq.q}</span>
                  {openIndex === i ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                </button>
                {openIndex === i && <div className="px-6 pb-4"><p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer settings={{}} onLegalClick={() => {}} />
    </div>
  )
}