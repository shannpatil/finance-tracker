import { clsx } from 'clsx'

interface BadgeProps {
  label: string
  color?: string  // hex color for the dot
  className?: string
}

export function Badge({ label, color, className }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-gray-300', className)}>
      {color && (
        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      )}
      {label}
    </span>
  )
}
