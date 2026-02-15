import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils/currency'
import type { BudgetWithSpend } from '@/types'

interface BudgetProgressListProps {
  budgets: BudgetWithSpend[]
  currency: string
}

export function BudgetProgressList({ budgets, currency }: BudgetProgressListProps) {
  if (budgets.length === 0) {
    return <p className="text-sm text-gray-500">No budgets set for this month.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {budgets.map(b => (
        <div key={b.id} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge label={b.categories?.name ?? 'Unknown'} color={b.categories?.color} />
              {b.percentage >= 100 && (
                <span className="text-xs text-red-400 font-medium">Over limit!</span>
              )}
              {b.percentage >= 80 && b.percentage < 100 && (
                <span className="text-xs text-yellow-400 font-medium">80%+</span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {formatCurrency(b.spent, currency)} / {formatCurrency(b.monthly_limit, currency)}
            </span>
          </div>
          <ProgressBar value={b.percentage} color={b.categories?.color} showWarning />
        </div>
      ))}
    </div>
  )
}
