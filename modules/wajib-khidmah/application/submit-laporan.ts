// modules/wajib-khidmah/application/submit-laporan.ts
import type { LaporanRepository, CreateLaporanData } from '@/modules/wajib-khidmah/domain/laporan.repository'
import type { SubmitLaporanInput } from '@/modules/wajib-khidmah/domain/laporan-mingguan.schema'

export class SubmitLaporanError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SubmitLaporanError'
  }
}

export async function submitLaporan(
  repo: LaporanRepository,
  input: SubmitLaporanInput,
  session: { user: { id: string; role: string } },
  ipAddress: string
) {
  if (session.user.role !== 'GURU_BANTU' && session.user.role !== 'LEMBAGA_EKSTERNAL') {
    throw new SubmitLaporanError('Forbidden: Hanya Guru Bantu atau Lembaga Eksternal yang dapat mengirim laporan')
  }

  const penugasan = await repo.findPenugasan(input.penugasanId)
  if (!penugasan) throw new SubmitLaporanError('Penugasan tidak ditemukan')

  if (penugasan.lembaga.status !== 'MITRA_AKTIF') {
    const msgs: Record<string, string> = { CALON: 'Lembaga masih dalam status calon dan belum diverifikasi', NON_AKTIF: 'Lembaga tidak aktif' }
    throw new SubmitLaporanError(msgs[penugasan.lembaga.status] || 'Lembaga tidak memenuhi syarat untuk mengirim laporan')
  }

  if (session.user.role === 'GURU_BANTU' && penugasan.guruBantu.userId !== session.user.id) {
    throw new SubmitLaporanError('Forbidden: Anda tidak memiliki akses ke penugasan ini')
  }
  if (session.user.role === 'LEMBAGA_EKSTERNAL' && penugasan.lembaga.userId !== session.user.id) {
    throw new SubmitLaporanError('Forbidden: Anda tidak memiliki akses ke penugasan ini')
  }

  if (penugasan.status !== 'DIAKTIFKAN') {
    throw new SubmitLaporanError(`Penugasan tidak aktif (status: ${penugasan.status}). Laporan tidak dapat dikirim.`)
  }

  const existing = await repo.findDuplicate(input.penugasanId, session.user.id, input.periodeMinggu, input.periodeTahun)
  if (existing) {
    throw new SubmitLaporanError(`Laporan untuk minggu ${input.periodeMinggu}/${input.periodeTahun} sudah pernah dikirim`)
  }

  const data: CreateLaporanData = {
    penugasanId: input.penugasanId,
    pelaporId: session.user.id,
    rolePelapor: session.user.role as 'GURU_BANTU' | 'LEMBAGA_EKSTERNAL',
    namaPengisi: input.namaPengisi,
    jabatanPengisi: input.jabatanPengisi,
    periodeMinggu: input.periodeMinggu,
    periodeTahun: input.periodeTahun,
    jumlahHariHadir: input.jumlahHariHadir,
    keteranganAbsensi: input.keteranganAbsensi,
    jumlahJamaahDilakukan: input.jumlahJamaahDilakukan,
    aktivitasMingguan: input.aktivitasMingguan,
    kendala: input.kendala,
    statusHonor: input.statusHonor,
  }

  const laporan = await repo.create(data)

  // Audit log via prisma directly (infra concern) — keep here for simplicity.
  const { prisma } = await import('@/lib/prisma')
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'LAPORAN_MINGGUAN_SUBMITTED',
      entity: 'LaporanMingguan',
      entityId: laporan.id,
      metadata: JSON.stringify({
        penugasanId: input.penugasanId,
        periode: `${input.periodeMinggu}/${input.periodeTahun}`,
        rolePelapor: session.user.role,
        jumlahJamaah: input.jumlahJamaahDilakukan,
      }),
      ipAddress,
    },
  })

  return laporan
}