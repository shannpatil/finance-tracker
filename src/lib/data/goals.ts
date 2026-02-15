import { createClient } from '@/lib/supabase/server'
import type { SavingsGoal } from '@/types'

export async function getGoals(): Promise<SavingsGoal[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (data as SavingsGoal[]) ?? []
}
