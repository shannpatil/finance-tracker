import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { toCSV } from '@/lib/utils/csvExport'
import type { Transaction } from '@/types'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url   = new URL(request.url)
  const start = url.searchParams.get('start')
  const end   = url.searchParams.get('end')

  let query = supabase
    .from('transactions')
    .select('*, categories(id, name, color)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (start) query = query.gte('date', start)
  if (end)   query = query.lte('date', end)

  const { data } = await query
  const csv = toCSV((data as Transaction[]) ?? [])

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="transactions-${Date.now()}.csv"`,
    },
  })
}
