import type { Transaction } from '@/types'

export function toCSV(transactions: Transaction[]): string {
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Type', 'Currency']

  const rows = transactions.map(t => [
    t.date,
    csvEscape(t.note ?? ''),
    csvEscape(t.categories?.name ?? ''),
    t.amount.toFixed(2),
    t.type,
    '', // currency is on the user profile; left blank since transactions don't store it
  ])

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
