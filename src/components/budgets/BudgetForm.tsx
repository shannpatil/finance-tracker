'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { getCurrentMonthYear } from '@/lib/utils/dates'
import type { Category, BudgetFormData } from '@/types'

interface BudgetFormProps {
  categories: Category[]
  onSubmit: (data: BudgetFormData) => Promise<void>
  onCancel: () => void
}

export function BudgetForm({ categories, onSubmit, onCancel }: BudgetFormProps) {
  const { month, year } = getCurrentMonthYear()
  const [data, setData] = useState<BudgetFormData>({
    category_id:   '',
    monthly_limit: '',
    month,
    year,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!data.category_id) { setError('Select a category'); return }
    const limit = parseFloat(data.monthly_limit)
    if (isNaN(limit) || limit <= 0) { setError('Enter a valid limit'); return }

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
      <Select
        label="Category"
        options={categoryOptions}
        value={data.category_id}
        onChange={e => setData(p => ({ ...p, category_id: e.target.value }))}
        placeholder="Select category"
      />
      <Input
        label="Monthly limit"
        type="number"
        value={data.monthly_limit}
        onChange={e => setData(p => ({ ...p, monthly_limit: e.target.value }))}
        placeholder="e.g. 500"
        min="0.01"
        step="0.01"
        required
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">Set budget</Button>
      </div>
    </form>
  )
}
