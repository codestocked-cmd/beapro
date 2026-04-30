import { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'brand' | 'default'
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const base = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium'

  const variants = {
    success: 'bg-[rgba(58,255,160,0.1)] text-[var(--color-success)] border border-[rgba(58,255,160,0.2)]',
    warning: 'bg-[rgba(255,184,48,0.1)] text-[var(--color-warning)] border border-[rgba(255,184,48,0.2)]',
    danger: 'bg-[rgba(255,77,77,0.1)] text-[var(--color-danger)] border border-[rgba(255,77,77,0.2)]',
    brand: 'bg-[var(--color-brand-glow)] text-[var(--color-brand)] border border-[var(--color-border-brand)]',
    default: 'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
  }

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
