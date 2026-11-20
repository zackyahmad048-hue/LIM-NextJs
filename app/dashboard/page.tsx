// app/dashboard/page.tsx
import { FileText, Users, Building2, AlertCircle } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { ModuleCard, type ModuleCardProps } from '@/components/dashboard/module-card'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/auth'
import { canAccessModule } from '@/modules/authentication/domain/permissions'
import type { Role } from '@/generated/client'

// Rute harus menunjuk halaman yang benar-benar ada (lihat components/layout/nav-config.ts).
const moduleCards: (ModuleCardProps & { module: string })[] = [
  {
    module: 'persuratan',
    title: 'Persuratan',
    description: 'Administrasi & tata kelola surat',
    status: { label: 'Aktif', tone: 'success' },
    stats: [
      { label: 'Keluar', value: '98' },
      { label: 'Masuk', value: '44' },
      { label: 'Pending', value: '3' },
    ],
    progress: [
      { color: 'bg-primary', width: '22%' },
      { color: 'bg-info', width: '18%' },
      { color: 'bg-warning', width: '12%' },
      { color: 'bg-muted', width: '48%' },
    ],
    href: '/dashboard/letters',
    delay: 0,
  },
  {
    module: 'wajib-khidmah',
    title: 'Wajib Khidmah',
    description: 'Penugasan & laporan guru bantu',
    status: { label: '7 Perlu Evaluasi', tone: 'error' },
    stats: [
      { label: 'Aktif', value: '312' },
      { label: 'Laporan', value: '89%' },
      { label: 'Kasus', value: '7' },
    ],
    progress: [
      { color: 'bg-success', width: '30%' },
      { color: 'bg-warning', width: '10%' },
      { color: 'bg-destructive', width: '8%' },
      { color: 'bg-muted', width: '52%' },
    ],
    href: '/dashboard/wajib-khidmah/penugasan',
    delay: 0.05,
  },
  {
    module: 'safari',
    title: 'Safari Ramadan',
    description: 'Titik, delegasi & jurnal harian',
    status: { label: 'Persiapan', tone: 'info' },
    stats: [
      { label: 'Titik', value: '120' },
      { label: 'Delegasi', value: '480' },
      { label: 'PW', value: '34' },
    ],
    progress: [
      { color: 'bg-info', width: '25%' },
      { color: 'bg-primary', width: '15%' },
      { color: 'bg-muted', width: '60%' },
    ],
    href: '/dashboard/safari/titik',
    delay: 0.1,
  },
  {
    module: 'falak',
    title: 'Digital Falak',
    description: 'Jadwal shalat & awal bulan',
    status: { label: 'Terawat', tone: 'success' },
    stats: [
      { label: 'Jadwal', value: 'Harian' },
      { label: 'Override', value: '2' },
      { label: 'Bulan', value: '1448 H' },
    ],
    progress: [
      { color: 'bg-success', width: '40%' },
      { color: 'bg-primary', width: '20%' },
      { color: 'bg-muted', width: '40%' },
    ],
    href: '/dashboard/falak/konfigurasi',
    delay: 0.15,
  },
]

export default async function DashboardPage() {
  const session = await getSession()
  const role = session?.user.role as Role | undefined
  const isOwner = role === 'OWNER'
  const visibleModules = role ? moduleCards.filter((item) => canAccessModule(role, item.module)) : []

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {isOwner ? 'Konsol Pengurus Pusat' : 'Ringkasan'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isOwner
              ? '14 pengurus aktif · 9 sedang bertugas hari ini'
              : `Masuk sebagai ${session?.user.email ?? '-'}`}
          </p>
        </div>
        {isOwner && (
          <div className="flex gap-3">
            <Button variant="outline">Hak Akses</Button>
            <Button>Tambah Pengurus</Button>
          </div>
        )}
      </div>

      {/* Ringkasan KPI (khusus pusat) */}
      {isOwner && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Surat Bulan Ini" value="142" trend={{ value: '12%', isPositive: true }} icon={<FileText className="h-6 w-6" />} />
          <StatCard title="Guru Bantu Aktif" value="1.204" trend={{ value: '3%', isPositive: true }} icon={<Users className="h-6 w-6" />} />
          <StatCard title="Lembaga Mitra" value="85" trend={{ value: '0%', isPositive: true }} icon={<Building2 className="h-6 w-6" />} />
          <StatCard title="Perlu Evaluasi" value="7" trend={{ value: '2 kasus', isPositive: false }} icon={<AlertCircle className="h-6 w-6" />} />
        </div>
      )}

      {/* Grid modul — hanya modul yang boleh diakses role ini */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Modul Operasional</h2>
        {visibleModules.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada modul yang tersedia untuk role Anda.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleModules.map((card) => (
              <ModuleCard key={card.href} {...card} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
