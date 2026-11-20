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

vi.mock('@/modules/wajib-khidmah/application/wajib-khidmah-operations', () => ({
  listPenugasan: vi.fn(),
  getPenugasanById: vi.fn(),
  listLaporan: vi.fn(),
  getLaporanById: vi.fn(),
  submitLaporanRecord: vi.fn(),
  createEvaluasiKasusRecord: vi.fn(),
  listEvaluasiKasus: vi.fn(),
  createEvaluasiIndukRecord: vi.fn(),
  listEvaluasiInduk: vi.fn(),
}))

import { GET as listPenugasanGET } from './penugasan/route'
import { POST as submitLaporanPOST } from './laporan/route'
import { requireAuth } from '@/lib/api/auth'
import { listPenugasan, submitLaporanRecord } from '@/modules/wajib-khidmah/application/wajib-khidmah-operations'

const principal = {
  subject: { userId: 'u1', role: 'TIM_WAJIB_KHIDMAH' as const, accountType: 'PERSONAL' as const, organisasiId: null, lembagaId: null },
  method: 'session' as const,
}
const asPrincipal = principal as unknown as Awaited<ReturnType<typeof requireAuth>>

const envelope = <T extends z.ZodTypeAny>(data: T) => z.object({ success: z.literal(true), data, meta: z.any().optional(), requestId: z.string().optional() })

describe('GET /api/v1/wajib-khidmah/penugasan (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns paginated penugasan DTOs', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(listPenugasan).mockResolvedValue({
      items: [{ id: 'p1', guruBantuId: 'g1', lembagaId: 'l1', dosenPenanggungId: 'd1', tanggalMulai: new Date('2026-01-01'), tanggalSelesai: null, status: 'DIAKTIFKAN', targetJamaahMingguan: 50, createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') } as never],
      total: 1,
    })
    const res = await listPenugasanGET(new Request('http://localhost/api/v1/wajib-khidmah/penugasan?page=1&limit=20'))
    expect(res.status).toBe(200)
    const body = await res.json()
    const schema = envelope(z.array(z.object({ id: z.string(), status: z.string(), tanggalMulai: z.string(), createdAt: z.string() })))
    expect(schema.safeParse(body).success).toBe(true)
    expect(body.meta.total).toBe(1)
  })
})

describe('POST /api/v1/wajib-khidmah/laporan (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('submits laporan and returns DTO', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(submitLaporanRecord).mockResolvedValue({
      id: 'lap1', penugasanId: 'p1', pelaporId: 'u1', rolePelapor: 'GURU_BANTU', namaPengisi: 'Guru', jabatanPengisi: 'Guru Bantu',
      periodeMinggu: 10, periodeTahun: 2026, tanggalLapor: new Date('2026-03-01'), jumlahHariHadir: 5, keteranganAbsensi: null,
      jumlahJamaahDilakukan: 40, aktivitasMingguan: 'Mengajar nahwu dan sharaf', kendala: null, statusHonor: 'BELUM', isForwardedToInduk: false,
      createdAt: new Date('2026-03-01'), detailKitab: [],
    } as never)
    const req = new Request('http://localhost/api/v1/wajib-khidmah/laporan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ penugasanId: 'p1', periodeMinggu: 10, periodeTahun: 2026, jumlahHariHadir: 5, jumlahJamaahDilakukan: 40, aktivitasMingguan: 'Mengajar nahwu dan sharaf', statusHonor: 'BELUM' }),
    })
    const res = await submitLaporanPOST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.id).toBe('lap1')
  })

  it('returns 422 on invalid payload', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    const req = new Request('http://localhost/api/v1/wajib-khidmah/laporan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ penugasanId: 'p1' }),
    })
    const res = await submitLaporanPOST(req)
    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body.code).toBe('VALIDATION_ERROR')
  })
})
