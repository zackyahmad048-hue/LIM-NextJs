# Local Setup

**Project:** LIM Digital Platform

**Folder:** `13-handbook`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan panduan teknis langkah demi langkah untuk mengonfigurasi lingkungan pengembangan lokal (Local Environment) LIM Digital Platform. Panduan ini dirancang agar setiap developer baru dapat menjalankan sistem di komputer lokal dalam waktu kurang dari 30 menit.

---

# Prerequisites

Pastikan perangkat Anda telah terinstal perangkat lunak berikut sebelum memulai:

| Software        | Version                    | Keterangan                       |
| --------------- | -------------------------- | -------------------------------- |
| Node.js         | v20 LTS atau lebih baru    | Runtime JavaScript               |
| Package Manager | npm / pnpm / yarn          | Untuk mengelola dependency       |
| Git             | Versi terbaru              | Untuk manajemen versi            |
| Code Editor     | VS Code (direkomendasikan) | Dengan ekstensi ESLint, Prettier |
| PostgreSQL      | 15 atau lebih baru         | Database (atau gunakan Neon)     |

---

# Step 1: Clone Repository

`bash
git clone https://github.com/lim-digital/lim-platform.git
cd lim-platform
`

---

# Step 2: Install Dependencies

`bash
npm install
`

Atau jika menggunakan pnpm:

`bash
pnpm install
`

---

# Step 3: Environment Variables

Buat file `.env` di root project:

`bash
cp .env.example .env
`

Isi variabel berikut:

``env

# Database

DATABASE_URL="postgresql://user:password@localhost:5432/lim_platform"

# Authentication

BETTER_AUTH_SECRET="your-secret-key"

# App

NEXT_PUBLIC_APP_URL="http://localhost:3000"
``

> Catatan: Untuk pengembangan lokal, Anda dapat menggunakan Neon PostgreSQL (gratis) atau Docker PostgreSQL.

---

# Step 4: Database Setup

### Generate Prisma Client

`bash
npm run prisma:generate
`

### Jalankan Migrasi

`bash
npm run prisma:migrate
`

Atau push schema langsung ke database:

`bash
npm run db:push
`

### Jalankan Seed Data (opsional)

`bash
npm run db:seed
`

---

# Step 5: Jalankan Development Server

`bash
npm run dev
`

Buka browser dan akses:

`http://localhost:3000`

---

# Step 6: Verifikasi

Pastikan aplikasi berjalan dengan benar:

1. Buka `http://localhost:3000` - Halaman utama website.
2. Buka `http://localhost:3000/admin` - Halaman admin (akan redirect ke login).
3. Jalankan `npm run check` - Pastikan tidak ada error.

---

# Available Scripts

| Command                   | Fungsi                     |
| ------------------------- | -------------------------- |
| `npm run dev`             | Jalankan dev server        |
| `npm run build`           | Build untuk production     |
| `npm run start`           | Jalankan production server |
| `npm run lint`            | Jalankan ESLint            |
| `npm run lint:fix`        | Fix ESLint issues          |
| `npm run typecheck`       | Jalankan TypeScript check  |
| `npm run format`          | Format dengan Prettier     |
| `npm run check`           | Lint + Typecheck           |
| `npm run prisma:generate` | Generate Prisma client     |
| `npm run prisma:migrate`  | Jalankan migrasi           |
| `npm run prisma:studio`   | Buka Prisma Studio         |
| `npm run db:push`         | Push schema ke database    |
| `npm run db:seed`         | Jalankan seed data         |

---

# IDE Setup (VS Code)

### Recommended Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- Docker (jika menggunakan Docker)

### VS Code Settings

Tambahkan di `.vscode/settings.json`:

`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
`

---

# Troubleshooting

| Masalah                   | Solusi                                     |
| ------------------------- | ------------------------------------------ |
| `DATABASE_URL` error      | Pastikan PostgreSQL berjalan dan URL benar |
| `prisma generate` gagal   | Jalankan `npm install` ulang               |
| Port 3000 sudah digunakan | Gunakan `npm run dev -- -p 3001`           |
| TypeScript error          | Jalankan `npm run typecheck`               |

Lihat [Troubleshooting](./troubleshooting.md) untuk detail lebih lanjut.

---

# Related Documents

- [Getting Started](./getting-started.md) - Pengantar cepat.
- [Developer Guide](./developer-guide.md) - Panduan pengembangan.
- [Troubleshooting](./troubleshooting.md) - Solusi error umum.
