'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { parseCSV, type ParsedRow } from '@/lib/utils/csvImport'
import { Button } from '@/components/ui/Button'
import type { Category } from '@/types'

interface CSVImportProps {
  categories: Category[]
  onClose: () => void
}

export function CSVImport({ categories, onClose }: CSVImportProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [errors, setErrors] = useState<{ row: number; message: string }[]>([])
  const [step, setStep] = useState<'upload' | 'preview' | 'done'>('upload')
  const [loading, setLoading] = useState(false)
  const [importErrors, setImportErrors] = useState('')

  async function handleFile(file: File) {
    const result = await parseCSV(file)
    setRows(result.valid)
    setErrors(result.errors)
    setStep('preview')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function handleConfirm() {
    if (rows.length === 0) return
    setLoading(true)
    setImportErrors('')

    // Match category names to IDs
    const catByName = Object.fromEntries(categories.map(c => [c.name.toLowerCase(), c.id]))

    const toPost = rows.map(r => ({
      ...r,
      category_id: catByName[r.categoryName.toLowerCase()] ?? null,
    }))

    // Chunk into batches of 50
    const CHUNK = 50
    for (let i = 0; i < toPost.length; i += CHUNK) {
      const chunk = toPost.slice(i, i + CHUNK)
      const res = await fetch('/api/transactions/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: chunk }),
      })
      if (!res.ok) {
        setImportErrors(`Batch ${Math.floor(i / CHUNK) + 1} failed`)
        setLoading(false)
        return
      }
    }

    setStep('done')
    setLoading(false)
    router.refresh()
    setTimeout(onClose, 1500)
  }

  if (step === 'done') {
    return (
      <div className="text-center py-6">
        <div className="text-green-400 text-2xl mb-2">✓</div>
        <p className="text-sm text-gray-300">{rows.length} transactions imported!</p>
      </div>
    )
  }

  if (step === 'preview') {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-sm text-gray-400">
          {rows.length} valid rows, {errors.length} errors
        </div>

        {errors.length > 0 && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 max-h-24 overflow-y-auto">
            {errors.slice(0, 10).map(e => (
              <p key={e.row} className="text-xs text-red-400">Row {e.row}: {e.message}</p>
            ))}
          </div>
        )}

        <div className="overflow-x-auto max-h-48 rounded-lg border border-white/10">
          <table className="w-full text-xs">
            <thead className="bg-white/5">
              <tr>
                <th className="px-3 py-2 text-left text-gray-400">Date</th>
                <th className="px-3 py-2 text-left text-gray-400">Amount</th>
                <th className="px-3 py-2 text-left text-gray-400">Type</th>
                <th className="px-3 py-2 text-left text-gray-400">Category</th>
                <th className="px-3 py-2 text-left text-gray-400">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.slice(0, 20).map((r, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-gray-300">{r.date}</td>
                  <td className={`px-3 py-2 font-medium ${r.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {r.amount.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-gray-300">{r.type}</td>
                  <td className="px-3 py-2 text-gray-300">{r.categoryName}</td>
                  <td className="px-3 py-2 text-gray-500 max-w-[150px] truncate">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 20 && (
            <p className="text-center text-xs text-gray-500 py-2">
              …and {rows.length - 20} more rows
            </p>
          )}
        </div>

        {importErrors && <p className="text-sm text-red-400">{importErrors}</p>}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setStep('upload')} className="flex-1">
            Back
          </Button>
          <Button onClick={handleConfirm} loading={loading} disabled={rows.length === 0} className="flex-1">
            Import {rows.length} rows
          </Button>
        </div>
      </div>
    )
  }

  // Upload step
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-400">
        Upload a CSV with columns: <code className="text-gray-300 bg-white/10 px-1 rounded">date</code>,{' '}
        <code className="text-gray-300 bg-white/10 px-1 rounded">amount</code>,{' '}
        <code className="text-gray-300 bg-white/10 px-1 rounded">type</code> (income/expense),{' '}
        <code className="text-gray-300 bg-white/10 px-1 rounded">category</code>,{' '}
        <code className="text-gray-300 bg-white/10 px-1 rounded">note</code>
      </p>

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-colors"
      >
        <svg className="h-8 w-8 mx-auto mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm text-gray-400">Drop your CSV here or <span className="text-indigo-400">browse</span></p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
    </div>
  )
}
