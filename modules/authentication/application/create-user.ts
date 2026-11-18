// modules/authentication/application/create-user.ts
import { auth } from '@/lib/auth'
import { findUserByEmail, setUserRoleAndType } from '../infrastructure/user.repository'
import type { CreateUserInput } from '../domain/user.schema'

export class UserError extends Error {}

// Pola seed: daftarkan lewat better-auth (password di-hash di sana), lalu set role/tipe akun.
export async function createUserAccount(input: CreateUserInput) {
  if (await findUserByEmail(input.email)) throw new UserError('Email sudah terdaftar')

  await auth.api.signUpEmail({
    body: { email: input.email, name: input.name, password: input.password },
  })

  return setUserRoleAndType(input.email, input.role, input.accountType)
}
