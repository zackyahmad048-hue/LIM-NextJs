import { describe, it, expect, beforeEach, vi } from 'vitest'
import { submitLaporanAction } from './submit-laporan.action'
import { getSession } from '@/lib/auth'

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
  runWithSessionTenant: vi.fn(async (_s: unknown, fn: () => Promise<unknown>) => fn()),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }))
vi.mock('next/headers', () => ({ headers: vi.fn().mockResolvedValue({ get: () => null }) }))

vi.mock('@/lib/prisma', () => {
  const tx = {
    laporanMingguan: { create: vi.fn() },
    auditLog: { create: vi.fn() },
  }
  return {
    prisma: {
      penugasan: { findUnique: vi.fn() },
      laporanMingguan: { findFirst: vi.fn() },
      $transaction: vi.fn(async (cb: (t: typeof tx) => Promise<unknown>) => cb(tx)),
    },
    __tx: tx,
  }
})

import { prisma } from '@/lib/prisma'

describe('submitLaporanAction', () => {
  beforeEach(() => {
    vi.mocked(getSession).mockReset()
    vi.mocked(prisma.penugasan.findUnique).mockReset()
    vi.mocked(prisma.laporanMingguan.findFirst).mockReset()
    vi.mocked(prisma.$transaction).mockClear()
  })

  it('unauthorized', async () => {
    vi.mocked(getSession).mockResolvedValue(null as never)
    const fd = new FormData(); fd.append('penugasanId', 'p1')
    const r = await submitLaporanAction(fd)
    expect(r.success).toBe(false)
  })

  it('rejects invalid numeric input', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: 'u1', role: 'GURU_BANTU' } } as never)
    const fd = new FormData(); fd.append('penugasanId', 'p1')
    const r = await submitLaporanAction(fd)
    expect(r.success).toBe(false)
  })

  it('rejects when penugasan not found', async () => {
    vi.mocked(getSession).mockResolvedValue({ user: { id: 'u1', role: 'GURU_BANTU' } } as never)
    vi.mocked(prisma.penugasan.findUnique).mockResolvedValue(null as never)
    const fd = new FormData()
    fd.append('penugasanId', 'p1')
    fd.append('periodeMinggu', '1'); fd.append('periodeTahun', '2026')
    fd.append('jumlahHariHadir', '5'); fd.append('jumlahJamaahDilakukan', '10')
    fd.append('aktivitasMingguan', 'Mengajar Nahwu dan Sharaf')
    fd.append('statusHonor', 'BELUM')
    fd.append('namaPengisi', 'Ahmad'); fd.append('jabatanPengisi', 'Guru')
    const r = await submitLaporanAction(fd)
    expect(r.success).toBe(false)
    expect(r.error).toContain('tidak ditemukan')
  })
})