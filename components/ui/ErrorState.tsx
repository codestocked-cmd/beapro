import { AlertCircle } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <AlertCircle className="w-8 h-8 text-[var(--color-danger)]" />
      <p className="text-[var(--color-text-secondary)] text-sm text-center max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>Try again</Button>
      )}
    </div>
  )
}
