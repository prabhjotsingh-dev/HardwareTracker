'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ModeToggle } from '@/components/ModeToggle'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/storage', label: 'Storage Analysis' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header>
      <nav className="border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold no-underline">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              HardwareTracker
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                href={to}
                className={`text-sm font-medium transition-colors ${
                  pathname === to ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
