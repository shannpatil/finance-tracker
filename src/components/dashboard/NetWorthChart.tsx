'use client'

import dynamic from 'next/dynamic'
import type { NetWorthPoint } from '@/types'

const NetWorthChartInner = dynamic(() => import('./_NetWorthChartInner'), {
  ssr: false,
  loading: () => <div className="h-[240px] animate-pulse rounded-lg bg-white/5" />,
})

export function NetWorthChart({ data }: { data: NetWorthPoint[] }) {
  return <NetWorthChartInner data={data} />
}
