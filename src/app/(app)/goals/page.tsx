'use client'

import { useState, useEffect } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalForm } from '@/components/goals/GoalForm'
import type { SavingsGoal, GoalFormData } from '@/types'

export default function GoalsPage() {
  const [goals, setGoals]       = useState<SavingsGoal[]>([])
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading]   = useState(true)
  const [addOpen, setAddOpen]   = useState(false)

  async function load() {
    setLoading(true)
    const [gRes, pRes] = await Promise.all([
      fetch('/api/goals'),
      fetch('/api/profile'),
    ])
    if (gRes.ok) setGoals(await gRes.json())
    if (pRes.ok) setCurrency((await pRes.json()).currency ?? 'USD')
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(data: GoalFormData) {
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create goal')
    setAddOpen(false)
    load()
  }

  return (
    <div>
      <TopBar title="Savings Goals" />

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{goals.length} active goal{goals.length !== 1 ? 's' : ''}</p>
        <Button size="sm" onClick={() => setAddOpen(true)}>+ New goal</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 animate-pulse rounded-xl bg-white/5" />)}
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-500">
          No goals yet. Click &ldquo;New goal&rdquo; to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(g => (
            <GoalCard key={g.id} goal={g} currency={currency} />
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New Savings Goal">
        <GoalForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
      </Modal>
    </div>
  )
}
