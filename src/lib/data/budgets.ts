import { createClient } from '@/lib/supabase/server'
import type { Budget, BudgetWithSpend } from '@/types'

export async function getBudgets(month: number, year: number): Promise<BudgetWithSpend[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: budgets } = await supabase
    .from('budgets')
    .select('*, categories(id, name, color)')
    .eq('user_id', user.id)
    .eq('month', month)
    .eq('year', year)

  if (!budgets?.length) return []

  // Fetch spend for each budget's category
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate   = `${year}-${String(month).padStart(2, '0')}-31`

  const { data: txns } = await supabase
    .from('transactions')
    .select('category_id, amount')
    .eq('user_id', user.id)
    .eq('type', 'expense')
    .gte('date', startDate)
    .lte('date', endDate)

  const spendByCategory: Record<string, number> = {}
  for (const t of txns ?? []) {
    if (!t.category_id) continue
    spendByCategory[t.category_id] = (spendByCategory[t.category_id] ?? 0) + t.amount
  }

  return (budgets as Budget[]).map(b => {
    const spent = Math.round((spendByCategory[b.category_id] ?? 0) * 100) / 100
    const percentage = Math.round((spent / b.monthly_limit) * 100)
    return { ...b, spent, percentage }
  })
}
