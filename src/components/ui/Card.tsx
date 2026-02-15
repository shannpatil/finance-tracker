import { clsx } from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={clsx('rounded-xl bg-[#1a1a1a] border border-white/10 p-5', className)}
      {...props}
    >
      {children}
    </div>
  )
}
