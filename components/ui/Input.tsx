import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text-secondary)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            bg-[var(--color-bg-subtle)] border rounded-[var(--radius-md)] px-4 py-2.5
            text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
            focus:outline-none transition-all duration-150 w-full
            ${error
              ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:shadow-[0_0_0_3px_rgba(255,77,77,0.15)]'
              : 'border-[var(--color-border)] focus:border-[var(--color-brand)] focus:shadow-[0_0_0_3px_var(--color-brand-glow)]'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-[var(--color-danger)]">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
