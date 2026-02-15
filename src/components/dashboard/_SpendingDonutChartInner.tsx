'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { SpendingDonutSlice } from '@/types'

export default function SpendingDonutChartInner({ data }: { data: SpendingDonutSlice[] }) {
  if (data.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center text-sm text-gray-500">
        No expense data for this period.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }}
          formatter={(value, name) => [`$${((value as number) ?? 0).toLocaleString()}`, String(name ?? '')] as [string, string]}
        />
        <Legend
          formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
