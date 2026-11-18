// modules/authentication/presentation/queries/get-user-scope.query.ts
import { getUserScope, type UserScope } from '@/modules/authentication/application/get-user-scope'
import { PrismaOrganizationRepository } from '@/modules/authentication/infrastructure/prisma-organization.repository'
import type { Role, AccountType } from '@/generated/client'

export type { UserScope }

export async function getUserScopeQuery(user: { id: string; role: Role; accountType?: AccountType }): Promise<UserScope> {
  return getUserScope(new PrismaOrganizationRepository(), user)
}
