'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ContributeModal } from './ContributeModal'
import { formatCurrency } from '@/lib/utils/currency'
import { daysUntil } from '@/lib/utils/dates'
import type { SavingsGoal } from '@/types'

interface GoalCardProps {
  goal: SavingsGoal
  currency: string
}

export function GoalCard({ goal, currency }: GoalCardProps) {
  const router = useRouter()
  const [contributing, setContributing] = useState(false)

  const percentage = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
  const remaining = Math.max(0, goal.target_amount - goal.current_amount)
  const days = goal.target_date ? daysUntil(goal.target_date) : null

  async function handleDelete() {
    await fetch(`/api/goals/${goal.id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <>
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-white">{goal.name}</h3>
            {days !== null && (
              <p className="text-xs text-gray-500 mt-0.5">
                {days > 0 ? `${days} days remaining` : days === 0 ? 'Due today' : 'Overdue'}
              </p>
            )}
          </div>
          <button
            onClick={handleDelete}
            className="text-gray-600 hover:text-red-400 transition-colors p-1"
            aria-label="Delete goal"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ProgressBar value={percentage} color="#6366f1" showWarning={false} className="mb-2" />

        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span>{percentage}% saved</span>
          <span>{formatCurrency(goal.current_amount, currency)} / {formatCurrency(goal.target_amount, currency)}</span>
        </div>

        {remaining > 0 && (
          <p className="text-xs text-gray-500 mb-3">
            {formatCurrency(remaining, currency)} remaining
          </p>
        )}

        <Button size="sm" variant="secondary" onClick={() => setContributing(true)} className="w-full">
          Add contribution
        </Button>
      </Card>

      <Modal open={contributing} onClose={() => setContributing(false)} title="Log Contribution">
        <ContributeModal goal={goal} onClose={() => setContributing(false)} />
      </Modal>
    </>
  )
}
