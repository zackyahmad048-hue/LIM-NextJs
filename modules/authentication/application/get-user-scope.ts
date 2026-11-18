// modules/authentication/application/get-user-scope.ts
import { getDataScope, type DataScope } from '@/modules/authentication/domain/permissions'
import type { OrganizationRepository } from '@/modules/authentication/domain/organization.repository'
import type { Role, AccountType } from '@/generated/client'

export interface UserScope {
  kind: DataScope
  label: string
}

interface ScopeUser {
  id: string
  role: Role
  accountType?: AccountType
}

export async function getUserScope(repo: OrganizationRepository, user: ScopeUser): Promise<UserScope> {
  const kind = getDataScope(user.role, user.accountType)
  if (kind === 'GLOBAL') return { kind, label: 'Pusat' }
  if (kind === 'PERSONAL') return { kind, label: 'Data pribadi' }
  const unitName = await repo.findUnitNameByUserId(user.id)
  return { kind, label: unitName ?? 'Organisasi' }
}
