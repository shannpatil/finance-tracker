import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number      // 0–100 (can exceed 100)
  color?: string     // hex color for the fill
  className?: string
  showWarning?: boolean  // auto-color at 80% / 100%
}

export function ProgressBar({ value, color, className, showWarning = true }: ProgressBarProps) {
  const clamped = Math.min(value, 100)

  const fillColor = showWarning
    ? value >= 100
      ? '#ef4444'  // red
      : value >= 80
        ? '#eab308'  // yellow
        : color ?? '#6366f1'  // accent
    : color ?? '#6366f1'

  return (
    <div className={clsx('w-full h-2 rounded-full bg-white/10 overflow-hidden', className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, backgroundColor: fillColor }}
      />
    </div>
  )
}
