// modules/authentication/domain/permissions.ts
import type { Role, AccountType } from '@/generated/client'

export const PUSAT_ROLES: Role[] = [
  'OWNER', 'ADMIN_SEKRETARIAT', 'TIM_WAJIB_KHIDMAH', 'CONTENT_MANAGER',
  'ADMIN_BIDANG_SAFARI', 'ADMIN_BIDANG_PESANTREN_RAMADAN',
]

export const ORGANIZATIONAL_ROLES: Role[] = ['PW', 'PC', 'PONDOK_INTERNAL', 'LEMBAGA_EKSTERNAL']

export function isPusatRole(role: Role): boolean {
  return PUSAT_ROLES.includes(role)
}

export function isOrganizationalAccount(role: Role, accountType?: AccountType): boolean {
  if (accountType) return accountType === 'ORGANIZATIONAL'
  return ORGANIZATIONAL_ROLES.includes(role)
}

export function canAccessModule(role: Role, module: string): boolean {
  const matrix: Record<string, Role[]> = {
    'wajib-khidmah': ['OWNER', 'TIM_WAJIB_KHIDMAH', 'PW', 'PC', 'GURU_BANTU', 'LEMBAGA_EKSTERNAL'],
    'persuratan': ['OWNER', 'ADMIN_SEKRETARIAT', 'ADMIN_BIDANG_SAFARI', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC'],
    'safari': ['OWNER', 'ADMIN_BIDANG_SAFARI', 'PW', 'PC', 'PANITIA_SAFARI_DAERAH', 'DELEGASI_SAFARI_DAERAH'],
    'pesantren-ramadan': ['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC', 'PENGAJAR_PESANTREN_RAMADAN'],
    'cms': ['OWNER', 'CONTENT_MANAGER'],
    'dakwah-digital': ['OWNER', 'CONTENT_MANAGER', 'PW', 'PC'],
    'daerah-binaan': ['OWNER', 'PW', 'PC'],
    'falak': ['OWNER', 'ADMIN_SEKRETARIAT', 'PW', 'PC', 'GURU_BANTU', 'LEMBAGA_EKSTERNAL', 'PONDOK_INTERNAL'],
    'kepengurusan': ['OWNER', 'ADMIN_SEKRETARIAT', 'PW', 'PC'],
    'pengguna': ['OWNER'],
  }
  const allowed = matrix[module]
  if (!allowed) return false
  return allowed.includes(role)
}

export type DataScope = 'GLOBAL' | 'ORGANIZATIONAL' | 'PERSONAL'

// Cakupan data yang tampil di UI (🌍 / 🏢 / 👤 pada docs/backend/06.RBAC.md).
// Hanya penanda tampilan — penegakan scope tetap di query dan Server Action.
export function getDataScope(role: Role, accountType?: AccountType): DataScope {
  if (isPusatRole(role)) return 'GLOBAL'
  if (isOrganizationalAccount(role, accountType)) return 'ORGANIZATIONAL'
  return 'PERSONAL'
}