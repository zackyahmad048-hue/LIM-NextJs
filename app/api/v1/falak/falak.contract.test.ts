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

vi.mock('@/modules/falak/application/falak-operations', () => ({
  listJadwal: vi.fn(),
  getJadwalByTanggal: vi.fn(),
  getActiveConfig: vi.fn(),
  generateJadwalRecord: vi.fn(),
}))

import { GET as jadwalGET } from './jadwal/route'
import { POST as generatePOST } from './jadwal/generate/route'
import { GET as configGET } from './config/route'
import { requireAuth } from '@/lib/api/auth'
import { listJadwal, getActiveConfig, generateJadwalRecord } from '@/modules/falak/application/falak-operations'

const principal = {
  subject: { userId: 'u1', role: 'OWNER' as const, accountType: 'PERSONAL' as const, organisasiId: null, lembagaId: null },
  method: 'session' as const,
}
const asPrincipal = principal as unknown as Awaited<ReturnType<typeof requireAuth>>

const jadwal = {
  id: 'j1', tanggal: new Date('2026-03-01T00:00:00.000Z'),
  subuh: '04:30', terbit: '05:45', dzuhur: '11:50', ashar: '15:10', maghrib: '17:55', isya: '19:05',
  configId: 'c1', isManualOverride: false, catatanOverride: null,
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'),
}

describe('GET /api/v1/falak/jadwal (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns list of jadwal DTOs', async () => {
    vi.mocked(listJadwal).mockResolvedValue([jadwal as never])
    const res = await jadwalGET(new Request('http://localhost/api/v1/falak/jadwal'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data[0].subuh).toBe('04:30')
  })
})

describe('GET /api/v1/falak/config (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns active config DTO', async () => {
    vi.mocked(getActiveConfig).mockResolvedValue({
      id: 'c1', namaLokasi: 'Kediri', latitude: -7.8, longitude: 112.0, ketinggian: 100,
      metodeHisab: 'Tashilul Amtsilah', kriteriaMABIMS: true, koreksiSubuh: 2, koreksiMaghrib: 0,
      modeWaktu: 'standar', isActive: true, updatedAt: new Date('2026-01-01'),
    } as never)
    const res = await configGET(new Request('http://localhost/api/v1/falak/config'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.namaLokasi).toBe('Kediri')
  })
})

describe('POST /api/v1/falak/jadwal/generate (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('generates jadwal and returns DTO', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(generateJadwalRecord).mockResolvedValue(jadwal as never)
    const req = new Request('http://localhost/api/v1/falak/jadwal/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tanggal: '2026-03-01T00:00:00.000Z' }),
    })
    const res = await generatePOST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.id).toBe('j1')
  })
})
