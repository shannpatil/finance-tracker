'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils/currency'
import type { BudgetWithSpend } from '@/types'

interface BudgetCardProps {
  budget: BudgetWithSpend
  currency: string
}

export function BudgetCard({ budget: b, currency }: BudgetCardProps) {
  const router = useRouter()

  async function handleDelete() {
    await fetch(`/api/budgets/${b.id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div>
          <Badge label={b.categories?.name ?? 'Unknown'} color={b.categories?.color} />
          <p className="text-xs text-gray-500 mt-1">
            Month {b.month}/{b.year}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-600 hover:text-red-400 transition-colors p-1"
          aria-label="Delete budget"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <ProgressBar value={b.percentage} color={b.categories?.color} showWarning className="mb-2" />

      <div className="flex items-center justify-between text-xs">
        <span className={b.percentage >= 100 ? 'text-red-400' : b.percentage >= 80 ? 'text-yellow-400' : 'text-gray-400'}>
          {b.percentage}% used
        </span>
        <span className="text-gray-400">
          {formatCurrency(b.spent, currency)} / {formatCurrency(b.monthly_limit, currency)}
        </span>
      </div>
    </Card>
  )
}
