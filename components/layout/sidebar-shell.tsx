'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SidebarNav } from '@/components/layout/sidebar-nav'
import {
  SIDEBAR_COLLAPSED,
  SIDEBAR_COOKIE,
  SIDEBAR_EXPANDED,
} from '@/components/layout/sidebar-state'
import type { NavGroup } from '@/components/layout/nav-config'

interface SidebarShellProps {
  groups: NavGroup[]
  accountGroups: NavGroup[]
  defaultCollapsed: boolean
}

// Desktop: mode ikon di `md`; di `lg` penuh, dan bisa diciutkan menjadi mode ikon.
export function SidebarShell({ groups, accountGroups, defaultCollapsed }: SidebarShellProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  function toggle() {
    const next = !collapsed
    setCollapsed(next)
    const value = next ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED
    document.cookie = `${SIDEBAR_COOKIE}=${value}; path=/dashboard; max-age=31536000; samesite=lax`
  }

  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose
  const toggleLabel = collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'

  return (
    <aside
      className={cn(
        'hidden border-r border-white/10 bg-sidebar/70 text-sidebar-foreground backdrop-blur-md md:sticky md:top-0 md:flex md:h-screen md:w-16 md:shrink-0 md:flex-col dark:bg-sidebar/60',
        'transition-[width] duration-200 motion-reduce:transition-none',
        !collapsed && 'lg:w-64',
      )}
    >
      <Link
        href="/dashboard"
        aria-label="LIM Platform — Ringkasan"
        className={cn(
          'flex h-16 shrink-0 items-center justify-center gap-3 border-b border-white/10 px-4 outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50',
          !collapsed && 'lg:justify-start',
        )}
      >
        <Image src="/logo_lim.svg" alt="" width={28} height={31} unoptimized className="shrink-0" />
        <span
          className={cn('hidden text-sm font-semibold tracking-tight', !collapsed && 'lg:inline')}
        >
          LIM Platform
        </span>
      </Link>

      <div className="flex-1 overflow-y-auto p-2 lg:p-3">
        <SidebarNav groups={groups} variant="rail" label="Menu dashboard" collapsed={collapsed} />
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 p-2 lg:p-3">
        {accountGroups.length > 0 && (
          <SidebarNav groups={accountGroups} variant="rail" label="Menu akun" collapsed={collapsed} />
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggle}
          aria-label={toggleLabel}
          aria-expanded={!collapsed}
          title={toggleLabel}
          className={cn('hidden min-h-10 justify-center lg:inline-flex', !collapsed && 'lg:justify-start lg:px-3')}
        >
          <ToggleIcon aria-hidden className="size-5" />
          <span className={cn(collapsed && 'sr-only')}>Ciutkan</span>
        </Button>
      </div>
    </aside>
  )
}
