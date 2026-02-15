import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { amount, note } = await request.json()

  if (!amount || parseFloat(amount) <= 0) {
    return NextResponse.json({ error: 'amount must be positive' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('savings_contributions')
    .insert({
      goal_id: id,
      user_id: user.id,
      amount: parseFloat(amount),
      note: note || null,
      date: new Date().toISOString().slice(0, 10),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
