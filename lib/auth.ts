// src/lib/auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { apiKey } from '@better-auth/api-key'
import { prisma } from '@/lib/prisma'
import type { LIMSession } from '@/types/auth'

// Deployment bisa diakses dari beberapa host (domain produksi, branch/preview Vercel, localhost).
const appUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL
const allowedHosts = [
  'localhost:*',
  process.env.VERCEL_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ...(process.env.BETTER_AUTH_ALLOWED_HOSTS ?? '').split(',').map((host) => host.trim()),
].filter((host): host is string => Boolean(host))

export const auth = betterAuth({
  baseURL: {
    allowedHosts,
    ...(appUrl ? { fallback: appUrl } : {}),
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

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
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'GURU_BANTU',
        input: false,
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

  plugins: [
    apiKey({
      enableSessionForAPIKeys: false,
      customAPIKeyGetter: (ctx) => {
        const headers = ctx.headers
        if (!headers) return null
        const direct = headers.get('x-api-key')
        if (direct) return direct
        const authz = headers.get('authorization')
        if (!authz) return null
        const [scheme, value] = authz.split(/\s+/, 2)
        if (scheme?.toLowerCase() === 'bearer' && value) return value
        return null
      },
    }),
  ],

  advanced: {
    defaultCookieAttributes: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    },
  },
})

// Helper function untuk mendapatkan session
export async function getSession(): Promise<LIMSession | null> {
  const { headers } = await import('next/headers')
  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList,
  })

  return session as LIMSession | null
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}

// ✅ TAMBAHKAN INI: Type inference untuk session dengan field custom
export type AuthSession = typeof auth.$Infer.Session