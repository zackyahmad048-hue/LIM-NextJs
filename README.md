# LIM Digital Platform

**Project:** LIM Digital Platform  
**Version:** 1.0.0  
**Status:** Active Development  
**Organization:** Lembaga Ittihadul Muballighin (LIM) Pondok Pesantren Lirboyo  

> Platform digital terintegrasi untuk ekosistem data, layanan, dan tata kelola organisasi resmi Lembaga Ittihadul Muballighin (LIM) Pondok Pesantren Lirboyo.

---

## 📑 Daftar Isi
- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Quick Start](#-quick-start)
- [Struktur Folder](#-struktur-folder)
- [Perintah Pengembangan](#-perintah-pengembangan)
- [Dokumentasi](#-dokumentasi)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)
- [Kontak](#-kontak)

---

## 🎯 Tentang Proyek

**LIM Digital Platform** adalah platform digital terintegrasi berbasis **Next.js 16 (App Router)** dan **TypeScript** yang mengusung arsitektur **Domain-Driven Design (DDD)**. Platform ini mengintegrasikan seluruh operasional organisasi LIM sesuai amanat **PKO MUNAS II 2025**, mencakup:

- Website publik & portal informasi
- Sistem manajemen administrasi & persuratan
- Basis data kepengurusan, delegasi, dan guru bantu
- Program kerja (Wajib Khidmah, Safari Ramadan, Pesantren Ramadan)
- Layanan Digital Falak (jadwal shalat & hisab)
- Dakwah digital & daerah binaan

Platform ini dirancang untuk mendukung tata kelola organisasi yang **terstruktur, transparan, dan akuntabel** di seluruh tingkatan: Pengurus Pusat (PP), Pengurus Wilayah (PW), Pengurus Cabang (PC), hingga pondok/madrasah internal.

---

## ✨ Fitur Utama

### 🔐 Autentikasi & Otorisasi
- **Better Auth** dengan 15 role terstruktur (Personal & Organizational Account)
- **Row-Level Security** untuk isolasi data antar organisasi
- **Multi-Factor Authentication (MFA)** untuk role kritis

### 📝 Manajemen Persuratan
- Penomoran surat dinamis per periode khidmat
- Alur approval berjenjang (Draft → Review → Approve → Sent)
- QR Code untuk verifikasi surat
- Audit trail lengkap

### 👥 Wajib Khidmah
- Manajemen guru bantu & penugasan
- Laporan mingguan dari guru & lembaga
- Cross-check otomatis laporan guru vs lembaga
- Evaluasi kasus & mediasi

### 🕌 Safari Ramadan
- Manajemen titik safari & delegasi
- Jurnal harian delegasi
- Approval berjenjang (Panitia Daerah → PW/PC → Kades)
- Laporan sidak/visitasi

### 📚 Pesantren Ramadan
- Database sekolah mitra & bank materi
- Penugasan pengajar & koordinator
- Laporan harian pengajar & koordinator
- Umpan balik dari pusat & peserta

### 🌙 Digital Falak
- Hisab Tashilul Amtsilah (khas Lirboyo)
- Jadwal shalat otomatis
- Penetapan awal bulan (Ramadan, Syawal, Dzul Hijjah)
- Manual override oleh Lajnah Falak

### 📰 Portal & Dakwah Digital
- CMS artikel & berita
- Webinar, podcast, kultum digital
- Pendaftaran event online
- Daerah binaan dengan laporan bulanan

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| **Framework** | Next.js (App Router) | 16.x |
| **Runtime** | Bun | 1.1+ |
| **Language** | TypeScript | 5.x (Strict Mode) |
| **ORM** | Prisma | 6.x |
| **Database** | PostgreSQL (Neon) | Serverless |
| **Auth** | Better Auth | Latest |
| **Styling** | Tailwind CSS | v4 (CSS-first) |
| **UI Components** | shadcn/ui | Latest |
| **Animation** | Framer Motion | v12 |
| **Icons** | Lucide React | Latest |
| **Validation** | Zod | Latest |
| **Testing** | Vitest + Playwright | Latest |
| **Deployment** | Vercel | - |
| **Storage** | Cloudflare R2 | - |

---

## 📋 Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** v20.9+ (LTS)
- **Bun** v1.1+ ([Install Guide](https://bun.sh))
- **Git** v2.40+
- **PostgreSQL** lokal atau akun **Neon** (untuk database)
- **VS Code** atau **Cursor** (recommended)

### Cek Versi
```bash
node --version    # v20.9.0+
bun --version     # 1.1.0+
git --version     # 2.40.0+
```
## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd lim-platform
```
### 2. Install Dependencies

```bash
bun install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env.local
```

Edit file `.env.local` dan isi dengan credentials Anda:

```env
# Database
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="generate-32-chars-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Public
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
### 4. Setup Database

```bash
# Generate Prisma Client
bun run prisma:generate

# Push schema ke database
bun run db:push

# Jalankan seed data
bun run db:seed
```

### 5. Jalankan Development Server

```bash
bun run dev
```
Buka browser di **http://localhost:3000**

## 🔑 Default Login Credentials (setelah seed)

| Role              | Email                     | Password           |
| ----------------- | ------------------------- | ------------------ |
| Owner             | `owner@lim.or.id`       | `owner123`       |
| Admin Sekretariat | `sekretariat@lim.or.id` | `sekretariat123` |
| PW Jawa Timur     | `pw.jatim@lim.or.id`    | `pwjatim123`     |
| PC Surabaya       | `pc.surabaya@lim.or.id` | `pcsurabaya123`  |

⚠️ PENTING: Ganti semua password default sebelum deploy ke production!

---

## 📁 Struktur Folder

```text
lim-platform/
├── app/                      # Next.js App Router
│   ├── (public)/            # Halaman publik (portal, falak, verifikasi QR)
│   ├── (auth)/              # Login, register, forgot password
│   ├── (dashboard)/         # Dashboard dengan layout sidebar
│   │   ├── admin/           # Owner, Sekretariat, Tim WK
│   │   ├── organisasi/      # PW, PC, Pondok
│   │   └── personal/        # Guru Bantu, dll
│   ├── api/                 # REST endpoints (public/webhook)
│   ├── layout.tsx
│   └── globals.css          # Tailwind v4 config
│
├── modules/                 # Domain-Driven Design Modules
│   ├── authentication/      # Login, session, MFA
│   ├── authorization/       # RBAC, permissions
│   ├── letter/              # Persuratan
│   ├── wajib-khidmah/       # Wajib Khidmah
│   ├── safari/              # Safari Ramadan
│   ├── pesantren-ramadan/   # Pesantren Ramadan
│   ├── falak/               # Digital Falak
│   ├── cms/                 # Portal & Artikel
│   ├── dakwah-digital/      # Dakwah Digital
│   ├── daerah-binaan/       # Daerah Binaan
│   └── shared/              # Shared utilities & types
│
├── components/
│   ├── ui/                  # shadcn/ui (auto-generated)
│   ├── forms/               # Form components
│   └── layout/              # Sidebar, Navbar, Footer
│
├── lib/
│   ├── prisma.ts            # Prisma singleton
│   ├── auth.ts              # Better Auth config
│   ├── auth-client.ts       # Better Auth client
│   ├── validations/         # Shared Zod schemas
│   └── utils.ts             # Helper functions
│
├── generated/
│   └── client/              # Auto-generated Prisma Client
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Migration files
│   └── seed.ts              # Seed data script
│
├── docs/                    # Dokumentasi lengkap
│   ├── backend/             # Backend specifications
│   └── ...
│
├── e2e/                     # Playwright E2E tests
├── tests/                   # Vitest setup & fixtures
├── .env.local               # Environment variables (local)
├── package.json
├── bun.lockb
└── README.md
```
---

## ⚡ Perintah Pengembangan

**Development**

```bash
bun run dev              # Start dev server (Turbopack)
bun run lint             # Check linting
bun run typecheck        # Check TypeScript errors
bun run format           # Format kode dengan Prettier
```

**Database**

```bash
bun run prisma:generate  # Generate Prisma Client
bun run db:push          # Push schema ke database
bun run db:seed          # Jalankan seed data
bun run db:studio        # Buka Prisma Studio (UI visual)
```

**Testing**

```bash
bun run test             # Jalankan unit & integration test
bun run test:watch       # Watch mode
bun run test:coverage    # Dengan coverage report
bun run test:e2e         # Playwright E2E
bun run test:e2e:ui      # Playwright dengan UI mode
```

**Build & Production**

```bash
bun run build            # Build untuk production
bun run start            # Jalankan production build
```
---

📚 Dokumentasi
Dokumentasi lengkap tersedia di folder `docs/`. Baca dokumen berikut sebelum mulai berkontribusi:

**Backend Specifications**

- `docs/backend/01.TECH_STACK.md`
     — Stack teknologi & arsitektur DDD
- `docs/backend/02.PRISMA_SCHEMA.md`
     — Standar penulisan schema Prisma
- `docs/backend/03.API_CONVENTIONS.md`
     — Format Server Actions & API Routes
- `docs/backend/04.SECURITY.md`
     — Standar keamanan & Role Hierarchy
- `docs/backend/05.TESTING.md`
     — Strategi pengujian backend
- `docs/backend/06.RBAC.md`
     — Matriks hak akses 15 role
- `docs/backend/07.DEPLOYMENT.md`
     — CI/CD & Environment
- `docs/backend/08.DEVELOPMENT.md`
     — Git Workflow & Coding Standards
- `docs/backend/09.ADR.md`
     — Architecture Decision Records

**Panduan Penting**

- **Developer Baru**: Mulai dari `docs/backend/07.DEVELOPMENT.md`
- **Aturan AI Agent**: Lihat `docs/backend/01.TECH_STACK.md`
 bagian "Larangan Keras"
- **Role & Hak Akses**: Lihat `docs/backend/06.RBAC.md`
---

### 🤝 Kontribusi

Kami menyambut kontribusi dari seluruh pengurus dan developer LIM. Silakan baca panduan kontribusi di `docs/backend/07.DEVELOPMENT.md`
 untuk detail:

1. Fork repository ini
2. Buat branch fitur: `git checkout -b feat/nama-fitur`
3. Commit perubahan: `git commit -m 'feat(modul): deskripsi fitur'`
4. Push ke branch: `git push origin feat/nama-fitur`
5. Buat **Pull Request**

### Konvensi Commit (Conventional Commits)

```
<type>(<scope>): <subject>

Contoh:
feat(letter): implementasi penomoran surat dinamis
fix(wk): perbaiki cross-check laporan mingguan
docs(rbac): update matriks hak akses
```

### Code Review

- Setiap PR WAJIB di-review minimal 1 developer lain.
- PR harus lolos: Linting, Type Checking, dan Testing.
- DILARANG merge jika ada konflik atau CI gagal.
---

### 📄 Lisensi

Proyek ini dikembangkan untuk kebutuhan internal **Lembaga Ittihadul Muballighin Pondok Pesantren Lirboyo**.

Hak cipta © 2026 LIM Digital Platform. Semua hak dilindungi.

---

### 📞 Kontak

Untuk pertanyaan, saran, atau laporan bug, silakan hubungi:

- **Email**: developer@lim.or.id
- **GitHub Issues**: Laporkan masalah di sini
- **Tim Developer**: Pengurus Pusat LIM - Bidang IT

---
### 🙏 Ucapan Terima Kasih

Proyek ini tidak akan terwujud tanpa dukungan dari:

- **Pengurus Pusat LIM** atas arahan dan amanat PKO MUNAS II 2025
- **Seluruh pengurus PW, PC, dan pondok** atas masukan dan feedback
- **Tim developer** yang telah berkontribusi waktu dan keahlian
- **Komunitas open-source** atas teknologi-teknologi luar biasa yang digunakan

---

<p align="center">
  <strong>LIM Digital Platform</strong><br>
  <em>Menegakkan Ajaran Islam Ahlu as-Sunnah wa al-Jama'ah melalui Digitalisasi Organisasi</em><br>
  <br>
  Dibangun dengan ❤️ untuk LIM Pondok Pesantren Lirboyo
</p>

