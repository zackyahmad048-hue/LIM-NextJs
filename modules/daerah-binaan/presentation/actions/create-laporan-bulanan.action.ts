// modules/daerah-binaan/presentation/actions/create-laporan-bulanan.action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { Role } from '@/generated/client'
import { getSession } from '@/lib/auth'
import { createLaporanBulananSchema } from '@/modules/daerah-binaan/domain/daerah-binaan.schema'
import { createLaporanBulanan } from '@/modules/daerah-binaan/application/daerah-binaan'
import { PrismaDaerahBinaanRepository } from '@/modules/daerah-binaan/infrastructure/prisma-daerah-binaan.repository'
import type { ActionResult } from '@/types/api'
import type { LaporanBulananBinaan } from '@/generated/client'
import type { LIMSession } from '@/types/auth'

const ALLOWED: Role[] = ['OWNER', 'PW', 'PC']

export async function createLaporanBulananAction(formData: FormData): Promise<ActionResult<LaporanBulananBinaan>> {
  const raw = Object.fromEntries(formData)
  const parsed = createLaporanBulananSchema.safeParse({
    ...raw,
    bulan: raw.bulan ? Number(raw.bulan) : raw.bulan,
    tahun: raw.tahun ? Number(raw.tahun) : raw.tahun,
    jumlahPesertaEstimasi: raw.jumlahPesertaEstimasi ? Number(raw.jumlahPesertaEstimasi) : undefined,
  })
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }

  const session = (await getSession()) as LIMSession | null
  if (!session) return { success: false, error: 'Unauthorized' }
  if (!ALLOWED.includes(session.user.role)) return { success: false, error: 'Forbidden' }

  if (session.user.role === 'PW' || session.user.role === 'PC') {
    const { prisma } = await import('@/lib/prisma')
    const daerah = await prisma.daerahBinaan.findUnique({ where: { id: parsed.data.daerahBinaanId } })
    if (!daerah) return { success: false, error: 'Daerah binaan tidak ditemukan' }
    const orgAccount = await prisma.organizationalAccount.findUnique({
      where: { userId: session.user.id },
      include: { unit: true },
    })
    const unitWilayah = orgAccount?.unit?.wilayah
    if (!unitWilayah) return { success: false, error: 'Forbidden: Akun organisasi tidak terhubung ke unit' }
    const inWilayah = session.user.role === 'PW'
      ? daerah.provinsi === unitWilayah
      : daerah.kabupaten === unitWilayah
    if (!inWilayah) return { success: false, error: 'Forbidden: Di luar wilayah Anda' }
  }

  try {
    const repo = new PrismaDaerahBinaanRepository()
    const result = await createLaporanBulanan(repo, parsed.data, session.user.id)
    revalidatePath('/dashboard/binaan/laporan', 'page')
    return { success: true, data: result }
  } catch (error) {
    console.error('[createLaporanBulananAction]', error)
    return { success: false, error: 'Gagal mengirim laporan bulanan' }
  }
}