import type { Role } from '@/generated/client'
import type { ModuleMatrix, PermissionAction, Scope } from './permissions'

const ALL_LETTER_ACTIONS: PermissionAction[] = ['read', 'create', 'update', 'delete', 'review', 'approve', 'send']

export const letterMatrix: ModuleMatrix = {
  'letters:manage': {
    roles: ['OWNER', 'ADMIN_SEKRETARIAT'],
    scope: 'global',
    actions: ALL_LETTER_ACTIONS,
  },
  'letters:bidang': {
    roles: ['ADMIN_BIDANG_SAFARI', 'ADMIN_BIDANG_PESANTREN_RAMADAN'],
    scope: 'global',
    actions: ['read', 'create'],
  },
  'letters:wilayah': {
    roles: ['PW', 'PC'],
    scope: 'pw', // resolved per role at check time
    actions: ['read', 'create', 'update'],
  },
}

export function getLetterScopeForRole(role: Role): Scope | null {
  if (role === 'OWNER' || role === 'ADMIN_SEKRETARIAT' || role === 'ADMIN_BIDANG_SAFARI' || role === 'ADMIN_BIDANG_PESANTREN_RAMADAN') return 'global'
  if (role === 'PW') return 'pw'
  if (role === 'PC') return 'pc'
  return null
}

export function getLetterActionsForRole(role: Role): PermissionAction[] {
  if (role === 'OWNER' || role === 'ADMIN_SEKRETARIAT') return ALL_LETTER_ACTIONS
  if (role === 'ADMIN_BIDANG_SAFARI' || role === 'ADMIN_BIDANG_PESANTREN_RAMADAN') return ['read', 'create']
  if (role === 'PW' || role === 'PC') return ['read', 'create', 'update']
  return []
}

export const publicMatrix: ModuleMatrix = {
  'verification:read': {
    roles: [] as Role[],
    scope: 'global',
    actions: ['read'],
  },
}

export type XLimAuth = {
  public?: boolean
  roles?: Role[]
  scope?: Scope
  permissions?: string[]
}

// --- Wajib Khidmah ---
export const wajibKhidmahMatrix: ModuleMatrix = {
  'wk:manage': {
    roles: ['OWNER', 'TIM_WAJIB_KHIDMAH'],
    scope: 'global',
    actions: ['read', 'create', 'update', 'delete', 'review', 'approve'],
  },
  'wk:wilayah': {
    roles: ['PW', 'PC'],
    scope: 'pw',
    actions: ['read', 'update', 'review'],
  },
  'wk:personal': {
    roles: ['GURU_BANTU', 'LEMBAGA_EKSTERNAL'],
    scope: 'self',
    actions: ['read', 'create', 'update'],
  },
}

export function getWkActionsForRole(role: Role): PermissionAction[] {
  if (role === 'OWNER' || role === 'TIM_WAJIB_KHIDMAH') return ['read', 'create', 'update', 'delete', 'review', 'approve']
  if (role === 'PW' || role === 'PC') return ['read', 'update', 'review']
  if (role === 'GURU_BANTU' || role === 'LEMBAGA_EKSTERNAL') return ['read', 'create', 'update']
  return []
}

export function xLimAuthForWk(action: PermissionAction): XLimAuth {
  const manageRoles: Role[] = ['OWNER', 'TIM_WAJIB_KHIDMAH']
  const wilayahRoles: Role[] = ['PW', 'PC']
  const personalRoles: Role[] = ['GURU_BANTU', 'LEMBAGA_EKSTERNAL']
  if (action === 'read') {
    return { roles: [...manageRoles, ...wilayahRoles, ...personalRoles], scope: 'global', permissions: ['wk:read'] }
  }
  if (action === 'create' || action === 'update') {
    return { roles: [...manageRoles, ...wilayahRoles, ...personalRoles], scope: 'global', permissions: ['wk:write'] }
  }
  if (action === 'review' || action === 'approve' || action === 'delete') {
    return { roles: [...manageRoles], scope: 'global', permissions: ['wk:write'] }
  }
  return { roles: [], scope: 'global' }
}

// --- Safari ---
export const safariMatrix: ModuleMatrix = {
  'safari:manage': {
    roles: ['OWNER', 'ADMIN_BIDANG_SAFARI'],
    scope: 'global',
    actions: ['read', 'create', 'update', 'delete', 'approve'],
  },
  'safari:wilayah': {
    roles: ['PW', 'PC'],
    scope: 'pw',
    actions: ['read', 'create', 'update', 'approve'],
  },
  'safari:panitia': {
    roles: ['PANITIA_SAFARI_DAERAH'],
    scope: 'pc',
    actions: ['read', 'approve'],
  },
  'safari:delegasi': {
    roles: ['DELEGASI_SAFARI_DAERAH'],
    scope: 'self',
    actions: ['read', 'create', 'update'],
  },
}

