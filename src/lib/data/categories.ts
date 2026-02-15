import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/types'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('categories')
    .select('*')
    .or(`user_id.eq.${user.id},user_id.is.null`)
    .order('is_default', { ascending: false })
    .order('name')

  return (data as Category[]) ?? []
}

export async function createCategory(
  name: string,
  color: string
): Promise<Category | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('categories')
    .insert({ user_id: user.id, name, color, is_default: false })
    .select()
    .single()

  return data as Category | null
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('categories').delete().eq('id', id)
}
