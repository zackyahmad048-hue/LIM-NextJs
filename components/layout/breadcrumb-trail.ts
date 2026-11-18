export interface BreadcrumbItem {
  label: string
  /** null = hanya pengelompokan, tidak punya halaman sendiri (tidak ditautkan). */
  href: string | null
}

const segmentLabels: Record<string, string> = {
  letters: 'Persuratan',
  new: 'Buat Baru',
  pengguna: 'Pengguna',
  'wajib-khidmah': 'Wajib Khidmah',
  penugasan: 'Penugasan',
  laporan: 'Laporan',
  'cross-check': 'Cross-check',
  evaluasi: 'Evaluasi',
  safari: 'Safari Ramadan',
  titik: 'Titik Safari',
  delegasi: 'Delegasi',
  jurnal: 'Jurnal',
  sidak: 'Sidak',
  pesantren: 'Pesantren Ramadan',
  'sekolah-mitra': 'Sekolah Mitra',
  'bank-materi': 'Bank Materi',
  'umpan-balik': 'Umpan Balik',
  cms: 'CMS',
  artikel: 'Artikel',
  kategori: 'Kategori',
  dakwah: 'Dakwah Digital',
  konten: 'Konten',
  event: 'Event',
  'daerah-binaan': 'Daerah Binaan',
  falak: 'Falak',
  konfigurasi: 'Konfigurasi',
  security: 'Keamanan',
  mfa: 'MFA',
}

// Segmen yang hanya pengelompok: tidak ada app/dashboard/<segmen>/page.tsx.
const groupOnlySegments = new Set(['wajib-khidmah', 'safari', 'pesantren', 'cms', 'dakwah', 'falak', 'security'])

const dashboardRoot: BreadcrumbItem = { label: 'Dashboard', href: '/dashboard' }

// Segmen tak dikenal (mis. id dinamis seperti /letters/[id]) dianggap halaman detail.
export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  if (segments[0] !== 'dashboard') return []

  const items: BreadcrumbItem[] = [dashboardRoot]
  let href = '/dashboard'
  for (const segment of segments.slice(1)) {
    href = `${href}/${segment}`
    items.push({
      label: segmentLabels[segment] ?? 'Detail',
      href: groupOnlySegments.has(segment) ? null : href,
    })
  }
  return items
}
