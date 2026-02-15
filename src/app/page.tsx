'use client'

import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'
import { OAuthButton } from '@/components/auth/OAuthButton'

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#0f0f0f]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Finance<span className="text-indigo-400">.</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Your personal money tracker</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-[#1a1a1a] border border-white/10 p-6">
          {/* Tabs */}
          <div className="flex rounded-lg bg-white/5 p-0.5 gap-0.5 mb-6">
            {(['login', 'signup'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  tab === t ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {tab === 'login' ? <LoginForm /> : <SignupForm />}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <OAuthButton />
        </div>
      </div>
    </div>
  )
}
