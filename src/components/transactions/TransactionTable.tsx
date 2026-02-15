'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TransactionForm } from './TransactionForm'
import { formatDate } from '@/lib/utils/dates'
import { formatCurrency } from '@/lib/utils/currency'
import type { Category, Transaction, TransactionFormData } from '@/types'

interface TransactionTableProps {
  transactions: Transaction[]
  categories: Category[]
  currency: string
}

export function TransactionTable({ transactions, categories, currency }: TransactionTableProps) {
  const router = useRouter()
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleEdit(data: TransactionFormData) {
    if (!editing) return
    const res = await fetch(`/api/transactions/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update transaction')
    setEditing(null)
    router.refresh()
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      setDeleting(null)
      return
    }
    router.refresh()
    setDeleting(null)
  }

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        No transactions found. Add one to get started.
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="pb-3 font-medium text-gray-400">Date</th>
              <th className="pb-3 font-medium text-gray-400">Note</th>
              <th className="pb-3 font-medium text-gray-400">Category</th>
              <th className="pb-3 font-medium text-gray-400 text-right">Amount</th>
              <th className="pb-3 font-medium text-gray-400 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map(t => (
              <tr key={t.id} className="group">
                <td className="py-3 text-gray-400 whitespace-nowrap pr-4">
                  {formatDate(t.date)}
                </td>
                <td className="py-3 text-white pr-4 max-w-[200px] truncate">
                  {t.note || <span className="text-gray-600 italic">—</span>}
                  {t.is_recurring && (
                    <span className="ml-1.5 text-xs text-indigo-400">↻</span>
                  )}
                </td>
                <td className="py-3 pr-4">
                  {t.categories ? (
                    <Badge label={t.categories.name} color={t.categories.color} />
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className={`py-3 text-right font-medium whitespace-nowrap ${
                  t.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditing(t)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Edit"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={deleting === t.id}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                      aria-label="Delete"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Transaction"
      >
        {editing && (
          <TransactionForm
            categories={categories}
            initial={editing}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </>
  )
}
