// app/dashboard/page.tsx
import { ModuleCard } from '@/components/dashboard/module-card'
import { getSession } from '@/lib/auth'
import { canAccessModule } from '@/modules/authentication/domain/permissions'
import type { Role } from '@/generated/client'

// Membaca sesi tiap request; navigasi boleh menunggu (Cache Components tidak bisa mem-prerender).
export const instant = false

// Rute harus menunjuk halaman yang benar-benar ada (lihat components/layout/nav-config.ts).
const moduleCards = [
  {
    module: 'persuratan',
    title: 'Persuratan',
    description: 'Administrasi & tata kelola surat',
    href: '/dashboard/letters',
  },
  {
    module: 'wajib-khidmah',
    title: 'Wajib Khidmah',
    description: 'Penugasan & laporan guru bantu',
    href: '/dashboard/wajib-khidmah/penugasan',
  },
  {
    module: 'safari',
    title: 'Safari Ramadan',
    description: 'Titik, delegasi & jurnal harian',
    href: '/dashboard/safari/titik',
  },
  {
    module: 'falak',
    title: 'Digital Falak',
    description: 'Jadwal shalat & awal bulan',
    href: '/dashboard/falak/konfigurasi',
  },
]

export default async function DashboardPage() {
  const session = await getSession()
  const role = session?.user.role as Role | undefined
  const isOwner = role === 'OWNER'
  const visibleModules = role ? moduleCards.filter((item) => canAccessModule(role, item.module)) : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {isOwner ? 'Konsol Pusat' : 'Ringkasan'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Masuk sebagai {session?.user.email ?? '-'}
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Modul</h2>
        {visibleModules.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada modul yang tersedia untuk role Anda.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleModules.map((card) => (
              <ModuleCard key={card.href} title={card.title} description={card.description} href={card.href} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
