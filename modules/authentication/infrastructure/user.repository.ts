// modules/authentication/infrastructure/user.repository.ts
// Satu-satunya lapisan yang menyentuh Prisma untuk manajemen akun.
import { prisma } from '@/lib/prisma'
import type { AccountType, Role } from '@/generated/client'

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, select: { id: true } })
}

export function listUsers() {
  return prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      accountType: true,
      createdAt: true,
    },
  })
}

export function setUserRoleAndType(email: string, role: Role, accountType: AccountType) {
  return prisma.user.update({
    where: { email },
    data: { role, accountType, emailVerified: true },
    select: { id: true },
  })
}
