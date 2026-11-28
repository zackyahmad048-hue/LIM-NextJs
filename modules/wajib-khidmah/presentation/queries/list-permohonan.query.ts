import { prisma } from '@/lib/prisma'

export function listPermohonanPending(limit = 50) {
  return prisma.permohonanGuruBantu.findMany({
    where: { statusPermohonan: 'DIAJUKAN' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      namaLembagaPendidikan: true,
      kabupatenKota: true,
      provinsi: true,
      jumlahGuruDiminta: true,
      createdAt: true,
    },
  })
}
