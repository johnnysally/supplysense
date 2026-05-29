import { useParams, Link } from 'react-router-dom'
import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'
import { useEffect, useState } from 'react'
import api from '../../services/api'

const defaultTerms = `
<h2>1. Acceptance of Terms</h2>
<p>By accessing or using SupplySense ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree, do not use the Service.</p>

<h2>2. Description of Service</h2>
<p>SupplySense is an AI-powered supply chain management platform that provides inventory tracking, supplier management, order tracking, customer insights, employee management, and predictive analytics.</p>

<h2>3. User Accounts</h2>
<p>You are responsible for maintaining the confidentiality of your account credentials and license key. You agree to notify us immediately of any unauthorized use of your account.</p>

<h2>4. License Keys</h2>
<p>Each organization receives a unique license key. This key is required for device activation. License keys are non-transferable and must be kept secure. Lost keys may not be recoverable.</p>

<h2>5. Subscription and Payments</h2>
<p>Free trials are available for a limited duration. Paid plans (Standard and Pro+) are billed according to the selected cycle (monthly, yearly, or permanent). Payments are processed via Stripe, M-Pesa, or PayPal.</p>

<h2>6. Acceptable Use</h2>
<p>Users agree to use SupplySense only for lawful purposes and not to abuse the service or disrupt its operations.</p>

<h2>7. Limitations of Liability</h2>
<p>SupplySense is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages.</p>

<h2>8. Changes to Terms</h2>
<p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>

<h2>9. Governing Law</h2>
<p>These terms are governed by applicable laws and regulations.</p>

<h2>10. Contact Us</h2>
<p>For questions about these terms, please contact our support team.</p>
`

const defaultPrivacy = `
<h2>Privacy Policy</h2>
<p>SupplySense is committed to protecting your privacy. This policy explains how we collect, use, and protect your data.</p>

<h2>1. Data Collection</h2>
<p>We collect information necessary to provide our service, including user account data, transaction history, and usage analytics.</p>

<h2>2. Data Usage</h2>
<p>Your data is used to improve our service, provide customer support, and generate analytics.</p>

<h2>3. Data Protection</h2>
<p>We implement industry-standard security measures to protect your data from unauthorized access.</p>

<h2>4. Third-Party Sharing</h2>
<p>We do not share your personal data with third parties without your consent, except as required by law.</p>

<h2>5. Your Rights</h2>
<p>You have the right to access, modify, or delete your personal data. Contact support for assistance.</p>

<h2>6. Changes to Policy</h2>
<p>We may update this privacy policy periodically. Changes will be effective when posted.</p>
`

export default function LegalViewPage() {
  const { page } = useParams<{ page?: string }>()
  const [content, setContent] = useState(defaultTerms)
  const [settings, setSettings] = useState({ general: {}, footer: {}, systemName: 'SupplySense' })

  useEffect(() => {
    if (page === 'privacy') {
      setContent(defaultPrivacy)
    } else {
      setContent(defaultTerms)
    }
  }, [page])

  const handleLegalClick = (type: string) => {
    // Handle legal page navigation if needed
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <Link to="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Back to Home
        </Link>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
      <Footer settings={settings} onLegalClick={handleLegalClick} />
    </div>
  )
}