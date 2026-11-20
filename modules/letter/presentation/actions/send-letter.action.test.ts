import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sendLetterAction } from './send-letter.action'
import { getSession } from '@/lib/auth'

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(null),
  }),
}))

vi.mock('@/lib/prisma', () => {
  const tx = {
    letterNumberCounter: { upsert: vi.fn() },
    letter: { update: vi.fn() },
    letterLog: { create: vi.fn() },
    auditLog: { create: vi.fn() },
  }
  return {
    prisma: {
      letter: { findFirst: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
      letterPeriod: { findFirst: vi.fn() },
      $transaction: vi.fn(async (cb: (t: typeof tx) => Promise<unknown>) => cb(tx)),
    },
    __tx: tx,
  }
})

import { prisma } from '@/lib/prisma'

describe('sendLetterAction', () => {
  beforeEach(() => {
    vi.mocked(getSession).mockReset()
    vi.mocked(prisma.letter.findFirst).mockReset()
    vi.mocked(prisma.letterPeriod.findFirst).mockReset()
    vi.mocked(prisma.$transaction).mockClear()
  })

  it('returns Unauthorized when no session', async () => {
    vi.mocked(getSession).mockResolvedValue(null as never)
    const fd = new FormData()
    fd.append('letterId', 'abc')
    const res = await sendLetterAction(fd)
    expect(res.success).toBe(false)
    expect(res.code).toBe('UNAUTHORIZED')
  })

  it('returns Forbidden for non-allowed role', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: 'u1', role: 'GURU_BANTU' } } as never)
    const fd = new FormData()
    fd.append('letterId', 'abc')
    const res = await sendLetterAction(fd)
    expect(res.success).toBe(false)
    expect(res.code).toBe('FORBIDDEN')
  })

  it('returns error for missing letterId', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: 'u1', role: 'OWNER' } } as never)
    const fd = new FormData()
    const res = await sendLetterAction(fd)
    expect(res.success).toBe(false)
    expect(res.errors?.letterId).toBeDefined()
  })

  it('returns not found when letter missing', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: 'u1', role: 'OWNER' } } as never)
    vi.mocked(prisma.letter.findFirst).mockResolvedValue(null as never)
    const fd = new FormData()
    fd.append('letterId', 'missing')
    const res = await sendLetterAction(fd)
    expect(res.success).toBe(false)
    expect(res.code).toBe('NOT_FOUND')
  })

  it('returns error when letter already SENT', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: 'u1', role: 'OWNER' } } as never)
    vi.mocked(prisma.letter.findFirst).mockResolvedValue({ id: 'l1', status: 'SENT', periodId: 'p1' } as never)
    const fd = new FormData()
    fd.append('letterId', 'l1')
    const res = await sendLetterAction(fd)
    expect(res.success).toBe(false)
    expect(res.code).toBe('CONFLICT')
  })

  it('sends letter and generates number on success', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: 'u1', role: 'OWNER' } } as never)
    vi.mocked(prisma.letter.findFirst).mockResolvedValue({ id: 'l1', status: 'DIKETIK', periodId: 'p1' } as never)

    const mod = await import('@/lib/prisma')
    const tx = (mod as unknown as { __tx: Record<string, { upsert?: unknown; update?: unknown; create?: unknown }> }).__tx
    ;(tx.letterNumberCounter as { upsert: ReturnType<typeof vi.fn> }).upsert.mockResolvedValue({ currentSeq: 1 })
    ;(tx.letter as { update: ReturnType<typeof vi.fn> }).update.mockResolvedValue({ id: 'l1', status: 'SENT', nomorSurat: '001/PP/H/XI/2026' })
    ;(tx.letterLog as { create: ReturnType<typeof vi.fn> }).create.mockResolvedValue({})
    ;(tx.auditLog as { create: ReturnType<typeof vi.fn> }).create.mockResolvedValue({})

    const fd = new FormData()
    fd.append('letterId', 'l1')
    const res = await sendLetterAction(fd)
    expect(res.success).toBe(true)
    expect(res.data?.status).toBe('SENT')
  })
})