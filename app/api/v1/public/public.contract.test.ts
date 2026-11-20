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

vi.mock('@/modules/letter/application/letter-operations', () => ({
  getPublicVerification: vi.fn(),
}))

import { GET as verifyGET } from './letters/verify/[slug]/route'
import { getPublicVerification } from '@/modules/letter/application/letter-operations'

describe('GET /api/v1/public/letters/verify/{slug} (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns verification data for valid slug', async () => {
    vi.mocked(getPublicVerification).mockResolvedValue({ nomorSurat: '001/PP/H/I/2026', perihal: 'Undangan', pengirim: 'PP LIM', tanggalSurat: new Date('2026-01-01'), status: 'SENT' } as never)
    const res = await verifyGET(new Request('http://localhost/api/v1/public/letters/verify/abc'), { params: Promise.resolve({ slug: 'abc' }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data.nomorSurat).toBe('001/PP/H/I/2026')
  })

  it('returns 404 when not found', async () => {
    vi.mocked(getPublicVerification).mockResolvedValue(null)
    const res = await verifyGET(new Request('http://localhost/api/v1/public/letters/verify/missing'), { params: Promise.resolve({ slug: 'missing' }) })
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.success).toBe(false)
  })
})
