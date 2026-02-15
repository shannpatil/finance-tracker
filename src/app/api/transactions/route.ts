import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkAndSendBudgetAlerts } from '@/lib/email/alerts'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url  = new URL(request.url)
  const start      = url.searchParams.get('start')
  const end        = url.searchParams.get('end')
  const categoryId = url.searchParams.get('categoryId')
  const type       = url.searchParams.get('type')

  let query = supabase
    .from('transactions')
    .select('*, categories(id, name, color)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (start) query = query.gte('date', start)
  if (end)   query = query.lte('date', end)
  if (categoryId) query = query.eq('category_id', categoryId)
  if (type)  query = query.eq('type', type)

  const { data } = await query
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    amount,
    type,
    category_id,
    date,
    note,
    is_recurring = false,
    recurrence_frequency = null,
  } = body

  if (!amount || !type || !date) {
    return NextResponse.json({ error: 'amount, type, and date are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      amount: parseFloat(amount),
      type,
      category_id: category_id || null,
      date,
      note: note || null,
      is_recurring,
      recurrence_frequency: is_recurring ? recurrence_frequency : null,
    })
    .select('*, categories(id, name, color)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Trigger budget alert check (fire and forget — don't block response)
  if (category_id && type === 'expense') {
    const txDate = new Date(date)
    checkAndSendBudgetAlerts(
      user.id,
      category_id,
      txDate.getMonth() + 1,
      txDate.getFullYear()
    ).catch(() => {/* alert errors are non-fatal */})
  }

  return NextResponse.json(data, { status: 201 })
}
