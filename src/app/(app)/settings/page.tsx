import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/data/categories'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { ProfileForm } from '@/components/settings/ProfileForm'
import { CategoryManager } from '@/components/settings/CategoryManager'
import type { Profile } from '@/types'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: Profile = { id: user?.id ?? '', email: user?.email ?? '', currency: 'USD', created_at: '' }

  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) profile = data as Profile
  }

  const categories = await getCategories()

  return (
    <div>
      <TopBar title="Settings" />

      <div className="flex flex-col gap-6 max-w-2xl">
        <Card>
          <h2 className="text-sm font-medium text-gray-400 mb-4">Profile</h2>
          <ProfileForm profile={profile} />
        </Card>

        <Card>
          <h2 className="text-sm font-medium text-gray-400 mb-4">Categories</h2>
          <CategoryManager categories={categories} />
        </Card>
      </div>
    </div>
  )
}
