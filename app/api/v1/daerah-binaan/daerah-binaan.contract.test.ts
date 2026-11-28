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

vi.mock('@/modules/daerah-binaan/application/daerah-binaan-operations', () => ({
  listDaerah: vi.fn(),
  createDaerahRecord: vi.fn(),
  listLaporanBulanan: vi.fn(),
  createLaporanBulananRecord: vi.fn(),
}))

import { GET as listGET, POST as createPOST } from './daerah/route'
import { requireAuth } from '@/lib/api/auth'
import { listDaerah, createDaerahRecord } from '@/modules/daerah-binaan/application/daerah-binaan-operations'

const principal = {
  subject: { userId: 'u1', role: 'OWNER' as const, accountType: 'PERSONAL' as const, organisasiId: null, lembagaId: null },
  method: 'session' as const,
}
const asPrincipal = principal as unknown as Awaited<ReturnType<typeof requireAuth>>

describe('GET /api/v1/daerah-binaan/daerah (contract)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('returns paginated daerah binaan', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(listDaerah).mockResolvedValue({ items: [{ id: 'd1', namaLokasi: 'Desa A', provinsi: 'Jatim', kabupaten: 'Kediri', kecamatan: 'Mojo', deskripsiKondisi: 'Kondisi desa binaan', sumberLokasi: null, status: 'AKTIF', picLokalId: 'u1', createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') } as never], total: 1, hasMore: false, nextCursor: null })
    const res = await listGET(new Request('http://localhost/api/v1/daerah-binaan/daerah'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data[0].namaLokasi).toBe('Desa A')
  })
})

describe('POST /api/v1/daerah-binaan/daerah (contract)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('creates daerah binaan', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(createDaerahRecord).mockResolvedValue({ id: 'd2', namaLokasi: 'Desa B', provinsi: 'Jatim', kabupaten: 'Kediri', kecamatan: 'Mojo', deskripsiKondisi: 'Kondisi desa binaan', sumberLokasi: null, status: 'AKTIF', picLokalId: 'u1', createdAt: new Date(), updatedAt: new Date() } as never)
    const req = new Request('http://localhost/api/v1/daerah-binaan/daerah', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ namaLokasi: 'Desa B', provinsi: 'Jatim', kabupaten: 'Kediri', kecamatan: 'Mojo', deskripsiKondisi: 'Kondisi desa binaan' }) })
    const res = await createPOST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data.namaLokasi).toBe('Desa B')
  })
})
