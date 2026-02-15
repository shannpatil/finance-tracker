import type { TimeFilter, DateRange } from '@/types'

export function getDateRange(filter: TimeFilter, custom?: DateRange): DateRange {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 1-indexed

  if (filter === 'this_month') {
    const start = `${year}-${String(month).padStart(2, '0')}-01`
    const end = getLastDayOfMonth(year, month)
    return { start, end }
  }

  if (filter === 'this_year') {
    return {
      start: `${year}-01-01`,
      end: `${year}-12-31`,
    }
  }

  // custom
  if (custom) return custom

  // fallback to current month
  return {
    start: `${year}-${String(month).padStart(2, '0')}-01`,
    end: getLastDayOfMonth(year, month),
  }
}

function getLastDayOfMonth(year: number, month: number): string {
  const lastDay = new Date(year, month, 0).getDate()
  return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatMonth(monthStr: string): string {
  // monthStr = "YYYY-MM"
  const [year, month] = monthStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

export function daysUntil(targetDate: string): number {
  const target = new Date(targetDate + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
