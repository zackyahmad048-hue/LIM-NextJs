import Link from 'next/link'
import { canAccessModule } from '@/modules/authentication/domain/permissions'
import type { Role } from '@/generated/client'

// Menu dibangun dari izin role (helper permissions), bukan if role === ... tersebar
const items: { href: string; label: string; module?: string; always?: boolean }[] = [
  { href: '/dashboard', label: 'Ringkasan', always: true },
  { href: '/dashboard/letters', label: 'Persuratan', module: 'persuratan' },
  { href: '/dashboard/wajib-khidmah/penugasan', label: 'Wajib Khidmah', module: 'wajib-khidmah' },
  { href: '/dashboard/safari/titik', label: 'Safari Ramadan', module: 'safari' },
  { href: '/dashboard/pesantren/sekolah-mitra', label: 'Pesantren Ramadan', module: 'pesantren-ramadan' },
  { href: '/dashboard/cms/artikel', label: 'CMS', module: 'cms' },
  { href: '/dashboard/dakwah/konten', label: 'Dakwah Digital', module: 'dakwah-digital' },
  { href: '/dashboard/daerah-binaan', label: 'Daerah Binaan', module: 'daerah-binaan' },
  { href: '/dashboard/falak/konfigurasi', label: 'Falak', module: 'falak' },
]

export function Sidebar({ role }: { role: Role }) {
  return (
    <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col md:gap-1 md:border-r md:bg-sidebar md:p-4 lg:w-64">
      <p className="mb-4 px-2 text-sm font-semibold">LIM Platform</p>
      <nav className="flex flex-col gap-1" aria-label="Menu dashboard">
        {items.map((item) => {
          if (!item.always && !(item.module && canAccessModule(role, item.module))) return null
          return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <Link href="/dashboard/security/mfa" className="mt-auto rounded-md px-2 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent">
        Keamanan (MFA)
      </Link>
    </aside>
  )
}
