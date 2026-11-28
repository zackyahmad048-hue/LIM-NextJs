// modules/wajib-khidmah/presentation/actions/submit-laporan.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession, runWithSessionTenant } from '@/lib/auth'
import { submitLaporanSchema } from '@/modules/wajib-khidmah/domain/laporan-mingguan.schema'
import { submitLaporan, SubmitLaporanError } from '@/modules/wajib-khidmah/application/submit-laporan'
import { PrismaLaporanRepository } from '@/modules/wajib-khidmah/infrastructure/prisma-laporan.repository'
import type { ActionResult } from '@/types/api'
import type { LaporanMingguan } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

export async function submitLaporanAction(
  formData: FormData
): Promise<ActionResult<LaporanMingguan>> {
  const rawData = Object.fromEntries(formData)
  const parsedRaw = {
    ...rawData,
    periodeMinggu: Number(rawData.periodeMinggu),
    periodeTahun: Number(rawData.periodeTahun),
    jumlahHariHadir: Number(rawData.jumlahHariHadir),
    jumlahJamaahDilakukan: Number(rawData.jumlahJamaahDilakukan),
  }
  const parsedForm = submitLaporanSchema.safeParse(parsedRaw)
  if (!parsedForm.success) {
    return { success: false, errors: parsedForm.error.flatten().fieldErrors }
  }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized: Silakan login terlebih dahulu' }

  return runWithSessionTenant(session, async () => {
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'

    try {
      const repo = new PrismaLaporanRepository()
      const result = await submitLaporan(repo, parsedForm.data, session, ipAddress)
      revalidatePath('/dashboard/wajib-khidmah/laporan', 'page')
      revalidatePath('/dashboard/wajib-khidmah/penugasan', 'page')
      return { success: true, data: result }
    } catch (error) {
      console.error('[submitLaporanAction] Error:', error)
      if (error instanceof SubmitLaporanError) {
        return { success: false, error: error.message }
      }
      if (error instanceof z.ZodError) {
        return { success: false, errors: error.flatten().fieldErrors }
      }
      const { Prisma } = await import('@/generated/client')
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') return { success: false, error: 'Laporan untuk periode ini sudah ada (duplikasi)' }
        if (error.code === 'P2025') return { success: false, error: 'Data referensi tidak ditemukan. Silakan muat ulang halaman.' }
      }
      return { success: false, error: 'Gagal mengirim laporan. Silakan coba lagi.' }
    }
  })
}

// runCrossCheckAction tetap di sini (pusat-only, lihat catatan scoping).
export async function runCrossCheckAction(
  penugasanId: string,
  periodeMinggu: number,
  periodeTahun: number
): Promise<ActionResult<{ hasMismatch: boolean; summary: { selisihHari: number; selisihJamaah: number } }>> {
  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }

  const allowedRoles = ['OWNER', 'ADMIN_SEKRETARIAT', 'TIM_WAJIB_KHIDMAH', 'PW', 'PC']
  if (!allowedRoles.includes(session.user.role)) {
    return { success: false, error: 'Forbidden: Anda tidak memiliki izin untuk menjalankan cross-check' }
  }

  return runWithSessionTenant(session, async () => {
    try {
      if (session.user.role === 'PW' || session.user.role === 'PC') {
        const penugasan = await prisma.penugasan.findUnique({
          where: { id: penugasanId },
          include: { lembaga: { select: { provinsi: true, kabupaten: true } } },
        })
        if (!penugasan) return { success: false, error: 'Penugasan tidak ditemukan' }
        const orgAccount = await prisma.organizationalAccount.findUnique({
          where: { userId: session.user.id },
          include: { unit: true },
        })
        const unitWilayah = orgAccount?.unit?.wilayah
        if (!unitWilayah) return { success: false, error: 'Forbidden: Akun organisasi tidak terhubung ke unit' }
        const inWilayah = session.user.role === 'PW'
          ? penugasan.lembaga.provinsi === unitWilayah
          : penugasan.lembaga.kabupaten === unitWilayah
        if (!inWilayah) return { success: false, error: 'Forbidden: Penugasan di luar wilayah Anda' }
      }

      const [laporanGuru, laporanLembaga] = await Promise.all([
        prisma.laporanMingguan.findFirst({ where: { penugasanId, rolePelapor: 'GURU_BANTU', periodeMinggu, periodeTahun } }),
        prisma.laporanMingguan.findFirst({ where: { penugasanId, rolePelapor: 'LEMBAGA_EKSTERNAL', periodeMinggu, periodeTahun } }),
      ])

      const toLaporanData = (r: typeof laporanGuru) =>
        r ? {
          id: r.id, pelaporId: r.pelaporId,
          rolePelapor: r.rolePelapor as 'GURU_BANTU' | 'LEMBAGA_EKSTERNAL',
          periodeMinggu: r.periodeMinggu, periodeTahun: r.periodeTahun,
          jumlahHariHadir: r.jumlahHariHadir, jumlahJamaahDilakukan: r.jumlahJamaahDilakukan,
          aktivitasMingguan: r.aktivitasMingguan,
          statusHonor: r.statusHonor as 'SUDAH_SESUAI' | 'BELUM' | 'SEBAGIAN' | 'TIDAK_BERLAKU',
        } : null

      const { crossCheckLaporan } = await import('@/modules/wajib-khidmah/domain/cross-check.rules')
      const result = crossCheckLaporan(toLaporanData(laporanGuru), toLaporanData(laporanLembaga))
      return { success: true, data: { hasMismatch: result.hasMismatch, summary: { selisihHari: result.summary.selisihHari, selisihJamaah: result.summary.selisihJamaah } } }
    } catch (error) {
      console.error('[runCrossCheckAction] Error:', error)
      return { success: false, error: 'Gagal menjalankan cross-check' }
    }
  })
}