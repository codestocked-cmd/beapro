'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Target, Dumbbell, Activity, Clock } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/scout', icon: Target, label: 'Scout' },
  { href: '/training', icon: Dumbbell, label: 'Train' },
  { href: '/whoop', icon: Activity, label: 'Whoop' },
  { href: '/history', icon: Clock, label: 'History' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-bg-surface)] border-t border-[var(--color-border)] flex z-40">
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-all duration-150 ${
              active ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
