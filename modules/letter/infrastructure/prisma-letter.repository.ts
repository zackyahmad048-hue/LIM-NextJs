// modules/letter/infrastructure/prisma-letter.repository.ts
import { prisma } from '@/lib/prisma'
import type { LetterRepository, CreateLetterData } from '@/modules/letter/domain/letter.repository'
import type { Letter, LetterStatus, LetterType } from '@/generated/client'

export class PrismaLetterRepository implements LetterRepository {
  async create(data: CreateLetterData): Promise<Letter> {
    return prisma.letter.create({
      data: {
        type: data.type,
        pengirim: data.pengirim,
        penerima: data.penerima,
        perihal: data.perihal,
        isiSurat: data.isiSurat,
        status: 'DIKETIK',
        createdById: data.createdById,
      },
    })
  }

  async findById(id: string): Promise<Letter | null> {
    return prisma.letter.findUnique({ where: { id } })
  }

  async findMany(filter: {
    status?: LetterStatus
    type?: LetterType
    q?: string
    skip: number
    take: number
  }): Promise<{ items: Letter[]; total: number }> {
    const where: Record<string, unknown> = {}
    if (filter.status) where.status = filter.status
    if (filter.type) where.type = filter.type
    if (filter.q) {
      where.OR = [
        { perihal: { contains: filter.q, mode: 'insensitive' } },
        { nomorSurat: { contains: filter.q, mode: 'insensitive' } },
      ]
    }
    const [items, total] = await Promise.all([
      prisma.letter.findMany({ where, skip: filter.skip, take: filter.take, orderBy: { createdAt: 'desc' } }),
      prisma.letter.count({ where }),
    ])
    return { items, total }
  }

  async updateStatus(id: string, status: LetterStatus, extra?: Partial<Letter>): Promise<Letter> {
    return prisma.letter.update({ where: { id }, data: { status, ...extra } })
  }
}