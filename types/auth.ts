// src/types/auth.ts
import type { Role, AccountType } from '@/generated/client'

// Definisikan tipe User sesuai dengan schema Prisma + Better Auth default
export interface LIMUser {
  id: string
  email: string
  emailVerified: boolean
  name: string
  image?: string | null
  role: Role
  accountType: AccountType
  createdAt: Date
  updatedAt: Date
}

// Definisikan tipe Session lengkap
export interface LIMSession {
  user: LIMUser
  session: {
    id: string
    userId: string
    expiresAt: Date
    token: string
    createdAt: Date
    updatedAt: Date
    ipAddress?: string | null
    userAgent?: string | null
  }
}