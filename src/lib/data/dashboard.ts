import { createClient } from '@/lib/supabase/server'
import { getTransactions } from './transactions'
import { getBudgets } from './budgets'
import { getCategories } from './categories'
import {
  toNetWorthSeries,
  toSpendingDonut,
  toIncomeExpenseBar,
} from '@/lib/utils/chartTransforms'
import { getCurrentMonthYear } from '@/lib/utils/dates'
import type { NetWorthPoint, SpendingDonutSlice, IncomeExpenseBar, BudgetWithSpend } from '@/types'

export interface DashboardData {
  netWorthSeries: NetWorthPoint[]
  spendingDonut: SpendingDonutSlice[]
  incomeExpenseBar: IncomeExpenseBar[]
  budgets: BudgetWithSpend[]
  totalIncome: number
  totalExpense: number
  netWorth: number
}

export async function getDashboardData(start: string, end: string): Promise<DashboardData> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      netWorthSeries: [],
      spendingDonut: [],
      incomeExpenseBar: [],
      budgets: [],
      totalIncome: 0,
      totalExpense: 0,
      netWorth: 0,
    }
  }

  // Fetch all transactions for net worth (all-time), and filtered for period charts
  const [allTransactions, periodTransactions, categories] = await Promise.all([
    getTransactions(),
    getTransactions({ start, end }),
    getCategories(),
  ])

  const { month, year } = getCurrentMonthYear()
  const budgets = await getBudgets(month, year)

  const totalIncome  = periodTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = periodTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const netWorthSeries = toNetWorthSeries(allTransactions)
  const netWorth = netWorthSeries[netWorthSeries.length - 1]?.netWorth ?? 0

  return {
    netWorthSeries,
    spendingDonut: toSpendingDonut(periodTransactions, categories),
    incomeExpenseBar: toIncomeExpenseBar(allTransactions),
    budgets,
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalExpense: Math.round(totalExpense * 100) / 100,
    netWorth: Math.round(netWorth * 100) / 100,
  }
}
