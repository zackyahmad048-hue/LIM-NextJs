// components/layout/module-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { NavGroup } from '@/components/layout/nav-config'

// Navigasi modul horizontal untuk Konsol Pusat (OWNER).
// Daftar menu berasal dari nav-config (sudah difilter canAccessModule di server).
export function ModuleNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Navigasi modul" className="border-b border-border bg-card/60">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        {groups.flatMap((group) => group.items).map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.match)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition-colors',
                active
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
