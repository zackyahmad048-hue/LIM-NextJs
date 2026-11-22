// app/dashboard/page.tsx
import { DashboardContent } from '@/components/dashboard/dashboard-content'
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
  const visibleModules = role
    ? moduleCards
        .filter((item) => canAccessModule(role, item.module))
        .map(({ title, description, href }) => ({ title, description, href }))
    : []

  return (
    <DashboardContent
      email={session?.user.email ?? '-'}
      isOwner={isOwner}
      modules={visibleModules}
    />
  )
}
