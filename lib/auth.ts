// src/lib/auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { twoFactor } from 'better-auth/plugins'
import { prisma } from '@/lib/prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [twoFactor()],

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  user: {
    modelName: 'User',
    fields: {
      name: 'name',
      email: 'email',
      emailVerified: 'emailVerified',
      image: 'image',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    // ✅ TAMBAHKAN INI: Beritahu Better Auth tentang field custom
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'GURU_BANTU',
        input: false, // Tidak bisa di-set via register (hanya via admin)
      },
      accountType: {
        type: 'string',
        required: true,
        defaultValue: 'PERSONAL',
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // shortcut: belum ada SMTP — tautan reset dicetak ke log server; pasang provider email (mis. Resend) untuk produksi
    sendResetPassword: async ({ user, url }) => {
      console.info(`[auth] Tautan reset password untuk ${user.email}: ${url}`)
    },
  },

  advanced: {
    defaultCookieAttributes: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    },
  },
})

// Helper function untuk mendapatkan session
export async function getSession() {
  const { headers } = await import('next/headers')
  const headersList = await headers()
  
  const session = await auth.api.getSession({
    headers: headersList,
  })
  
  return session
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

// ✅ TAMBAHKAN INI: Type inference untuk session dengan field custom
export type AuthSession = typeof auth.$Infer.Session