export function getSafariActionsForRole(role: Role): PermissionAction[] {
  if (role === 'OWNER' || role === 'ADMIN_BIDANG_SAFARI') return ['read', 'create', 'update', 'delete', 'approve']
  if (role === 'PW' || role === 'PC') return ['read', 'create', 'update', 'approve']
  if (role === 'PANITIA_SAFARI_DAERAH') return ['read', 'approve']
  if (role === 'DELEGASI_SAFARI_DAERAH') return ['read', 'create', 'update']
  return []
}

export function xLimAuthForSafari(action: PermissionAction): XLimAuth {
  const manage: Role[] = ['OWNER', 'ADMIN_BIDANG_SAFARI']
  const wilayah: Role[] = ['PW', 'PC']
  const panitia: Role[] = ['PANITIA_SAFARI_DAERAH']
  const delegasi: Role[] = ['DELEGASI_SAFARI_DAERAH']
  if (action === 'read') {
    return { roles: [...manage, ...wilayah, ...panitia, ...delegasi], scope: 'global', permissions: ['safari:read'] }
  }
  if (action === 'create' || action === 'update') {
    return { roles: [...manage, ...wilayah, ...delegasi], scope: 'global', permissions: ['safari:write'] }
  }
  if (action === 'approve') {
    return { roles: [...manage, ...wilayah, ...panitia], scope: 'global', permissions: ['safari:write'] }
  }
  if (action === 'delete') {
    return { roles: [...manage], scope: 'global', permissions: ['safari:write'] }
  }
  return { roles: [], scope: 'global' }
}

// --- Pesantren Ramadan ---
export const pesantrenMatrix: ModuleMatrix = {
  'pesantren:manage': {
    roles: ['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN'],
    scope: 'global',
    actions: ['read', 'create', 'update', 'delete', 'approve'],
  },
  'pesantren:wilayah': {
    roles: ['PW', 'PC'],
    scope: 'pw',
    actions: ['read', 'create', 'update'],
  },
  'pesantren:pengajar': {
    roles: ['PENGAJAR_PESANTREN_RAMADAN'],
    scope: 'self',
    actions: ['read', 'create', 'update'],
  },
}

export function getPesantrenActionsForRole(role: Role): PermissionAction[] {
  if (role === 'OWNER' || role === 'ADMIN_BIDANG_PESANTREN_RAMADAN') return ['read', 'create', 'update', 'delete', 'approve']
  if (role === 'PW' || role === 'PC') return ['read', 'create', 'update']
  if (role === 'PENGAJAR_PESANTREN_RAMADAN') return ['read', 'create', 'update']
  return []
}

export function xLimAuthForPesantren(action: PermissionAction): XLimAuth {
  const manage: Role[] = ['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN']
  const wilayah: Role[] = ['PW', 'PC']
  const pengajar: Role[] = ['PENGAJAR_PESANTREN_RAMADAN']
  if (action === 'read') return { roles: [...manage, ...wilayah, ...pengajar], scope: 'global', permissions: ['pesantren:read'] }
  if (action === 'create' || action === 'update') return { roles: [...manage, ...wilayah, ...pengajar], scope: 'global', permissions: ['pesantren:write'] }
  if (action === 'delete' || action === 'approve') return { roles: [...manage], scope: 'global', permissions: ['pesantren:write'] }
  return { roles: [], scope: 'global' }
}

// --- Falak ---
export const falakMatrix: ModuleMatrix = {
  'falak:manage': { roles: ['OWNER'], scope: 'global', actions: ['read', 'create', 'update', 'delete'] },
  'falak:read': { roles: ['ADMIN_SEKRETARIAT', 'PW', 'PC', 'GURU_BANTU', 'LEMBAGA_EKSTERNAL', 'PONDOK_INTERNAL'], scope: 'global', actions: ['read'] },
}

export function getFalakActionsForRole(role: Role): PermissionAction[] {
  if (role === 'OWNER') return ['read', 'create', 'update', 'delete']
  if (['ADMIN_SEKRETARIAT', 'PW', 'PC', 'GURU_BANTU', 'LEMBAGA_EKSTERNAL', 'PONDOK_INTERNAL'].includes(role)) return ['read']
  return ['read'] // jadwal is public-readable; public endpoints handled separately
}

export function xLimAuthForFalak(action: PermissionAction): XLimAuth {
  if (action === 'read') return { public: true, permissions: ['falak:read'] }
  return { roles: ['OWNER'], scope: 'global', permissions: ['falak:write'] }
}

