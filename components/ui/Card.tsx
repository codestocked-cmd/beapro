import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'brand' | 'interactive'
}

export function Card({ variant = 'default', className = '', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-[var(--shadow-md)]',
    brand: 'bg-[var(--color-bg-surface)] border border-[var(--color-border-brand)] shadow-brand',
    interactive: 'bg-[var(--color-bg-surface)] border border-[var(--color-border)] cursor-pointer hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-elevated)] transition-all duration-150 shadow-[var(--shadow-md)]',
  }

  return (
    <div className={`rounded-xl p-6 ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}
