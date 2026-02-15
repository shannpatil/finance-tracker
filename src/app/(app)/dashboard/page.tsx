'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { TopBar } from '@/components/layout/TopBar'
import { NetWorthChart } from '@/components/dashboard/NetWorthChart'
import { SpendingDonutChart } from '@/components/dashboard/SpendingDonutChart'
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart'
import { BudgetProgressList } from '@/components/dashboard/BudgetProgressList'
import { useTimeFilter } from '@/hooks/useTimeFilter'
import { formatCurrency } from '@/lib/utils/currency'
import type { DashboardData } from '@/lib/data/dashboard'

export default function DashboardPage() {
  const { dateRange } = useTimeFilter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [dashRes, profileRes] = await Promise.all([
        fetch(`/api/dashboard?start=${dateRange.start}&end=${dateRange.end}`),
        fetch('/api/profile'),
      ])
      if (dashRes.ok)    setData(await dashRes.json())
      if (profileRes.ok) setCurrency((await profileRes.json()).currency ?? 'USD')
      setLoading(false)
    }
    load()
  }, [dateRange.start, dateRange.end])

  return (
    <div>
      <TopBar title="Dashboard" />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-xs text-gray-500 mb-1">Net Worth</p>
          <p className="text-2xl font-semibold text-white">
            {loading ? '—' : formatCurrency(data?.netWorth ?? 0, currency)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 mb-1">Income (period)</p>
          <p className="text-2xl font-semibold text-green-400">
            {loading ? '—' : formatCurrency(data?.totalIncome ?? 0, currency)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 mb-1">Expenses (period)</p>
          <p className="text-2xl font-semibold text-red-400">
            {loading ? '—' : formatCurrency(data?.totalExpense ?? 0, currency)}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <h2 className="text-sm font-medium text-gray-400 mb-4">Net Worth Over Time</h2>
          {loading
            ? <div className="h-[240px] animate-pulse rounded-lg bg-white/5" />
            : <NetWorthChart data={data?.netWorthSeries ?? []} />
          }
        </Card>
        <Card>
          <h2 className="text-sm font-medium text-gray-400 mb-4">Spending by Category</h2>
          {loading
            ? <div className="h-[240px] animate-pulse rounded-lg bg-white/5" />
            : <SpendingDonutChart data={data?.spendingDonut ?? []} />
          }
        </Card>
      </div>

      <Card className="mb-6">
        <h2 className="text-sm font-medium text-gray-400 mb-4">Income vs Expenses</h2>
        {loading
          ? <div className="h-[240px] animate-pulse rounded-lg bg-white/5" />
          : <IncomeExpenseChart data={data?.incomeExpenseBar ?? []} />
        }
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-gray-400 mb-4">Budget Progress</h2>
        {loading
          ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-8 animate-pulse rounded bg-white/5" />)}</div>
          : <BudgetProgressList budgets={data?.budgets ?? []} currency={currency} />
        }
      </Card>
    </div>
  )
}
