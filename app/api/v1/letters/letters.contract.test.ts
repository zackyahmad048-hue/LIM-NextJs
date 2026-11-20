import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'

vi.mock('@/lib/api/auth', () => ({
  authenticateRequest: vi.fn(),
  requireAuth: vi.fn(),
  requireApiKeyPermission: vi.fn(),
  getOrganizationalIdentity: vi.fn(),
}))

vi.mock('@/modules/letter/application/letter-operations', () => ({
  listLetters: vi.fn(),
  getLetterById: vi.fn(),
  createLetterRecord: vi.fn(),
  updateLetterRecord: vi.fn(),
  submitLetterForReview: vi.fn(),
  approveLetterRecord: vi.fn(),
  sendLetterRecord: vi.fn(),
  deleteLetterRecord: vi.fn(),
  listLetterLogs: vi.fn(),
  getPublicVerification: vi.fn(),
}))

import { GET as listGET, POST as createPOST } from './route'
import { GET as detailGET } from './[id]/route'
import { GET as logsGET } from './[id]/logs/route'
import { requireAuth } from '@/lib/api/auth'
import { listLetters, getLetterById, createLetterRecord, listLetterLogs } from '@/modules/letter/application/letter-operations'

const principal = {
  subject: { userId: 'u1', role: 'OWNER' as const, accountType: 'PERSONAL' as const, organisasiId: null, lembagaId: null },
  method: 'session' as const,
}

const asPrincipal = principal as unknown as Awaited<ReturnType<typeof requireAuth>>

const envelopeSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    success: z.literal(true),
    data,
    requestId: z.string().optional(),
    code: z.string().optional(),
    meta: z.any().optional(),
  })

const letterSummarySchema = z.object({
  id: z.string(),
  type: z.enum(['MASUK', 'KELUAR']),
  nomorSurat: z.string().nullable(),
  tanggalSurat: z.string(),
  pengirim: z.string(),
  penerima: z.string().nullable(),
  perihal: z.string(),
  fileUrl: z.string().nullable(),
  qrCodeUrl: z.string().nullable(),
  verificationSlug: z.string().nullable(),
  status: z.enum(['DIKETIK', 'REVIEW', 'APPROVED', 'SENT', 'ARCHIVED']),
  createdById: z.string(),
  periodId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const letterDetailSchema = letterSummarySchema.extend({ isiSurat: z.string().optional().nullable() })

describe('GET /api/v1/letters (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns paginated envelope matching DTO', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(listLetters).mockResolvedValue({
      items: [{
        id: 'l1', type: 'KELUAR', nomorSurat: null, tanggalSurat: new Date('2026-01-01'),
        pengirim: 'PP', penerima: null, perihal: 'Uji', isiSurat: 'Isi panjang uji',
        fileUrl: null, qrCodeUrl: null, verificationSlug: null, status: 'DIKETIK',
        createdById: 'u1', periodId: null, createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'),
      } as never],
      total: 1,
    })

    const req = new Request('http://localhost/api/v1/letters?page=1&limit=20')
    const res = await listGET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    const parsed = envelopeSchema(z.array(letterSummarySchema)).safeParse(body)
    expect(parsed.success).toBe(true)
    expect(body.meta?.total).toBe(1)
    expect(body.data[0].isiSurat).toBeUndefined()
  })
})

describe('POST /api/v1/letters (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('creates letter and returns detail DTO', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(createLetterRecord).mockResolvedValue({
      id: 'l2', type: 'KELUAR', nomorSurat: null, tanggalSurat: new Date('2026-01-02'),
      pengirim: 'PP LIM', penerima: 'Tujuan', perihal: 'Perihal Uji', isiSurat: 'Isi surat minimal sepuluh',
      fileUrl: null, qrCodeUrl: null, verificationSlug: null, status: 'DIKETIK',
      createdById: 'u1', periodId: null, createdAt: new Date('2026-01-02'), updatedAt: new Date('2026-01-02'),
    } as never)

    const req = new Request('http://localhost/api/v1/letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pengirim: 'PP LIM', perihal: 'Perihal Uji', isiSurat: 'Isi surat minimal sepuluh' }),
    })
    const res = await createPOST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    const parsed = envelopeSchema(letterDetailSchema).safeParse(body)
    expect(parsed.success).toBe(true)
    expect(body.data.status).toBe('DIKETIK')
  })

  it('returns 422 on invalid payload', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    const req = new Request('http://localhost/api/v1/letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pengirim: 'x' }),
    })
    const res = await createPOST(req)
    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.code).toBe('VALIDATION_ERROR')
  })
})

describe('GET /api/v1/letters/{id} (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns detail DTO', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(getLetterById).mockResolvedValue({
      id: 'l1', type: 'KELUAR', nomorSurat: '001/PP/H/I/2026', tanggalSurat: new Date('2026-01-01'),
      pengirim: 'PP', penerima: null, perihal: 'Uji', isiSurat: 'Isi lengkap',
      fileUrl: null, qrCodeUrl: null, verificationSlug: 'slug', status: 'SENT',
      createdById: 'u1', periodId: 'p1', createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'),
    } as never)

    const req = new Request('http://localhost/api/v1/letters/l1')
    const res = await detailGET(req, { params: Promise.resolve({ id: 'l1' }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    const parsed = envelopeSchema(letterDetailSchema).safeParse(body)
    expect(parsed.success).toBe(true)
    expect(body.data.isiSurat).toBe('Isi lengkap')
  })
})

describe('GET /api/v1/letters/{id}/logs (contract)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns log DTO array', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(listLetterLogs).mockResolvedValue([
      { id: 'log1', letterId: 'l1', action: 'REVIEW', userId: 'u1', notes: null, timestamp: new Date('2026-01-02') } as never,
    ])

    const req = new Request('http://localhost/api/v1/letters/l1/logs')
    const res = await logsGET(req, { params: Promise.resolve({ id: 'l1' }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data[0].action).toBe('REVIEW')
  })
})
