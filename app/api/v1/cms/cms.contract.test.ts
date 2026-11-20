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

vi.mock('@/modules/cms/application/cms-operations', () => ({
  listCategories: vi.fn(),
  createCategoryRecord: vi.fn(),
  listArticles: vi.fn(),
  getArticleById: vi.fn(),
  getArticleBySlug: vi.fn(),
  createArticleRecord: vi.fn(),
  publishArticleRecord: vi.fn(),
}))

import { GET as categoriesGET, POST as categoriesPOST } from './categories/route'
import { GET as articlesGET } from './articles/route'
import { GET as slugGET } from './articles/slug/[slug]/route'
import { authenticateRequest, requireAuth } from '@/lib/api/auth'
import { listCategories, createCategoryRecord, listArticles, getArticleBySlug } from '@/modules/cms/application/cms-operations'

const principal = {
  subject: { userId: 'u1', role: 'CONTENT_MANAGER' as const, accountType: 'PERSONAL' as const, organisasiId: null, lembagaId: null },
  method: 'session' as const,
}
const asPrincipal = principal as unknown as Awaited<ReturnType<typeof requireAuth>>

describe('GET /api/v1/cms/categories (contract)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('returns categories', async () => {
    vi.mocked(listCategories).mockResolvedValue([{ id: 'c1', nama: 'Berita', slug: 'berita', urutan: 0, createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') } as never])
    const res = await categoriesGET(new Request('http://localhost/api/v1/cms/categories'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.data[0].slug).toBe('berita')
  })
})

describe('POST /api/v1/cms/categories (contract)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('creates category', async () => {
    vi.mocked(requireAuth).mockResolvedValue(asPrincipal)
    vi.mocked(createCategoryRecord).mockResolvedValue({ id: 'c2', nama: 'Opini', slug: 'opini', urutan: 1, createdAt: new Date(), updatedAt: new Date() } as never)
    const res = await categoriesPOST(new Request('http://localhost/api/v1/cms/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nama: 'Opini', slug: 'opini', urutan: 1 }) }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data.nama).toBe('Opini')
  })
})

describe('GET /api/v1/cms/articles (contract)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('returns paginated articles', async () => {
    vi.mocked(authenticateRequest).mockResolvedValue(null)
    vi.mocked(listArticles).mockResolvedValue({ items: [{ id: 'a1', title: 'Judul', slug: 'judul', excerpt: 'ex', content: 'konten panjang', coverImageUrl: null, status: 'PUBLISHED', authorId: 'u1', categoryId: 'c1', publishedAt: new Date('2026-01-01'), createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') } as never], total: 1 })
    const res = await articlesGET(new Request('http://localhost/api/v1/cms/articles?page=1&limit=20'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.meta.total).toBe(1)
  })
})

describe('GET /api/v1/cms/articles/slug/{slug} (contract)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('returns article by slug', async () => {
    vi.mocked(getArticleBySlug).mockResolvedValue({ id: 'a1', title: 'Judul', slug: 'judul', excerpt: null, content: 'konten panjang', coverImageUrl: null, status: 'PUBLISHED', authorId: 'u1', categoryId: 'c1', publishedAt: new Date('2026-01-01'), createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') } as never)
    const res = await slugGET(new Request('http://localhost/api/v1/cms/articles/slug/judul'), { params: Promise.resolve({ slug: 'judul' }) })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data.slug).toBe('judul')
  })
})
