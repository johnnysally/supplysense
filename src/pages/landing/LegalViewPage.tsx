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

<h