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

vi.mock('@/modules/pesantren-ramadan/application/pesantren-operations', () => ({
  listSekolah: vi.fn(),
  createSekolahRecord: vi.fn(),
  listMateri: vi.fn(),
  createMateriRecord: vi.fn(),
  listPenugasanPesantren: vi.fn(),
  createPenugasanPesantrenRecord: vi.fn(),
  listLaporanPengajar: vi.fn(),
  createLaporanPengajarRecord: vi.fn(),
  listLaporanKoordinator: vi.fn(),
  createLaporanKoordinatorRecord: vi.fn(),
  listUmpanBalikPusat: vi.fn(),
  createUmpanBalikPusatRecord: vi.fn(),
  listUmpanBalikPeserta: vi.fn(),
  createUmpanBalikPesertaRecord: vi.fn(),
}))

import { GET as sekolahGET, POST as sekolahPOST } from './sekolah/route'
import { GET as penugasanGET } from './penugasan/route'
import { requireAuth } from '@/lib/api/auth'
import { listSekolah, createSekolahRecord, listPenugasanPesantren } from '@/modules/pesantren-ramadan/application/pesantren-operations'

const principal = {
  subject: { userId: 'u1', role: 'ADMIN_BIDANG_PESANTREN_RAMADAN' as const, accountType: 'PERSONAL' as const, organisasiId: null, lembagaId: null },
  method: 'session' as const,
}
const asPrincipal = principal as unknown as Awaited<ReturnType<typeof requireAuth>>

describe('GET /api/v1/pesantren/sekolah (contract)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('returns paginated sekolah', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(listSekolah).mockResolvedValue({ items: [{ id: 's1', namaSekolah: 'SDN 1', jenjang: 'SD', alamat: 'Jl. Mawar 1', picNama: 'Budi', picNoHp: '0812', picJabatan: null, createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') } as never], total: 1 })
    const res = await sekolahGET(new Request('http://localhost/api/v1/pesantren/sekolah'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data[0].namaSekolah).toBe('SDN 1')
  })
})

describe('POST /api/v1/pesantren/sekolah (contract)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('creates sekolah', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(createSekolahRecord).mockResolvedValue({ id: 's2', namaSekolah: 'SMPN 1', jenjang: 'SMP', alamat: 'Jl. Melati 2', picNama: 'Ani', picNoHp: '0813', picJabatan: 'Kepsek', createdAt: new Date(), updatedAt: new Date() } as never)
    const req = new Request('http://localhost/api/v1/pesantren/sekolah', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ namaSekolah: 'SMPN 1', jenjang: 'SMP', alamat: 'Jl. Melati 2', picNama: 'Ani', picNoHp: '0812345' }) })
    const res = await sekolahPOST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data.namaSekolah).toBe('SMPN 1')
  })
})

describe('GET /api/v1/pesantren/penugasan (contract)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('returns paginated penugasan', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(listPenugasanPesantren).mockResolvedValue({ items: [{ id: 'p1', sekolahId: 's1', pengajarId: 'u2', koordinatorId: 'u3', tanggalMulai: new Date('2026-03-01'), tanggalSelesai: new Date('2026-03-20'), status: 'AKTIF', createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-02-01') } as never], total: 1 })
    const res = await penugasanGET(new Request('http://localhost/api/v1/pesantren/penugasan'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data[0].sekolahId).toBe('s1')
  })
})
