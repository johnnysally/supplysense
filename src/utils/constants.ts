export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const PLAN_LABELS: Record<string, string> = {
  trial: 'Free Trial',
  standard: 'Standard',
  proplus: 'Pro+'
}

export const BILLING_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  yearly: 'Yearly',
  permanent: 'Permanent',
  trial: 'Trial'
}

export const PAYMENT_METHODS: Record<string, string> = {
  stripe: 'Stripe',
  mpesa_stk: 'M-Pesa STK Push',
  mpesa_send: 'M-Pesa Send Money',
  mpesa_paybill: 'M-Pesa Paybill',
  mpesa_till: 'M-Pesa Till',
  paypal: 'PayPal'
}

export const CURRENCIES = ['KSh', 'USD', 'EUR', 'GBP'] as const

export const ORDER_STATUS_LABELS: Record<string, string> = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned'
}

export const TRANSACTION_TYPES: Record<string, string> = {
  sale: 'Sale',
  purchase: 'Purchase',
  return: 'Return',
  refund: 'Refund',
  expense: 'Expense',
  adjustment: 'Adjustment',
  transfer: 'Transfer'
}

export const ALERT_SEVERITY_COLORS: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800'
}

export const DEPARTMENT_OPTIONS = [
  'finance', 'hr', 'procurement', 'sales', 'warehouse', 'management', 'other'
] as const