import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDashboardData } from '@/lib/data/dashboard'
import { getDateRange } from '@/lib/utils/dates'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url   = new URL(request.url)
  const start = url.searchParams.get('start')
  const end   = url.searchParams.get('end')

  const { start: defStart, end: defEnd } = getDateRange('this_month')
  const data = await getDashboardData(start ?? defStart, end ?? defEnd)

  return NextResponse.json(data)
}
