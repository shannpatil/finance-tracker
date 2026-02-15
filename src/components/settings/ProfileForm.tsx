'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { CURRENCIES } from '@/lib/constants'
import type { Profile } from '@/types'

const CURRENCY_OPTIONS = CURRENCIES.map(c => ({ value: c.code, label: c.label }))

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [currency, setCurrency] = useState(profile.currency)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ currency }).eq('id', profile.id)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-gray-400 mb-1">Email</p>
        <p className="text-white">{profile.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <Select
          label="Default currency"
          options={CURRENCY_OPTIONS}
          value={currency}
          onChange={e => setCurrency(e.target.value)}
        />
        <Button type="submit" loading={loading} size="sm">
          {saved ? 'Saved!' : 'Save changes'}
        </Button>
      </form>

      <div className="pt-4 border-t border-white/10">
        <Button variant="danger" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  )
}
