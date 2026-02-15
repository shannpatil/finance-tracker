'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatMonth } from '@/lib/utils/dates'
import type { NetWorthPoint } from '@/types'

export default function NetWorthChartInner({ data }: { data: NetWorthPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-gray-500">
        Add transactions to see your net worth trend.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
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
          formatter={(value) => [`$${((value as number) ?? 0).toLocaleString()}`, 'Net Worth']}
          labelFormatter={(label) => formatMonth(String(label ?? ''))}
        />
        <Line
          type="monotone"
          dataKey="netWorth"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#6366f1' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
