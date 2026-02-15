'use client'

import dynamic from 'next/dynamic'
import type { SpendingDonutSlice } from '@/types'

const SpendingDonutChartInner = dynamic(() => import('./_SpendingDonutChartInner'), {
  ssr: false,
  loading: () => <div className="h-[240px] animate-pulse rounded-lg bg-white/5" />,
})

export function SpendingDonutChart({ data }: { data: SpendingDonutSlice[] }) {
  return <SpendingDonutChartInner data={data} />
}
