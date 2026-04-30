'use client'

import { Bell } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function Topbar() {
  const { user } = useAuth()

  return (
    <header className="h-16 bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-all duration-150"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] flex items-center justify-center">
          <span className="text-xs font-bold text-[#0A0A0C]">
            {user?.email?.charAt(0).toUpperCase() ?? 'U'}
          </span>
        </div>
      </div>
    </header>
  )
}
