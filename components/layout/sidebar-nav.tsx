'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpenCheck,
  Compass,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Map,
  MapPinned,
  Megaphone,
  Newspaper,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavGroup, NavIconKey, NavItem } from '@/components/layout/nav-config'

const icons: Record<NavIconKey, LucideIcon> = {
  overview: LayoutDashboard,
  letters: FileText,
  'wajib-khidmah': BookOpenCheck,
  safari: MapPinned,
  pesantren: GraduationCap,
  'daerah-binaan': Map,
  cms: Newspaper,
  dakwah: Megaphone,
  falak: Compass,
  security: ShieldCheck,
  users: Users,
}

interface SidebarNavProps {
  groups: NavGroup[]
  /**
   * rail   — sidebar desktop: hanya ikon di `md`, ikon + label mulai `lg`.
   * drawer — di dalam Sheet mobile: selalu ikon + label, target sentuh lebih besar.
   */
  variant: 'rail' | 'drawer'
  onNavigate?: () => void
  label: string
  /** Hanya untuk variant rail: paksa mode ikon juga di `lg` (sidebar diciutkan pengguna). */
  collapsed?: boolean
}

function isItemActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.match
  return pathname === item.match || pathname.startsWith(`${item.match}/`)
}

export function SidebarNav({ groups, variant, onNavigate, label, collapsed = false }: SidebarNavProps) {
  const pathname = usePathname()
  const isRail = variant === 'rail'

  return (
    <nav aria-label={label} className="flex flex-col gap-4">
      {groups.map((group, index) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p
            className={cn(
              'px-3 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase',
              isRail && (collapsed ? 'hidden' : 'hidden lg:block'),
            )}
          >
            {group.label}
          </p>
          {/* Pemisah pengganti judul grup saat sidebar hanya menampilkan ikon */}
          {isRail && index > 0 && (
            <div
              aria-hidden
              className={cn('mx-2 border-t border-sidebar-border', !collapsed && 'lg:hidden')}
            />
          )}
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => {
              const Icon = icons[item.icon]
              const active = isItemActive(pathname, item)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    title={isRail ? item.label : undefined}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group/nav relative flex items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors',
                      'focus-visible:ring-3 focus-visible:ring-sidebar-ring/50',
                      isRail
                        ? cn('min-h-10 justify-center', !collapsed && 'lg:justify-start')
                        : 'min-h-11',
                      active
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-sidebar-primary"
                      />
                    )}
                    <Icon
                      aria-hidden
                      className={cn('size-5 shrink-0', active && 'text-sidebar-primary')}
                    />
                    <span className={cn(isRail && (collapsed ? 'sr-only' : 'sr-only lg:not-sr-only'))}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
