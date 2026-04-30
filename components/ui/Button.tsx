import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className = '', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-md)] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

    const variants = {
      primary: 'bg-[var(--color-brand)] text-[#0A0A0C] hover:opacity-90',
      secondary: 'border border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]',
      ghost: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
      danger: 'bg-[rgba(255,77,77,0.1)] text-[var(--color-danger)] border border-[rgba(255,77,77,0.2)] hover:bg-[rgba(255,77,77,0.2)]',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
