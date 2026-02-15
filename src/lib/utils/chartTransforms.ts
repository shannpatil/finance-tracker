import type {
  Transaction,
  Category,
  NetWorthPoint,
  SpendingDonutSlice,
  IncomeExpenseBar,
} from '@/types'

// Net Worth Line Chart — cumulative balance by month
export function toNetWorthSeries(transactions: Transaction[]): NetWorthPoint[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Accumulate by month, keeping only the last value per month
  let running = 0
  const byMonth: Record<string, number> = {}

  for (const t of sorted) {
    running += t.type === 'income' ? t.amount : -t.amount
    const month = t.date.slice(0, 7)
    byMonth[month] = running
  }

  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, netWorth]) => ({ month, netWorth: Math.round(netWorth * 100) / 100 }))
}

// Spending Donut Chart — expenses grouped by category
export function toSpendingDonut(
  transactions: Transaction[],
  categories: Category[]
): SpendingDonutSlice[] {
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]))
  const totals: Record<string, SpendingDonutSlice> = {}

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      if (!t.category_id) return
      const cat = catMap[t.category_id]
      if (!cat) return
      if (!totals[cat.id]) {
        totals[cat.id] = { name: cat.name, color: cat.color, value: 0 }
      }
      totals[cat.id].value = Math.round((totals[cat.id].value + t.amount) * 100) / 100
    })

  return Object.values(totals).sort((a, b) => b.value - a.value)
}

// Income vs Expense Bar Chart — grouped by month
export function toIncomeExpenseBar(transactions: Transaction[]): IncomeExpenseBar[] {
  const monthly: Record<string, IncomeExpenseBar> = {}

  transactions.forEach(t => {
    const month = t.date.slice(0, 7)
    if (!monthly[month]) monthly[month] = { month, income: 0, expense: 0 }
    if (t.type === 'income') {
      monthly[month].income = Math.round((monthly[month].income + t.amount) * 100) / 100
    } else {
      monthly[month].expense = Math.round((monthly[month].expense + t.amount) * 100) / 100
    }
  })

  return Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month))
}
