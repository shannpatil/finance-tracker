import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
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
        {children}
      </div>
    </div>
  )
}
