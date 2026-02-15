import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, target_amount, target_date } = await request.json()
  if (!name?.trim() || !target_amount) {
    return NextResponse.json({ error: 'name and target_amount are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('savings_goals')
    .insert({
      user_id: user.id,
      name: name.trim(),
      target_amount: parseFloat(target_amount),
      current_amount: 0,
      target_date: target_date || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
