// modules/letter/presentation/queries/get-letter-by-id.query.ts
import { prisma } from '@/lib/prisma'
import { letterScopeWhere, type LetterActor } from '@/modules/letter/presentation/queries/letter-scope'

export async function getLetterById(id: string, actor: LetterActor) {
  return prisma.letter.findFirst({ where: { id, deletedAt: null, ...letterScopeWhere(actor) } })
}
