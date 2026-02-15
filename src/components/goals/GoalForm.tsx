'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { GoalFormData } from '@/types'

interface GoalFormProps {
  onSubmit: (data: GoalFormData) => Promise<void>
  onCancel: () => void
}

export function GoalForm({ onSubmit, onCancel }: GoalFormProps) {
  const [data, setData] = useState<GoalFormData>({ name: '', target_amount: '', target_date: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!data.name.trim()) { setError('Name is required'); return }
    const amount = parseFloat(data.target_amount)
    if (isNaN(amount) || amount <= 0) { setError('Enter a valid target amount'); return }

    setLoading(true)
    try {
      await onSubmit(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Goal name"
        value={data.name}
        onChange={e => setData(p => ({ ...p, name: e.target.value }))}
        placeholder="e.g. Emergency fund"
        required
      />
      <Input
        label="Target amount"
        type="number"
        value={data.target_amount}
        onChange={e => setData(p => ({ ...p, target_amount: e.target.value }))}
        placeholder="e.g. 10000"
        min="0.01"
        step="0.01"
        required
      />
      <Input
        label="Target date (optional)"
        type="date"
        value={data.target_date}
        onChange={e => setData(p => ({ ...p, target_date: e.target.value }))}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">Create goal</Button>
      </div>
    </form>
  )
}
