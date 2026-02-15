'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { SavingsGoal } from '@/types'

interface ContributeModalProps {
  goal: SavingsGoal
  onClose: () => void
}

export function ContributeModal({ goal, onClose }: ContributeModalProps) {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const value = parseFloat(amount)
    if (isNaN(value) || value <= 0) { setError('Enter a valid amount'); return }

    setLoading(true)
    const res = await fetch(`/api/goals/${goal.id}/contribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: value, note }),
    })

    if (!res.ok) {
      setError('Failed to log contribution')
      setLoading(false)
      return
    }

    router.refresh()
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-gray-400">
        Add a contribution toward <strong className="text-white">{goal.name}</strong>.
      </p>
      <Input
        label="Amount"
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="0.00"
        min="0.01"
        step="0.01"
        required
      />
      <Input
        label="Note (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="e.g. Monthly savings transfer"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">Add contribution</Button>
      </div>
    </form>
  )
}
