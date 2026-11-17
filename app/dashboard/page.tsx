import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { canAccessModule } from '@/modules/authentication/domain/permissions'
import type { Role } from '@/generated/client'

const shortcuts = [
  { href: '/dashboard/letters', label: 'Persuratan', module: 'persuratan' },
  { href: '/dashboard/wajib-khidmah/penugasan', label: 'Wajib Khidmah', module: 'wajib-khidmah' },
  { href: '/dashboard/safari/titik', label: 'Safari Ramadan', module: 'safari' },
  { href: '/dashboard/pesantren/sekolah-mitra', label: 'Pesantren Ramadan', module: 'pesantren-ramadan' },
  { href: '/dashboard/cms/artikel', label: 'CMS', module: 'cms' },
  { href: '/dashboard/dakwah/konten', label: 'Dakwah Digital', module: 'dakwah-digital' },
  { href: '/dashboard/daerah-binaan', label: 'Daerah Binaan', module: 'daerah-binaan' },
  { href: '/dashboard/falak/konfigurasi', label: 'Falak', module: 'falak' },
] as const

export default async function DashboardPage() {
  const session = await getSession()
  const role = session?.user.role as Role | undefined
  return (
    <div className="space-y-6">
      <PageHeader title="Ringkasan" description={`Masuk sebagai ${session?.user.email ?? '-'}`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts
          .filter((s) => role && canAccessModule(role, s.module))
          .map((s) => (
            <Link key={s.href} href={s.href} className="group">
              <Card className="h-full transition-colors group-hover:bg-accent">
                <CardHeader><CardTitle className="text-base">{s.label}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">Buka modul →</CardContent>
              </Card>
            </Link>
          ))}
      </div>
      <Link href="/dashboard/security/mfa" className="underline">Keamanan / MFA</Link>
    </div>
  )
}
