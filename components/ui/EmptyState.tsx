import { LucideIcon } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  cta?: string
  onCtaClick?: () => void
}

export function EmptyState({ icon: Icon, title, description, cta, onCtaClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] flex items-center justify-center">
        <Icon className="w-8 h-8 text-[var(--color-text-muted)]" />
      </div>
      <div className="text-center">
        <p className="text-[var(--color-text-primary)] font-semibold">{title}</p>
        {description && (
          <p className="text-[var(--color-text-muted)] text-sm mt-1">{description}</p>
        )}
      </div>
      {cta && onCtaClick && (
        <Button variant="primary" size="sm" onClick={onCtaClick}>{cta}</Button>
      )}
    </div>
  )
}
