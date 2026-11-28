import { describe, it, expect, beforeEach, vi } from 'vitest'
import { submitForReviewAction } from './submit-for-review.action'
import { approveLetterAction } from './approve-letter.action'
import { getSession } from '@/lib/auth'

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
  runWithSessionTenant: vi.fn(async (_s: unknown, fn: () => Promise<unknown>) => fn()),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }))
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({ get: vi.fn().mockReturnValue(null) }),
}))
vi.mock('@/lib/prisma', () => {
  const tx = {
    letter: { update: vi.fn() },
    letterLog: { create: vi.fn() },
    auditLog: { create: vi.fn() },
  }
  return {
    prisma: {
      letter: { findUnique: vi.fn(), findFirst: vi.fn() },
      $transaction: vi.fn(async (cb: (t: typeof tx) => Promise<unknown>) => cb(tx)),
    },
    __tx: tx,
  }
})

import { prisma } from '@/lib/prisma'

describe('submitForReviewAction', () => {
  beforeEach(() => {
    vi.mocked(getSession).mockReset()
    vi.mocked(prisma.letter.findFirst).mockReset()
    vi.mocked(prisma.$transaction).mockClear()
  })

  it('unauthorized', async () => {
    vi.mocked(getSession).mockResolvedValue(null as never)
    const fd = new FormData(); fd.append('letterId', 'l1')
    const r = await submitForReviewAction(fd)
    expect(r.success).toBe(false)
  })

  it('rejects non-draft status', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: 'u1', role: 'OWNER' } } as never)
    vi.mocked(prisma.letter.findFirst).mockResolvedValue({ id: 'l1', status: 'SENT' } as never)
    const fd = new FormData(); fd.append('letterId', 'l1')
    const r = await submitForReviewAction(fd)
    expect(r.success).toBe(false)
    expect(r.error).toContain('tidak dapat dikirim')
  })

  it('transitions DIKETIK -> REVIEW', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: 'u1', role: 'OWNER' } } as never)
    vi.mocked(prisma.letter.findFirst).mockResolvedValue({ id: 'l1', status: 'DIKETIK' } as never)
    const mod = await import('@/lib/prisma')
    const tx = (mod as unknown as { __tx: { letter: { update: ReturnType<typeof vi.fn> }; letterLog: { create: ReturnType<typeof vi.fn> }; auditLog: { create: ReturnType<typeof vi.fn> } } }).__tx
    tx.letter.update.mockResolvedValue({ id: 'l1', status: 'REVIEW' })
    tx.letterLog.create.mockResolvedValue({})
    tx.auditLog.create.mockResolvedValue({})
    const fd = new FormData(); fd.append('letterId', 'l1')
    const r = await submitForReviewAction(fd)
    expect(r.success).toBe(true)
    expect(r.data?.status).toBe('REVIEW')
  })
})

describe('approveLetterAction', () => {
  beforeEach(() => {
    vi.mocked(getSession).mockReset()
    vi.mocked(prisma.letter.findFirst).mockReset()
    vi.mocked(prisma.$transaction).mockClear()
  })

  it('forbidden for non-allowed role', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: 'u1', role: 'GURU_BANTU' } } as never)
    const fd = new FormData(); fd.append('letterId', 'l1')
    const r = await approveLetterAction(fd)
    expect(r.success).toBe(false)
  })

  it('rejects non-review status', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: 'u1', role: 'OWNER' } } as never)
    vi.mocked(prisma.letter.findFirst).mockResolvedValue({ id: 'l1', status: 'DIKETIK' } as never)
    const fd = new FormData(); fd.append('letterId', 'l1')
    const r = await approveLetterAction(fd)
    expect(r.success).toBe(false)
  })

  it('transitions REVIEW -> APPROVED', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: 'u1', role: 'OWNER' } } as never)
    vi.mocked(prisma.letter.findFirst).mockResolvedValue({ id: 'l1', status: 'REVIEW' } as never)
    const mod = await import('@/lib/prisma')
    const tx = (mod as unknown as { __tx: { letter: { update: ReturnType<typeof vi.fn> }; letterLog: { create: ReturnType<typeof vi.fn> }; auditLog: { create: ReturnType<typeof vi.fn> } } }).__tx
    tx.letter.update.mockResolvedValue({ id: 'l1', status: 'APPROVED' })
    tx.letterLog.create.mockResolvedValue({})
    tx.auditLog.create.mockResolvedValue({})
    const fd = new FormData(); fd.append('letterId', 'l1')
    const r = await approveLetterAction(fd)
    expect(r.success).toBe(true)
    expect(r.data?.status).toBe('APPROVED')
  })
})