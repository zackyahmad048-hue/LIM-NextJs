import { prisma } from '@/lib/prisma'
import type { Role } from '@/generated/client'
import type { AuthzSubject, TenantScope } from '@/modules/authorization/domain/permissions'

const PUSAT_ROLES = new Set<Role>([
  'OWNER',
  'ADMIN_SEKRETARIAT',
  'TIM_WAJIB_KHIDMAH',
  'CONTENT_MANAGER',
  'ADMIN_BIDANG_SAFARI',
  'ADMIN_BIDANG_PESANTREN_RAMADAN',
])
const UNIT_ROLES = new Set<Role>(['PW', 'PC', 'PONDOK_INTERNAL'])

export function resolveTenantScope(role: Role): TenantScope {
  if (PUSAT_ROLES.has(role)) return 'PUSAT'
  if (UNIT_ROLES.has(role)) return 'UNIT'
  if (role === 'LEMBAGA_EKSTERNAL') return 'LEMBAGA'
  return 'SELF'
}

export async function loadAuthzSubject(user: {
  id: string
  role?: string | null
  accountType?: string | null
}): Promise<AuthzSubject> {
  const role = (user.role as Role | undefined) ?? 'GURU_BANTU'
  const accountType = user.accountType ?? null

  let organisasiId: string | null = null
  let lembagaId: string | null = null

  if (accountType === 'ORGANIZATIONAL') {
    const org = await prisma.organizationalAccount.findUnique({
      where: { userId: user.id },
      select: { unitId: true },
    })
    organisasiId = org?.unitId ?? null
  }

  if (role === 'LEMBAGA_EKSTERNAL') {
    const lembaga = await prisma.lembaga.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })
    lembagaId = lembaga?.id ?? null
  }

  return {
    userId: user.id,
    role,
    accountType,
    organisasiId,
    unitId: organisasiId,
    lembagaId,
    scope: resolveTenantScope(role),
  }
}
