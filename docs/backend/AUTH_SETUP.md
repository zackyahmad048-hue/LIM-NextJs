# BETTER AUTH SETUP & SEED DATA

**Project:** LIM Digital Platform  
**Version:** 1.1  
**Status:** Approved  
**Document Type:** Authentication & Initial Data Setup  

---

## 📑 Daftar Isi
1. [Tujuan](#1-tujuan)
2. [Install Better Auth](#2-install-better-auth)
3. [Konfigurasi Better Auth](#3-konfigurasi-better-auth)
4. [Setup Session & Proxy (Next.js 16)](#4-setup-session--proxy-nextjs-16)
5. [Script Seed Data](#5-script-seed-data)
6. [Cara Menjalankan Seed](#6-cara-menjalankan-seed)
7. [Testing Login](#7-testing-login)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Tujuan

Dokumen ini memandu setup sistem autentikasi menggunakan Better Auth dan pengisian data awal (seed) ke database Neon. Setelah mengikuti panduan ini, Anda akan memiliki:

- Sistem login/register yang berfungsi.
- Session management yang aman.
- Route protection via `proxy.ts` (Next.js 16).
- 1 User Owner untuk testing.
- 1 Periode Khidmat aktif (2024-2029).
- Struktur organisasi dasar (PP, PW Jawa Timur, PC Surabaya).

---

## 2. Install Better Auth

### 2.1 Install Dependencies

```bash
bun add better-auth
bun add -d @types/node
```

### 2.2 Environment Variables

Tambahkan ke file `.env:`

```.env
# === BETTER AUTH ===
BETTER_AUTH_SECRET="your-super-secret-key-min-32-chars-change-this"
BETTER_AUTH_URL="http://localhost:3000"

# === DATABASE (sudah ada) ===
DATABASE_URL="postgresql://..."
```
**Generate Secret Key:**

```bash
# Linux/Mac
openssl rand -base64 32

# Atau gunakan online generator
# https://generate-secret.vercel.app/32
```
---
## 3. Konfigurasi Better Auth

### 3.1 File Konfigurasi Utama

Buat file `src/lib/auth.ts:`

```typescript
// src/lib/auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/lib/prisma'

export const auth = betterAuth({
  // Database adapter
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // User configuration
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
        input: false, // Tidak bisa di-set via register
      },
      accountType: {
        type: 'string',
        required: true,
        defaultValue: 'PERSONAL',
        input: false,
      },
    },
  },

  // Email & Password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disable untuk MVP
    minPasswordLength: 8,
    maxPasswordLength: 128,
    async sendResetPassword({ user, url }) {
      // TODO: Implement email sending (Resend/Brevo)
      console.log(`[Password Reset] ${user.email}: ${url}`)
    },
  },

  // Social providers (optional, untuk masa depan)
  socialProviders: {
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // },
  },

  // Advanced configuration
  advanced: {
    generateId: () => crypto.randomUUID(),
    defaultCookieAttributes: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    },
  },

  // Plugins
  plugins: [
    // Add plugins here if needed
  ],
})

// Helper function untuk mendapatkan session
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await import('next/headers').then(m => m.headers()),
  })
  return session
}

// Helper function untuk mendapatkan current user
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

// Type exports
export type Session = typeof auth.$Infer.Session
```
### 3.2 Prisma Client Singleton

Buat file `src/lib/prisma.ts:`

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@/generated/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```
---

## 4. Setup Session & Middleware

### 4.1 Proxy untuk Protected Routes (Next.js 16)

**PENTING**: Next.js 16 menggunakan `proxy.ts`, BUKAN `middleware.ts` seperti Next.js 15.

Buat file `src/proxy.ts:`

```typescript
// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'

// Routes yang butuh authentication
const protectedRoutes = ['/dashboard', '/admin', '/profile']

// Routes yang butuh specific role
const roleBasedRoutes = {
  '/admin': ['OWNER', 'ADMIN_SEKRETARIAT', 'TIM_WAJIB_KHIDMAH'],
  '/admin/safari': ['OWNER', 'ADMIN_BIDANG_SAFARI'],
  '/admin/pesantren': ['OWNER', 'ADMIN_BIDANG_PESANTREN_RAMADAN'],
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Cek apakah route perlu protection
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (!isProtected) {
    return NextResponse.next()
  }

  // Get session
  const session = await getSession()

  // Redirect ke login jika tidak ada session
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Cek role-based access
  for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(session.user.role)) {
        // Redirect ke dashboard dengan error
        return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}
```

### 4.2 Auth Routes (Next.js App Router)

Buat file `src/app/api/auth/[...all]/route.ts`:

```typescript
// src/app/api/auth/[...all]/route.ts
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)
```
---

## 5. Script Seed Data

### 5.1 File Seed Utama

Buat file `prisma/seed.ts`:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@/generated/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Create Owner User
  const ownerPassword = await hash('owner123', 12)
  const owner = await prisma.user.upsert({
    where: { email: 'owner@lim.or.id' },
    update: {},
    create: {
      email: 'owner@lim.or.id',
      name: 'Super Admin LIM',
      password: ownerPassword,
      role: 'OWNER',
      accountType: 'PERSONAL',
      emailVerified: true,
    },
  })
  console.log('✅ Created owner:', owner.email)

  // 2. Create Admin Sekretariat
  const sekretariatPassword = await hash('sekretariat123', 12)
  const sekretariat = await prisma.user.upsert({
    where: { email: 'sekretariat@lim.or.id' },
    update: {},
    create: {
      email: 'sekretariat@lim.or.id',
      name: 'Admin Sekretariat',
      password: sekretariatPassword,
      role: 'ADMIN_SEKRETARIAT',
      accountType: 'PERSONAL',
      emailVerified: true,
    },
  })
  console.log('✅ Created sekretariat:', sekretariat.email)

  // 3. Create Periode Khidmat
  const periode = await prisma.periodeKhidmat.upsert({
    where: { id: 'periode-2024-2029' },
    update: {},
    create: {
      id: 'periode-2024-2029',
      namaPeriode: 'Khidmat 2024-2029',
      tahunMulai: 2024,
      tahunSelesai: 2029,
      isActive: true,
    },
  })
  console.log('✅ Created periode:', periode.namaPeriode)

  // 4. Create Unit Organisasi (PP)
  const pp = await prisma.unitOrganisasi.upsert({
    where: { levelCode: 'PP' },
    update: {},
    create: {
      namaUnit: 'Pengurus Pusat LIM',
      levelCode: 'PP',
      wilayah: 'Pusat',
      deskripsi: 'Pengurus Pusat Lembaga Ittihadul Muballighin',
    },
  })
  console.log('✅ Created PP:', pp.namaUnit)

  // 5. Create Bidang-bidang PP
  const bidangData = [
    { namaBidang: 'Safari Dakwah Rutinan', kodeBidang: 'PP.I', urutan: 1 },
    { namaBidang: 'Wajib Khidmah', kodeBidang: 'PP.II', urutan: 2 },
    { namaBidang: 'Pesantren Ramadan', kodeBidang: 'PP.III', urutan: 3 },
    { namaBidang: 'Dakwah Digital', kodeBidang: 'PP.IV', urutan: 4 },
    { namaBidang: 'Daerah Binaan', kodeBidang: 'PP.V', urutan: 5 },
  ]

  for (const bidang of bidangData) {
    await prisma.bidang.upsert({
      where: { kodeBidang: bidang.kodeBidang },
      update: {},
      create: bidang,
    })
  }
  console.log('✅ Created 5 bidang')

  // 6. Create Jabatan PP
  const jabatanPP = [
    { namaJabatan: 'Ketua', urutanTampilan: 1 },
    { namaJabatan: 'Wakil Ketua', urutanTampilan: 2 },
    { namaJabatan: 'Sekretaris', urutanTampilan: 3 },
    { namaJabatan: 'Bendahara', urutanTampilan: 4 },
  ]

  for (const jabatan of jabatanPP) {
    await prisma.jabatan.upsert({
      where: { unitId_namaJabatan: { unitId: pp.id, namaJabatan: jabatan.namaJabatan } },
      update: {},
      create: {
        unitId: pp.id,
        namaJabatan: jabatan.namaJabatan,
        urutanTampilan: jabatan.urutanTampilan,
      },
    })
  }
  console.log('✅ Created jabatan PP')

  // 7. Assign Owner to PP as Ketua
  const ketuaJabatan = await prisma.jabatan.findFirst({
    where: { unitId: pp.id, namaJabatan: 'Ketua' },
  })

  if (ketuaJabatan) {
    await prisma.penugasanStruktural.upsert({
      where: {
        userId_jabatanId_periodeId: {
          userId: owner.id,
          jabatanId: ketuaJabatan.id,
          periodeId: periode.id,
        },
      },
      update: {},
      create: {
        userId: owner.id,
        jabatanId: ketuaJabatan.id,
        periodeId: periode.id,
        isActive: true,
      },
    })
    console.log('✅ Assigned owner as Ketua PP')
  }

  // 8. Create PW Jawa Timur (contoh)
  const pwJatim = await prisma.unitOrganisasi.upsert({
    where: { levelCode: 'PW.I' },
    update: {},
    create: {
      namaUnit: 'Pengurus Wilayah LIM Jawa Timur',
      levelCode: 'PW.I',
      wilayah: 'Jawa Timur',
      deskripsi: 'PW LIM untuk wilayah Jawa Timur',
    },
  })
  console.log('✅ Created PW Jawa Timur')

  // 9. Create PW User (Organizational Account)
  const pwPassword = await hash('pwjatim123', 12)
  const pwUser = await prisma.user.upsert({
    where: { email: 'pw.jatim@lim.or.id' },
    update: {},
    create: {
      email: 'pw.jatim@lim.or.id',
      name: 'PW LIM Jawa Timur',
      password: pwPassword,
      role: 'PW',
      accountType: 'ORGANIZATIONAL',
      emailVerified: true,
    },
  })

  // Link PW User to Unit Organisasi
  await prisma.organizationalAccount.upsert({
    where: { userId: pwUser.id },
    update: {},
    create: {
      userId: pwUser.id,
      unitId: pwJatim.id,
    },
  })
  console.log('✅ Created PW user & linked to unit')

  // 10. Create PC Surabaya (contoh)
  const pcSurabaya = await prisma.unitOrganisasi.upsert({
    where: { levelCode: 'PC.I.1' },
    update: {},
    create: {
      namaUnit: 'Pengurus Cabang LIM Surabaya',
      levelCode: 'PC.I.1',
      wilayah: 'Surabaya',
      deskripsi: 'PC LIM untuk wilayah Surabaya',
    },
  })
  console.log('✅ Created PC Surabaya')

  // 11. Create PC User (Organizational Account)
  const pcPassword = await hash('pcsurabaya123', 12)
  const pcUser = await prisma.user.upsert({
    where: { email: 'pc.surabaya@lim.or.id' },
    update: {},
    create: {
      email: 'pc.surabaya@lim.or.id',
      name: 'PC LIM Surabaya',
      password: pcPassword,
      role: 'PC',
      accountType: 'ORGANIZATIONAL',
      emailVerified: true,
    },
  })

  await prisma.organizationalAccount.upsert({
    where: { userId: pcUser.id },
    update: {},
    create: {
      userId: pcUser.id,
      unitId: pcSurabaya.id,
    },
  })
  console.log('✅ Created PC user & linked to unit')

  // 12. Create Falak Config (default Markaz Lirboyo)
  await prisma.falakConfig.upsert({
    where: { id: 'markaz-lirboyo' },
    update: {},
    create: {
      id: 'markaz-lirboyo',
      namaLokasi: 'Markaz Lirboyo Kota Kediri',
      latitude: -7.818758,
      longitude: 111.993158,
      ketinggian: 76.0,
      metodeHisab: 'TASHILUL_AMTSILAH',
      kriteriaMABIMS: true,
      tinggiHilalMin: 3.0,
      elongasiMin: 6.4,
      koreksiSubuh: 0,
      koreksiMaghrib: 2,
      isActive: true,
    },
  })
  console.log('✅ Created Falak config')

  // 13. Create Article Categories
  const categories = [
    { nama: 'Berita', slug: 'berita', urutan: 1 },
    { nama: 'Artikel Keagamaan', slug: 'artikel-keagamaan', urutan: 2 },
    { nama: 'Pengumuman', slug: 'pengumuman', urutan: 3 },
    { nama: 'Kegiatan', slug: 'kegiatan', urutan: 4 },
  ]

  for (const category of categories) {
    await prisma.articleCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  console.log('✅ Created article categories')

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('   Owner: owner@lim.or.id / owner123')
  console.log('   Sekretariat: sekretariat@lim.or.id / sekretariat123')
  console.log('   PW Jatim: pw.jatim@lim.or.id / pwjatim123')
  console.log('   PC Surabaya: pc.surabaya@lim.or.id / pcsurabaya123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## 5.2 Install bcryptjs

```bash
bun add bcryptjs
bun add -d @types/bcryptjs
```

### 5.3 Update package.json

Tambahkan script seed di `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:seed": "bunx tsx prisma/seed.ts",
    "db:push": "bunx prisma@6 db push",
    "db:studio": "bunx prisma@6 studio"
  }
}
```

## 6. Cara Menjalankan Seed

### 6.1 Pastikan Database Sudah Sync

```bash
bun run db:push
```


### 6.2 Jalankan Seed

```bash
bun run db:seed
```

Output yang diharapkan:

```
🌱 Starting seed...
✅ Created owner: owner@lim.or.id
✅ Created sekretariat: sekretariat@lim.or.id
✅ Created periode: Khidmat 2024-2029
✅ Created PP: Pengurus Pusat LIM
✅ Created 5 bidang
✅ Created jabatan PP
✅ Assigned owner as Ketua PP
✅ Created PW Jawa Timur
✅ Created PW user & linked to unit
✅ Created PC Surabaya
✅ Created PC user & linked to unit
✅ Created Falak config
✅ Created article categories

🎉 Seed completed successfully!

📋 Login Credentials:
   Owner: owner@lim.or.id / owner123
   Sekretariat: sekretariat@lim.or.id / sekretariat123
   PW Jatim: pw.jatim@lim.or.id / pwjatim123
   PC Surabaya: pc.surabaya@lim.or.id / pcsurabaya123
```

### 6.3 Verifikasi dengan Prisma Studio

```bash
bun run db:studio
```
---

## 7. Testing Login

### 7.1 Buat Halaman Login Sederhana

Buat file `src/app/(auth)/login/page.tsx`:

```typescript
// src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await signIn.email({
        email,
        password,
      })

      if (error) {
        setError(error.message || 'Login gagal')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">Login LIM</h2>
          <p className="text-center text-gray-600 mt-2">
            Platform Digital Lembaga Ittihadul Muballighin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

### 7.2 Buat Auth Client Helper

Buat file `src/lib/auth-client.ts`:

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
})

export const { signIn, signUp, signOut, useSession } = authClient
```

### 7.3 Test Login

1. Jalankan dev server: `bun run dev`
2. Buka `http://localhost:3000/login`
3. Login dengan: `owner@lim.or.id` / `owner123`
4. Seharusnya redirect ke `/dashboard`
----

## 8. Troubleshooting

### 8.1 Error: "Cannot find module '@/generated/client'"

**Solusi**:

```bash
bunx prisma@6 generate
```

### 8.2 Error: "User model not found"

**Solusi**: Pastikan schema Prisma sudah di-push:

```bash
bun run db:push
```

### 8.3 Error: "Invalid password"

**Solusi**: Password di-hash dengan bcryptjs. Pastikan seed sudah dijalankan:

```bash
bun run db:seed
```
### 8.4 Session tidak tersimpan

**Solusi**: Cek `.env`:

```env
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

### 8.5 Redirect loop setelah login

**Solusi**: Pastikan middleware tidak terlalu strict. Cek `src/middleware.ts`.

---

## 9. Next Steps

Setelah auth dan seed berhasil, langkah selanjutnya:
1. **Buat Dashboard Layout** dengan sidebar dinamis berdasarkan role.
2. **Implementasi Modul Persuratan** dengan penomoran dinamis.
3. **Implementasi Modul Wajib Khidmah** dengan cross-check.
4. **Setup File Upload** ke Cloudflare R2.

----


*Dokumentasi ini adalah panduan setup Better Auth & Seed Data untuk Platform LIM. Setiap langkah WAJIB diikuti secara berurutan untuk memastikan sistem berjalan dengan benar.*