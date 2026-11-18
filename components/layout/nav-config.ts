import { canAccessModule } from '@/modules/authentication/domain/permissions'
import type { Role } from '@/generated/client'

// Kunci ikon berupa string agar hasil resolve bisa dilewatkan dari Server ke Client Component.
// Pemetaan kunci → komponen ikon ada di sidebar-nav.tsx.
export type NavIconKey =
  | 'overview'
  | 'letters'
  | 'wajib-khidmah'
  | 'safari'
  | 'pesantren'
  | 'daerah-binaan'
  | 'cms'
  | 'dakwah'
  | 'falak'
  | 'security'
  | 'users'

interface NavItemDefinition {
  href: string
  label: string
  icon: NavIconKey
  /** Prefix rute untuk menandai item aktif. Default: sama dengan href. */
  match?: string
  /** Aktif hanya bila pathname persis sama (mis. Ringkasan). */
  exact?: boolean
  /** Kunci modul pada canAccessModule. Tanpa module = tampil untuk semua role. */
  module?: string
}

interface NavGroupDefinition {
  label: string
  items: NavItemDefinition[]
}

export interface NavItem {
  href: string
  label: string
  icon: NavIconKey
  match: string
  exact: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

// Single source of truth menu dashboard. Hanya rute yang sudah ada di app/dashboard.
const navDefinition: NavGroupDefinition[] = [
  {
    label: 'Utama',
    items: [{ href: '/dashboard', label: 'Ringkasan', icon: 'overview', exact: true }],
  },
  {
    label: 'Administrasi',
    items: [
      { href: '/dashboard/letters', label: 'Persuratan', icon: 'letters', module: 'persuratan' },
      { href: '/dashboard/pengguna', label: 'Pengguna', icon: 'users', module: 'pengguna' },
    ],
  },
  {
    label: 'Program',
    items: [
      {
        href: '/dashboard/wajib-khidmah/penugasan',
        label: 'Wajib Khidmah',
        icon: 'wajib-khidmah',
        match: '/dashboard/wajib-khidmah',
        module: 'wajib-khidmah',
      },
      {
        href: '/dashboard/safari/titik',
        label: 'Safari Ramadan',
        icon: 'safari',
        match: '/dashboard/safari',
        module: 'safari',
      },
      {
        href: '/dashboard/pesantren/sekolah-mitra',
        label: 'Pesantren Ramadan',
        icon: 'pesantren',
        match: '/dashboard/pesantren',
        module: 'pesantren-ramadan',
      },
      {
        href: '/dashboard/daerah-binaan',
        label: 'Daerah Binaan',
        icon: 'daerah-binaan',
        module: 'daerah-binaan',
      },
    ],
  },
  {
    label: 'Konten & Data',
    items: [
      {
        href: '/dashboard/cms/artikel',
        label: 'CMS',
        icon: 'cms',
        match: '/dashboard/cms',
        module: 'cms',
      },
      {
        href: '/dashboard/dakwah/konten',
        label: 'Dakwah Digital',
        icon: 'dakwah',
        match: '/dashboard/dakwah',
        module: 'dakwah-digital',
      },
      {
        href: '/dashboard/falak/konfigurasi',
        label: 'Falak',
        icon: 'falak',
        match: '/dashboard/falak',
        module: 'falak',
      },
    ],
  },
]

const securityDefinition: NavGroupDefinition = {
  label: 'Akun',
  items: [
    {
      href: '/dashboard/security/mfa',
      label: 'Keamanan (MFA)',
      icon: 'security',
      match: '/dashboard/security',
    },
  ],
}

function resolveGroups(definition: NavGroupDefinition[], role: Role): NavGroup[] {
  return definition
    .map((group) => ({
      label: group.label,
      items: group.items
        .filter((item) => !item.module || canAccessModule(role, item.module))
        .map((item) => ({
          href: item.href,
          label: item.label,
          icon: item.icon,
          match: item.match ?? item.href,
          exact: item.exact ?? false,
        })),
    }))
    // Grup tanpa item yang boleh diakses tidak ditampilkan.
    .filter((group) => group.items.length > 0)
}

// Menu dibangun dari izin role (canAccessModule). Menyembunyikan menu bukan pengamanan —
// Server Action dan proxy.ts tetap memeriksa akses.
export function getNavGroups(role: Role): NavGroup[] {
  return resolveGroups(navDefinition, role)
}

export function getAccountNavGroups(role: Role): NavGroup[] {
  return resolveGroups([securityDefinition], role)
}

// OWNER → "Owner", ADMIN_SEKRETARIAT → "Admin Sekretariat", PW → "PW".
export function formatRoleLabel(role: Role): string {
  return role
    .split('_')
    .map((word) => (word.length <= 2 ? word : word.charAt(0) + word.slice(1).toLowerCase()))
    .join(' ')
}
