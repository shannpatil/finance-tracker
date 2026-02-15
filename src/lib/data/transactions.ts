import { createClient } from '@/lib/supabase/server'
import type { Transaction, TransactionType } from '@/types'

interface TransactionFilters {
  start?: string
  end?: string
  categoryId?: string
  type?: TransactionType
}

export async function getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('transactions')
    .select('*, categories(id, name, color)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters.start) query = query.gte('date', filters.start)
  if (filters.end)   query = query.lte('date', filters.end)
  if (filters.categoryId) query = query.eq('category_id', filters.categoryId)
  if (filters.type)  query = query.eq('type', filters.type)

  const { data } = await query
  return (data as Transaction[]) ?? []
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('transactions')
    .select('*, categories(id, name, color)')
    .eq('id', id)
    .single()
  return data as Transaction | null
}
