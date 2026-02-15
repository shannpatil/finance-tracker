import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { transactions } = await request.json()

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return NextResponse.json({ error: 'transactions array is required' }, { status: 400 })
  }

  // Cap at 50 per request
  const batch = transactions.slice(0, 50).map((t: {
    amount: number
    type: string
    category_id: string | null
    date: string
    note: string
    is_recurring: boolean
    recurrence_frequency: null
  }) => ({
    user_id: user.id,
    amount: t.amount,
    type: t.type,
    category_id: t.category_id || null,
    date: t.date,
    note: t.note || null,
    is_recurring: false,
    recurrence_frequency: null,
  }))

  const { error } = await supabase.from('transactions').insert(batch)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inserted: batch.length }, { status: 201 })
}
