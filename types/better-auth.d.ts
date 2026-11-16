// src/types/better-auth.d.ts
import type { Role, AccountType } from '@/generated/client'

declare module 'better-auth' {
  interface User {
    role: Role
    accountType: AccountType
  }
  
  interface Session {
    user: User
  }
}