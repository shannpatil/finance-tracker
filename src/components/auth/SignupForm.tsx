'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { CURRENCIES } from '@/lib/constants'

const CURRENCY_OPTIONS = CURRENCIES.map(c => ({ value: c.code, label: c.label }))

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    // Sign up
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Save currency preference to profile
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ currency }).eq('id', user.id)
    }

    // If email confirmation is disabled in Supabase, redirect immediately
    const { data: session } = await supabase.auth.getSession()
    if (session.session) {
      router.push('/dashboard')
      router.refresh()
    } else {
      setDone(true)
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center text-sm text-gray-300 py-4">
        Check your email to confirm your account, then sign in.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="8+ characters"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <Select
        label="Currency"
        value={currency}
        onChange={e => setCurrency(e.target.value)}
        options={CURRENCY_OPTIONS}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" loading={loading} className="w-full mt-1">
        Create account
      </Button>
    </form>
  )
}
