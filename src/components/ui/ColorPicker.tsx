'use client'

import { CATEGORY_COLORS } from '@/lib/constants'
import { clsx } from 'clsx'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_COLORS.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={clsx(
              'w-7 h-7 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]',
              value === color && 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a]'
            )}
            style={{ backgroundColor: color, ['--tw-ring-color' as string]: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  )
}
