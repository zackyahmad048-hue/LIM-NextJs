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

vi.mock('@/lib/api/idempotency', () => ({
  getIdempotencyKey: vi.fn().mockReturnValue(null),
  beginIdempotent: vi.fn().mockResolvedValue({ state: 'started' }),
  completeIdempotent: vi.fn().mockResolvedValue(undefined),
  abortIdempotent: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/modules/dakwah-digital/application/dakwah-operations', () => ({
  listKonten: vi.fn(),
  createKontenRecord: vi.fn(),
  approveKontenRecord: vi.fn(),
  publishKontenRecord: vi.fn(),
  registerEventRecord: vi.fn(),
}))

import { GET as listGET } from './konten/route'
import { POST as registerPOST } from './events/register/route'
import { requireAuth } from '@/lib/api/auth'
import { listKonten, registerEventRecord } from '@/modules/dakwah-digital/application/dakwah-operations'

const principal = {
  subject: { userId: 'u1', role: 'CONTENT_MANAGER' as const, accountType: 'PERSONAL' as const, organisasiId: null, lembagaId: null },
  method: 'session' as const,
}
const asPrincipal = principal as unknown as Awaited<ReturnType<typeof requireAuth>>

describe('GET /api/v1/dakwah/konten (contract)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('returns paginated konten', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(listKonten).mockResolvedValue({ items: [{ id: 'k1', judul: 'Kajian', slug: 'kajian', deskripsi: 'Deskripsi panjang', jenisKonten: 'KAJIAN', status: 'DRAFT', thumbnailUrl: null, linkVideo: null, pengunggahId: 'u1', disetujuiOlehId: null, createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') } as never], total: 1 })
    const res = await listGET(new Request('http://localhost/api/v1/dakwah/konten'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data[0].judul).toBe('Kajian')
  })
})

describe('POST /api/v1/dakwah/events/register (contract)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('registers event publicly', async () => {
    vi.mocked(registerEventRecord).mockResolvedValue({ id: 'p1', kontenId: 'k1', namaPeserta: 'Ahmad', email: 'a@b.com', noHp: '08123', asalInstansi: null, createdAt: new Date('2026-01-01') } as never)
    const req = new Request('http://localhost/api/v1/dakwah/events/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kontenId: 'k1', namaPeserta: 'Ahmad', email: 'a@b.com', noHp: '08123' }) })
    const res = await registerPOST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.namaPeserta).toBe('Ahmad')
  })
})
