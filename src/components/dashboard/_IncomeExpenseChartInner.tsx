'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatMonth } from '@/lib/utils/dates'
import type { IncomeExpenseBar } from '@/types'

export default function IncomeExpenseChartInner({ data }: { data: IncomeExpenseBar[] }) {
  if (data.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-gray-500">
        No data yet. Add some transactions.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }}
          labelStyle={{ color: '#9ca3af', fontSize: 12 }}
          formatter={(value, name) => [
            `$${((value as number) ?? 0).toLocaleString()}`,
            String(name ?? '').replace(/^./, c => c.toUpperCase()),
          ] as [string, string]}
          labelFormatter={(label) => formatMonth(String(label ?? ''))}
        />
        <Legend
          formatter={value => <span style={{ color: '#9ca3af', fontSize: 12 }}>{String(value ?? '').replace(/^./, c => c.toUpperCase())}</span>}
        />
        <Bar dataKey="income"  fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={32} />
        <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  )
}
