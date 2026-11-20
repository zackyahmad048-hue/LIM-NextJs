import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'

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

vi.mock('@/modules/safari/application/safari-operations', () => ({
  listTitikSafari: vi.fn(),
  getTitikSafariById: vi.fn(),
  createTitikSafariRecord: vi.fn(),
  updateTitikSafariRecord: vi.fn(),
  listDelegasi: vi.fn(),
  getDelegasiById: vi.fn(),
  createDelegasiRecord: vi.fn(),
  listJurnal: vi.fn(),
  createJurnalRecord: vi.fn(),
  approveJurnalRecord: vi.fn(),
  listApprovalByDelegasi: vi.fn(),
  listLaporanSidak: vi.fn(),
  createLaporanSidakRecord: vi.fn(),
}))

import { GET as listTitikGET, POST as createTitikPOST } from './titik/route'
import { POST as createJurnalPOST } from './jurnal/route'
import { requireAuth } from '@/lib/api/auth'
import { listTitikSafari, createTitikSafariRecord, createJurnalRecord } from '@/modules/safari/application/safari-operations'

const principal = {
  subject: { userId: 'u1', role: 'OWNER' as const, accountType: 'PERSONAL' as const, organisasiId: null, lembagaId: null },
  method: 'session' as const,
}
const asPrincipal = principal as unknown as Awaited<ReturnType<typeof requireAuth>>

const envelope = <T extends z.ZodTypeAny>(data: T) => z.object({ success: z.literal(true), data, meta: z.any().optional(), requestId: z.string().optional() })

describe('GET /api/v1/safari/titik (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns paginated titik DTOs', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(listTitikSafari).mockResolvedValue({
      items: [{ id: 't1', namaTitik: 'Masjid', alamat: 'Jl. A', provinsi: 'Jatim', kabupaten: 'Kediri', kecamatan: 'X', desa: 'Y', picNama: null, picNoHp: null, createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') } as never],
      total: 1,
    })
    const res = await listTitikGET(new Request('http://localhost/api/v1/safari/titik?page=1&limit=20'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(envelope(z.array(z.object({ id: z.string(), namaTitik: z.string(), provinsi: z.string() }))).safeParse(body).success).toBe(true)
  })
})

describe('POST /api/v1/safari/titik (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('creates titik and returns DTO', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(createTitikSafariRecord).mockResolvedValue({ id: 't2', namaTitik: 'Masjid B', alamat: 'Alamat lengkap', provinsi: 'Jatim', kabupaten: 'Kediri', kecamatan: 'Mojo', desa: 'Suko', picNama: null, picNoHp: null, createdAt: new Date('2026-01-02'), updatedAt: new Date('2026-01-02') } as never)
    const req = new Request('http://localhost/api/v1/safari/titik', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ namaTitik: 'Masjid B', alamat: 'Alamat lengkap', provinsi: 'Jatim', kabupaten: 'Kediri', kecamatan: 'Mojo', desa: 'Suko' }) })
    const res = await createTitikPOST(req)
    const body = await res.json()
    expect(res.status, JSON.stringify(body)).toBe(201)
    expect(body.success).toBe(true)
    expect(body.data.namaTitik).toBe('Masjid B')
  })
})

describe('POST /api/v1/safari/jurnal (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('creates jurnal and returns DTO', async () => {
    vi.mocked(requireAuth).mockResolvedValue({ ...principal, subject: { ...principal.subject, role: 'DELEGASI_SAFARI_DAERAH' } } as unknown as Awaited<ReturnType<typeof requireAuth>>)
    vi.mocked(createJurnalRecord).mockResolvedValue({ id: 'j1', delegasiId: 'd1', tanggal: new Date('2026-03-01'), kegiatan: 'Ceramah tarawih', jumlahJamaah: 100, catatan: null, createdAt: new Date('2026-03-01') } as never)
    const req = new Request('http://localhost/api/v1/safari/jurnal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ delegasiId: 'd1', tanggal: '2026-03-01T00:00:00.000Z', kegiatan: 'Ceramah tarawih', jumlahJamaah: 100 }) })
    const res = await createJurnalPOST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.delegasiId).toBe('d1')
  })
})
