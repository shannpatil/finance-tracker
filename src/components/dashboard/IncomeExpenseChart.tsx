'use client'

import dynamic from 'next/dynamic'
import type { IncomeExpenseBar } from '@/types'

const IncomeExpenseChartInner = dynamic(() => import('./_IncomeExpenseChartInner'), {
  ssr: false,
  loading: () => <div className="h-[240px] animate-pulse rounded-lg bg-white/5" />,
})

export function IncomeExpenseChart({ data }: { data: IncomeExpenseBar[] }) {
  return <IncomeExpenseChartInner data={data} />
}
