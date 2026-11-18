import { prisma } from '@/lib/prisma'

// Data bukti publik untuk verifikasi surat (tanpa isi surat)
export async function getLetterForVerification(slug: string) {
  return prisma.letter.findFirst({
    where: { verificationSlug: slug, deletedAt: null },
    select: {
      id: true,
      nomorSurat: true,
      perihal: true,
      pengirim: true,
      tanggalSurat: true,
      status: true,
    },
  })
}
