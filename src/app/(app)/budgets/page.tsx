'use client'

import { useState, useEffect } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { BudgetCard } from '@/components/budgets/BudgetCard'
import { BudgetForm } from '@/components/budgets/BudgetForm'
import { getCurrentMonthYear } from '@/lib/utils/dates'
import type { BudgetWithSpend, BudgetFormData, Category } from '@/types'

export default function BudgetsPage() {
  const { month, year } = getCurrentMonthYear()
  const [budgets, setBudgets]     = useState<BudgetWithSpend[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currency, setCurrency]   = useState('USD')
  const [loading, setLoading]     = useState(true)
  const [addOpen, setAddOpen]     = useState(false)

  async function load() {
    setLoading(true)
    const [budRes, catRes, profRes] = await Promise.all([
      fetch(`/api/budgets?month=${month}&year=${year}`),
      fetch('/api/categories'),
      fetch('/api/profile'),
    ])
    if (budRes.ok)  setBudgets(await budRes.json())
    if (catRes.ok)  setCategories(await catRes.json())
    if (profRes.ok) setCurrency((await profRes.json()).currency ?? 'USD')
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(data: BudgetFormData) {
    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create budget')
    setAddOpen(false)
    load()
  }

  return (
    <div>
      <TopBar title="Budgets" />

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">Monthly budgets for {new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        <Button size="sm" onClick={() => setAddOpen(true)}>+ Set budget</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 animate-pulse rounded-xl bg-white/5" />)}
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-500">
          No budgets set. Click &ldquo;Set budget&rdquo; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(b => (
            <BudgetCard key={b.id} budget={b} currency={currency} />
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Set Budget">
        <BudgetForm categories={categories} onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>
    </div>
  )
}
