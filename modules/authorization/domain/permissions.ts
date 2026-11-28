import type { Role } from '@/generated/client'

export type Scope = 'global' | 'pw' | 'pc' | 'lembaga' | 'self'

export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'review' | 'approve' | 'send'

export type Resource =
  | 'letters'
  | 'letter_logs'
  | 'uploads'
  | 'wajib_khidmah'
  | 'safari'
  | 'pesantren'
  | 'falak'
  | 'cms'
  | 'dakwah'
  | 'daerah_binaan'
  | 'users'
  | 'audit'
  | 'public_verification'

export type ResourcePermission = {
  roles: Role[]
  scope: Scope
  actions: PermissionAction[]
}

export type ModuleMatrix = Record<string, ResourcePermission>

export type TenantScope = 'PUSAT' | 'UNIT' | 'LEMBAGA' | 'SELF' | 'PUBLIC'

export type AuthzSubject = {
  userId: string
  role: Role
  accountType?: string | null
  organisasiId?: string | null
  unitId?: string | null
  lembagaId?: string | null
  penugasanStrukturalId?: string | null
  scope?: TenantScope
}

export type AuthzContext = {
  subject: AuthzSubject
  resourceOwnerId?: string | null
  resourceOrgId?: string | null
  resourceLembagaId?: string | null
}

export type AuthzDecision = {
  allowed: boolean
  reason?: string
  scope?: Scope
}
