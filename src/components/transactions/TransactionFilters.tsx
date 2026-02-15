'use client'

import { Select } from '@/components/ui/Select'
import type { Category, TransactionType } from '@/types'

const TYPE_OPTIONS = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
]

interface Filters {
  categoryId: string
  type: string
}

interface TransactionFiltersProps {
  categories: Category[]
  filters: Filters
  onChange: (filters: Filters) => void
}

export function TransactionFilters({ categories, filters, onChange }: TransactionFiltersProps) {
  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }))

  return (
    <div className="flex flex-wrap gap-3">
      <div className="w-40">
        <Select
          options={categoryOptions}
          value={filters.categoryId}
          onChange={e => onChange({ ...filters, categoryId: e.target.value })}
          placeholder="All categories"
        />
      </div>
      <div className="w-36">
        <Select
          options={TYPE_OPTIONS}
          value={filters.type}
          onChange={e => onChange({ ...filters, type: e.target.value })}
          placeholder="All types"
        />
      </div>
      {(filters.categoryId || filters.type) && (
        <button
          onClick={() => onChange({ categoryId: '', type: '' })}
          className="text-xs text-gray-400 hover:text-white underline"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
