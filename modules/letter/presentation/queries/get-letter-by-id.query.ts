// modules/letter/presentation/queries/get-letter-by-id.query.ts
import { prisma } from '@/lib/prisma'

export async function getLetterById(id: string) {
  return prisma.letter.findFirst({ where: { id, deletedAt: null } })
}