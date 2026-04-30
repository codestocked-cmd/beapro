'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Target, Dumbbell, Activity, Clock, Settings2, Crosshair } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/scout', icon: Target, label: 'Scout' },
  { href: '/training', icon: Dumbbell, label: 'Training' },
  { href: '/whoop', icon: Activity, label: 'Whoop' },
  { href: '/history', icon: Clock, label: 'History' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 bg-[var(--color-bg-surface)] border-r border-[var(--color-border)] shrink-0">
      <div className="px-6 py-5 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Crosshair className="w-6 h-6 text-[var(--color-brand)]" />
          <span className="font-display font-bold text-xl text-[var(--color-text-primary)] tracking-wide">BE A PRO</span>
        </div>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 uppercase tracking-widest">Intelligence for Grappling</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-[var(--color-brand-glow)] text-[var(--color-brand)] border border-[var(--color-border-brand)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--color-border)]">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 ${
            pathname.startsWith('/settings')
              ? 'bg-[var(--color-brand-glow)] text-[var(--color-brand)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
