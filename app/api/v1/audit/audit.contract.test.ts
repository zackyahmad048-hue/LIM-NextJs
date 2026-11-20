import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/api/auth', () => ({
  authenticateRequest: vi.fn(),
  requireAuth: vi.fn(),
  requireApiKeyPermission: vi.fn(),
  getOrganizationalIdentity: vi.fn(),
}))

vi.mock('@/lib/api/rate-limit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/rate-limit')>()
  return { ...actual, enforceRateLimit: vi.fn().mockResolvedValue(undefined), getClientIp: vi.fn().mockReturnValue('127.0.0.1') }
})

vi.mock('@/modules/audit/application/audit-operations', () => ({
  listAuditLogs: vi.fn(),
}))

import { GET as logsGET } from './logs/route'
import { requireAuth } from '@/lib/api/auth'
import { listAuditLogs } from '@/modules/audit/application/audit-operations'

const principal = {
  subject: { userId: 'u1', role: 'OWNER' as const, accountType: 'PERSONAL' as const, organisasiId: null, lembagaId: null },
  method: 'session' as const,
}
const asPrincipal = principal as unknown as Awaited<ReturnType<typeof requireAuth>>

describe('GET /api/v1/audit/logs (contract)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('returns paginated audit logs', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(listAuditLogs).mockResolvedValue({ items: [{ id: 'a1', userId: 'u1', action: 'LOGIN', entity: 'User', entityId: 'u1', metadata: null, ipAddress: '127.0.0.1', createdAt: new Date('2026-01-01') } as never], total: 1 })
    const res = await logsGET(new Request('http://localhost/api/v1/audit/logs'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data[0].action).toBe('LOGIN')
    expect(body.meta.total).toBe(1)
  })
})
