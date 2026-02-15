'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { CSVImport } from '@/components/transactions/CSVImport'
import { useTimeFilter } from '@/hooks/useTimeFilter'
import type { Category, Transaction, TransactionFormData } from '@/types'

export default function TransactionsPage() {
  const router = useRouter()
  const { dateRange } = useTimeFilter()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories]     = useState<Category[]>([])
  const [currency, setCurrency]         = useState('USD')
  const [loading, setLoading]           = useState(true)
  const [addOpen, setAddOpen]           = useState(false)
  const [importOpen, setImportOpen]     = useState(false)
  const [filters, setFilters]           = useState({ categoryId: '', type: '' })

  async function load() {
    setLoading(true)
    const params = new URLSearchParams({
      start: dateRange.start,
      end:   dateRange.end,
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.type       && { type:       filters.type }),
    })
    const [txRes, catRes, profRes] = await Promise.all([
      fetch(`/api/transactions?${params}`),
      fetch('/api/categories'),
      fetch('/api/profile'),
    ])
    if (txRes.ok)   setTransactions(await txRes.json())
    if (catRes.ok)  setCategories(await catRes.json())
    if (profRes.ok) setCurrency((await profRes.json()).currency ?? 'USD')
    setLoading(false)
  }

  useEffect(() => { load() }, [dateRange.start, dateRange.end, filters.categoryId, filters.type])

  async function handleAdd(data: TransactionFormData) {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to add transaction')
    setAddOpen(false)
    router.refresh()
    load()
  }

  function handleExport() {
    window.location.href = `/api/export?start=${dateRange.start}&end=${dateRange.end}`
  }

  return (
    <div>
      <TopBar title="Transactions" />

      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <TransactionFilters
          categories={categories}
          filters={filters}
          onChange={setFilters}
        />
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setImportOpen(true)}>
            Import CSV
          </Button>
          <Button size="sm" variant="secondary" onClick={handleExport}>
            Export
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            + Add
          </Button>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-10 animate-pulse rounded bg-white/5" />)}
          </div>
        ) : (
          <TransactionTable
            transactions={transactions}
            categories={categories}
            currency={currency}
          />
        )}
      </Card>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Transaction">
        <TransactionForm
          categories={categories}
          onSubmit={handleAdd}
          onCancel={() => setAddOpen(false)}
        />
      </Modal>

      <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Import CSV" maxWidth="lg">
        <CSVImport categories={categories} onClose={() => setImportOpen(false)} />
      </Modal>
    </div>
  )
}
