import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { TimeFilterProvider } from '@/hooks/useTimeFilter'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <TimeFilterProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 pb-24 md:pb-6">
          {children}
        </main>
        <BottomTabBar />
      </div>
    </TimeFilterProvider>
  )
}
