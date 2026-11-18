import { SidebarShell } from '@/components/layout/sidebar-shell'
import { getAccountNavGroups, getNavGroups } from '@/components/layout/nav-config'
import type { Role } from '@/generated/client'

// Menu dihitung di server dari izin role; keadaan ciut/lebar ditangani SidebarShell (client).
export function Sidebar({ role, defaultCollapsed }: { role: Role; defaultCollapsed: boolean }) {
  return (
    <SidebarShell
      groups={getNavGroups(role)}
      accountGroups={getAccountNavGroups(role)}
      defaultCollapsed={defaultCollapsed}
    />
  )
}
