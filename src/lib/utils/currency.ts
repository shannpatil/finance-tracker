import { CURRENCIES, type CurrencyCode } from '@/lib/constants'

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    // Fallback for unknown currency codes
    const found = CURRENCIES.find(c => c.code === currency)
    const symbol = found ? found.symbol : currency
    return `${symbol}${amount.toFixed(2)}`
  }
}

export function getCurrencySymbol(currency: string): string {
  const found = CURRENCIES.find(c => c.code === (currency as CurrencyCode))
  return found?.symbol ?? currency
}
