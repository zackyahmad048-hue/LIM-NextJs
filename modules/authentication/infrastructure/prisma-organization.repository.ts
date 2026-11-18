// modules/authentication/infrastructure/prisma-organization.repository.ts
import { prisma } from '@/lib/prisma'
import type { OrganizationRepository } from '@/modules/authentication/domain/organization.repository'

export class PrismaOrganizationRepository implements OrganizationRepository {
  async findUnitNameByUserId(userId: string): Promise<string | null> {
    const account = await prisma.organizationalAccount.findUnique({
      where: { userId },
      select: { unit: { select: { namaUnit: true } } },
    })
    return account?.unit.namaUnit ?? null
  }
}
