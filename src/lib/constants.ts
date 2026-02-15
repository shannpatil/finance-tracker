export const DEFAULT_CATEGORIES = [
  { name: 'Housing',       color: '#ef4444' },
  { name: 'Food',          color: '#f97316' },
  { name: 'Transport',     color: '#eab308' },
  { name: 'Healthcare',    color: '#22c55e' },
  { name: 'Entertainment', color: '#8b5cf6' },
  { name: 'Shopping',      color: '#ec4899' },
  { name: 'Utilities',     color: '#06b6d4' },
  { name: 'Salary',        color: '#10b981' },
  { name: 'Freelance',     color: '#3b82f6' },
  { name: 'Investments',   color: '#6366f1' },
  { name: 'Other',         color: '#6b7280' },
] as const

export const CURRENCIES = [
  { code: 'USD', label: 'USD — US Dollar',         symbol: '$'  },
  { code: 'EUR', label: 'EUR — Euro',               symbol: '€'  },
  { code: 'GBP', label: 'GBP — British Pound',      symbol: '£'  },
  { code: 'INR', label: 'INR — Indian Rupee',        symbol: '₹'  },
  { code: 'JPY', label: 'JPY — Japanese Yen',        symbol: '¥'  },
  { code: 'CAD', label: 'CAD — Canadian Dollar',     symbol: 'CA$' },
  { code: 'AUD', label: 'AUD — Australian Dollar',   symbol: 'A$' },
  { code: 'CHF', label: 'CHF — Swiss Franc',         symbol: 'Fr' },
  { code: 'CNY', label: 'CNY — Chinese Yuan',        symbol: '¥'  },
  { code: 'BRL', label: 'BRL — Brazilian Real',      symbol: 'R$' },
  { code: 'MXN', label: 'MXN — Mexican Peso',        symbol: 'MX$' },
  { code: 'SGD', label: 'SGD — Singapore Dollar',    symbol: 'S$' },
] as const

export type CurrencyCode = typeof CURRENCIES[number]['code']

export const RECURRENCE_OPTIONS = [
  { value: 'daily',   label: 'Daily'   },
  { value: 'weekly',  label: 'Weekly'  },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly',  label: 'Yearly'  },
] as const

export const CATEGORY_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
  '#6b7280', '#14b8a6', '#84cc16', '#f43f5e', '#a855f7',
] as const
