'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { RECURRENCE_OPTIONS } from '@/lib/constants'
import type { Category, Transaction, TransactionFormData, TransactionType } from '@/types'

const TYPE_OPTIONS = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
]

const RECURRENCE_SELECT = RECURRENCE_OPTIONS.map(o => ({ value: o.value, label: o.label }))

interface TransactionFormProps {
  categories: Category[]
  initial?: Transaction
  onSubmit: (data: TransactionFormData) => Promise<void>
  onCancel: () => void
}

export function TransactionForm({ categories, initial, onSubmit, onCancel }: TransactionFormProps) {
  const today = new Date().toISOString().slice(0, 10)

  const [data, setData] = useState<TransactionFormData>({
    amount:               initial ? String(initial.amount) : '',
    type:                 (initial?.type as TransactionType) ?? 'expense',
    category_id:          initial?.category_id ?? '',
    date:                 initial?.date ?? today,
    note:                 initial?.note ?? '',
    is_recurring:         initial?.is_recurring ?? false,
    recurrence_frequency: initial?.recurrence_frequency ?? '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof TransactionFormData>(key: K, value: TransactionFormData[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!data.amount || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) {
      setError('Amount must be a positive number')
      return
    }

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
      {/* Type toggle */}
      <div>
        <span className="text-sm font-medium text-gray-300 block mb-1.5">Type</span>
        <div className="flex rounded-lg bg-white/5 p-0.5 gap-0.5">
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('type', opt.value as TransactionType)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                data.type === opt.value
                  ? opt.value === 'income'
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Amount"
        type="number"
        value={data.amount}
        onChange={e => set('amount', e.target.value)}
        placeholder="0.00"
        min="0.01"
        step="0.01"
        required
      />

      <Select
        label="Category"
        value={data.category_id}
        onChange={e => set('category_id', e.target.value)}
        options={categoryOptions}
        placeholder="Select category"
      />

      <Input
        label="Date"
        type="date"
        value={data.date}
        onChange={e => set('date', e.target.value)}
        required
      />

      <Input
        label="Note (optional)"
        type="text"
        value={data.note}
        onChange={e => set('note', e.target.value)}
        placeholder="e.g. Coffee with team"
      />

      {/* Recurring toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => set('is_recurring', !data.is_recurring)}
          className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
            data.is_recurring ? 'bg-indigo-600' : 'bg-white/20'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              data.is_recurring ? 'translate-x-5' : ''
            }`}
          />
        </div>
        <span className="text-sm text-gray-300">Recurring</span>
      </label>

      {data.is_recurring && (
        <Select
          label="Frequency"
          value={data.recurrence_frequency}
          onChange={e => set('recurrence_frequency', e.target.value as typeof data.recurrence_frequency)}
          options={RECURRENCE_SELECT}
          placeholder="Select frequency"
        />
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {initial ? 'Save changes' : 'Add transaction'}
        </Button>
      </div>
    </form>
  )
}
