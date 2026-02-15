'use client'

import { useTimeFilter } from '@/hooks/useTimeFilter'
import type { TimeFilter } from '@/types'

const FILTER_OPTIONS: { value: TimeFilter; label: string }[] = [
  { value: 'this_month', label: 'This Month' },
  { value: 'this_year',  label: 'This Year'  },
  { value: 'custom',     label: 'Custom'     },
]

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  const { filter, setFilter, customRange, setCustomRange } = useTimeFilter()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <h1 className="text-xl font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Filter toggle pills */}
        <div className="flex rounded-lg bg-white/5 p-0.5 gap-0.5">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === opt.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom date range inputs */}
        {filter === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customRange?.start ?? ''}
              onChange={e => setCustomRange({ start: e.target.value, end: customRange?.end ?? '' })}
              className="rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
            />
            <span className="text-gray-500 text-xs">–</span>
            <input
              type="date"
              value={customRange?.end ?? ''}
              onChange={e => setCustomRange({ start: customRange?.start ?? '', end: e.target.value })}
              className="rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>
    </div>
  )
}
