'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { CATEGORY_COLORS } from '@/lib/constants'
import type { Category } from '@/types'

interface CategoryManagerProps {
  categories: Category[]
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const customCategories = categories.filter(c => !c.is_default)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Name is required'); return }

    setLoading(true)
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), color }),
    })
    if (!res.ok) {
      setError('Failed to create category')
    } else {
      setName('')
      setColor(CATEGORY_COLORS[0])
      router.refresh()
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Default categories */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Default categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.filter(c => c.is_default).map(c => (
            <Badge key={c.id} label={c.name} color={c.color} />
          ))}
        </div>
      </div>

      {/* Custom categories */}
      {customCategories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">Your categories</h3>
          <div className="flex flex-wrap gap-2">
            {customCategories.map(c => (
              <div key={c.id} className="flex items-center gap-1.5">
                <Badge label={c.name} color={c.color} />
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors"
                  aria-label={`Delete ${c.name}`}
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create form */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Add custom category</h3>
        <form onSubmit={handleCreate} className="flex flex-col gap-3 max-w-sm">
          <Input
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Gym"
          />
          <ColorPicker label="Color" value={color} onChange={setColor} />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" loading={loading} size="sm">Add category</Button>
        </form>
      </div>
    </div>
  )
}
