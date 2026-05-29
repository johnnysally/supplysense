export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatCurrency(amount: number, currency: string = 'KSh'): string {
  const currencyMap: Record<string, { locale: string; code: string }> = {
    KSh: { locale: 'en-KE', code: 'KES' },
    USD: { locale: 'en-US', code: 'USD' },
    EUR: { locale: 'de-DE', code: 'EUR' },
    GBP: { locale: 'en-GB', code: 'GBP' }
  }

  const config = currencyMap[currency] || currencyMap.KSh

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 2
  }).format(amount)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function convertCurrencyAmount(amount: number, fromCurrency: string, toCurrency: string): number {
  const rates: Record<string, number> = {
    KSh: 1,
    USD: 0.0067,
    EUR: 0.0062,
    GBP: 0.0053
  }

  if (fromCurrency === toCurrency) return amount
  const inKSh = fromCurrency === 'KSh' ? amount : amount / (rates[fromCurrency] || 1)
  return toCurrency === 'KSh' ? Math.round(inKSh) : Math.round(inKSh * (rates[toCurrency] || 1) * 100) / 100
}

export function getExchangeRate(fromCurrency: string, toCurrency: string): number {
  const rates: Record<string, number> = {
    KSh: 1,
    USD: 0.0067,
    EUR: 0.0062,
    GBP: 0.0053
  }
  if (fromCurrency === toCurrency) return 1
  const inKSh = 1 / (rates[fromCurrency] || 1)
  return inKSh * (rates[toCurrency] || 1)
}