// modules/letter/presentation/queries/letter-scope.ts
import { getDataScope } from '@/modules/authentication/domain/permissions'
import type { Role, AccountType } from '@/generated/client'

export interface LetterActor {
  id: string
  role: Role
  accountType?: AccountType
}

// Row-level scope surat (docs/backend/06.RBAC.md §3.2): pusat melihat semua,
// organisasi & personal hanya surat miliknya sendiri.
// shortcut: Letter belum punya organizationId, jadi PW/PC belum bisa melihat surat satu unit — tambahkan kolomnya bila dibutuhkan.
export function letterScopeWhere(actor: LetterActor): { createdById?: string } {
  return getDataScope(actor.role, actor.accountType) === 'GLOBAL' ? {} : { createdById: actor.id }
}
