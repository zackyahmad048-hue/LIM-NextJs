import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Role } from '@/generated/client'
import type { AuthzSubject } from '@/modules/authorization/domain/permissions'
import { ApiError } from './errors'

export type AuthMethod = 'session' | 'api-key'

export type ApiPrincipal = {
  subject: AuthzSubject
  method: AuthMethod
  apiKeyId?: string
  apiKeyPermissions?: Record<string, string[]> | null
}

function extractApiKey(request: Request): string | null {
  const direct = request.headers.get('x-api-key')
  if (direct) return direct.trim() || null
  const authz = request.headers.get('authorization')
  if (!authz) return null
  const [scheme, value] = authz.split(/\s+/, 2)
  if (scheme?.toLowerCase() === 'bearer' && value) return value.trim() || null
  return null
}

function parsePermissions(raw: unknown): Record<string, string[]> | null {
  if (!raw) return null
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, string[]>) : null
    } catch {
      return null
    }
  }
  if (typeof raw === 'object') return raw as Record<string, string[]>
  return null
}

async function loadSubject(user: { id: string; role?: string | null; accountType?: string | null }): Promise<AuthzSubject> {
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
    lembagaId,
  }
}

export async function authenticateRequest(request: Request): Promise<ApiPrincipal | null> {
  // 1) Try cookie/session auth
  const session = await auth.api.getSession({ headers: request.headers })
  if (session?.user) {
    const subject = await loadSubject(session.user as { id: string; role?: string; accountType?: string })
    return { subject, method: 'session' }
  }

  // 2) Try API key auth
  const key = extractApiKey(request)
  if (!key) return null

  const verified = await auth.api.verifyApiKey({ body: { key } })
  if (!verified?.valid || !verified.key) {
    throw new ApiError('UNAUTHORIZED', 'API key tidak valid atau kedaluwarsa', 401)
  }

  const apiKeyRecord = verified.key as { id?: string; referenceId?: string; permissions?: unknown }
  const referenceId = apiKeyRecord.referenceId
  if (!referenceId) {
    throw new ApiError('UNAUTHORIZED', 'API key tidak memiliki pemilik', 401)
  }

  const user = await prisma.user.findUnique({
    where: { id: referenceId },
    select: { id: true, role: true, accountType: true },
  })
  if (!user) {
    throw new ApiError('UNAUTHORIZED', 'Pemilik API key tidak ditemukan', 401)
  }

  const subject = await loadSubject(user)
  return {
    subject,
    method: 'api-key',
    apiKeyId: apiKeyRecord.id,
    apiKeyPermissions: parsePermissions(apiKeyRecord.permissions),
  }
}

export async function requireAuth(request: Request): Promise<ApiPrincipal> {
  const principal = await authenticateRequest(request)
  if (!principal) {
    throw new ApiError('UNAUTHORIZED', 'Autentikasi diperlukan', 401)
  }
  return principal
}

export function requireApiKeyPermission(
  principal: ApiPrincipal,
  resource: string,
  action: string
): void {
  if (principal.method !== 'api-key') return
  const perms = principal.apiKeyPermissions
  if (!perms) {
    throw new ApiError('FORBIDDEN', 'API key tidak memiliki izin yang diperlukan', 403)
  }
  const allowed = perms[resource] ?? []
  if (!allowed.includes(action) && !allowed.includes('*')) {
    throw new ApiError('FORBIDDEN', `API key tidak memiliki izin ${resource}:${action}`, 403)
  }
}

export async function getOrganizationalIdentity(userId: string): Promise<{
  namaPengisi: string | null
  jabatanPengisi: string | null
  organisasiId: string | null
} | null> {
  const org = await prisma.organizationalAccount.findUnique({
    where: { userId },
    select: {
      unitId: true,
      unit: { select: { namaUnit: true } },
      user: { select: { name: true } },
    },
  })
  if (!org) return null
  return {
    namaPengisi: org.user.name ?? null,
    jabatanPengisi: org.unit.namaUnit ?? null,
    organisasiId: org.unitId,
  }
}
