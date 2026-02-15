import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentMonthYear } from '@/lib/utils/dates'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const { month, year } = getCurrentMonthYear()
  const m = parseInt(url.searchParams.get('month') ?? String(month))
  const y = parseInt(url.searchParams.get('year')  ?? String(year))

  const { data } = await supabase
    .from('budgets')
    .select('*, categories(id, name, color)')
    .eq('user_id', user.id)
    .eq('month', m)
    .eq('year', y)

  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { category_id, monthly_limit, month, year } = await request.json()

  if (!category_id || !monthly_limit) {
    return NextResponse.json({ error: 'category_id and monthly_limit are required' }, { status: 400 })
  }

  // Upsert — replace existing budget for this category/month/year
  const { data, error } = await supabase
    .from('budgets')
    .upsert({
      user_id: user.id,
      category_id,
      monthly_limit: parseFloat(monthly_limit),
      month,
      year,
      alert_sent_80: false,
      alert_sent_100: false,
    }, { onConflict: 'user_id,category_id,month,year' })
    .select('*, categories(id, name, color)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