// --- CMS ---
export const cmsMatrix: ModuleMatrix = {
  'cms:manage': { roles: ['OWNER', 'CONTENT_MANAGER'], scope: 'global', actions: ['read', 'create', 'update', 'delete', 'approve'] },
}

export function getCmsActionsForRole(role: Role): PermissionAction[] {
  if (role === 'OWNER' || role === 'CONTENT_MANAGER') return ['read', 'create', 'update', 'delete', 'approve']
  return []
}

export function xLimAuthForCms(action: PermissionAction): XLimAuth {
  if (action === 'read') return { public: true, permissions: ['cms:read'] }
  return { roles: ['OWNER', 'CONTENT_MANAGER'], scope: 'global', permissions: ['cms:write'] }
}

// --- Dakwah Digital ---
export const dakwahMatrix: ModuleMatrix = {
  'dakwah:manage': { roles: ['OWNER', 'CONTENT_MANAGER'], scope: 'global', actions: ['read', 'create', 'update', 'delete', 'approve'] },
  'dakwah:wilayah': { roles: ['PW', 'PC'], scope: 'pw', actions: ['read', 'create'] },
}

export function getDakwahActionsForRole(role: Role): PermissionAction[] {
  if (role === 'OWNER' || role === 'CONTENT_MANAGER') return ['read', 'create', 'update', 'delete', 'approve']
  if (role === 'PW' || role === 'PC') return ['read', 'create']
  return []
}

export function xLimAuthForDakwah(action: PermissionAction): XLimAuth {
  const manage: Role[] = ['OWNER', 'CONTENT_MANAGER']
  const wilayah: Role[] = ['PW', 'PC']
  if (action === 'read') return { roles: [...manage, ...wilayah], scope: 'global', permissions: ['dakwah:read'] }
  if (action === 'create') return { roles: [...manage, ...wilayah], scope: 'global', permissions: ['dakwah:write'] }
  return { roles: manage, scope: 'global', permissions: ['dakwah:write'] }
}

// --- Daerah Binaan ---
export const daerahBinaanMatrix: ModuleMatrix = {
  'binaan:manage': { roles: ['OWNER'], scope: 'global', actions: ['read', 'create', 'update', 'delete', 'approve'] },
  'binaan:wilayah': { roles: ['PW', 'PC'], scope: 'pw', actions: ['read', 'create', 'update'] },
}

export function getDaerahBinaanActionsForRole(role: Role): PermissionAction[] {
  if (role === 'OWNER') return ['read', 'create', 'update', 'delete', 'approve']
  if (role === 'PW' || role === 'PC') return ['read', 'create', 'update']
  return []
}

export function xLimAuthForDaerahBinaan(action: PermissionAction): XLimAuth {
  const all: Role[] = ['OWNER', 'PW', 'PC']
  if (action === 'read') return { roles: all, scope: 'global', permissions: ['daerah_binaan:read'] }
  if (action === 'create' || action === 'update') return { roles: all, scope: 'global', permissions: ['daerah_binaan:write'] }
  return { roles: ['OWNER'], scope: 'global', permissions: ['daerah_binaan:write'] }
}

// --- Audit (read-only, admin) ---
export function xLimAuthForAudit(): XLimAuth {
  return { roles: ['OWNER', 'ADMIN_SEKRETARIAT'], scope: 'global', permissions: ['audit:read'] }
}

export function xLimAuthForLetter(action: PermissionAction): XLimAuth {
  if (action === 'read') {
    return { roles: ['OWNER', 'ADMIN_SEKRETARIAT', 'ADMIN_BIDANG_SAFARI', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC'], scope: 'global', permissions: ['letters:read'] }
  }
  if (action === 'create') {
    return { roles: ['OWNER', 'ADMIN_SEKRETARIAT', 'ADMIN_BIDANG_SAFARI', 'ADMIN_BIDANG_PESANTREN_RAMADAN', 'PW', 'PC'], scope: 'global', permissions: ['letters:write'] }
  }
  if (action === 'update') {
    return { roles: ['OWNER', 'ADMIN_SEKRETARIAT', 'PW', 'PC'], scope: 'global', permissions: ['letters:write'] }
  }
  if (action === 'review' || action === 'approve' || action === 'send' || action === 'delete') {
    return { roles: ['OWNER', 'ADMIN_SEKRETARIAT'], scope: 'global', permissions: ['letters:write'] }
  }
  return { roles: [], scope: 'global' }
}

export function xLimAuthPublic(): XLimAuth {
  return { public: true }
}
