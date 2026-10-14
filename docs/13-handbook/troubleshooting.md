# Troubleshooting

**Project:** LIM Digital Platform

**Folder:** `13-handbook`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini berisi solusi untuk error dan masalah umum yang sering dihadapi developer.

---

# Build Errors

### TypeScript Error

**Masalah:** `npm run typecheck` menghasilkan error.

**Solusi:**

1. Jalankan `npm run typecheck` untuk melihat error detail.
2. Perbaiki type yang salah.
3. Pastikan tidak ada `any` type yang tidak perlu.

---

### ESLint Error

**Masalah:** `npm run lint` menghasilkan error.

**Solusi:**

1. Jalankan `npm run lint:fix` untuk auto-fix.
2. Perbaiki manual jika auto-fix tidak berhasil.
3. Pastikan mengikuti coding standards.

---

### Build Gagal

**Masalah:** `npm run build` gagal.

**Solusi:**

1. Jalankan `npm run typecheck` dan `npm run lint` terlebih dahulu.
2. Perbaiki semua error.
3. Jalankan `npm run build` lagi.

---

# Database Errors

### Prisma Generate Gagal

**Masalah:** `npm run prisma:generate` error.

**Solusi:**

1. Hapus folder `node_modules/.prisma`.
2. Jalankan `npm install` ulang.
3. Jalankan `npm run prisma:generate` lagi.

---

### Migration Error

**Masalah:** `npm run prisma:migrate` error.

**Solusi:**

1. Pastikan `DATABASE_URL` benar di `.env`.
2. Pastikan PostgreSQL berjalan.
3. Untuk development, gunakan `npm run db:push`.

---

### Database Connection Error

**Masalah:** Tidak dapat terhubung ke database.

**Solusi:**

1. Pastikan PostgreSQL berjalan.
2. Periksa `DATABASE_URL` di `.env`.
3. Pastikan database sudah dibuat.

---

# Authentication Errors

### Login Gagal

**Masalah:** Tidak dapat login ke admin.

**Solusi:**

1. Pastikan akun sudah dibuat (seed data).
2. Periksa email dan password.
3. Jalankan `npm run db:seed` untuk membuat akun default.

---

### Session Expired

**Masalah:** Session habis secara tiba-tiba.

**Solusi:**

1. Login ulang.
2. Periksa konfigurasi Better Auth di `.env`.

---

# Development Errors

### Port Sudah Digunakan

**Masalah:** `Port 3000 is already in use`.

**Solusi:**

1. Gunakan port lain: `npm run dev -- -p 3001`.
2. Atau hentikan process yang menggunakan port 3000.

---

### Hot Reload Tidak Berfungsi

**Masalah:** Perubahan tidak ter-update otomatis.

**Solusi:**

1. Restart dev server.
2. Hapus folder `.next` dan jalankan `npm run dev` lagi.

---

### Import Error

**Masalah:** `Module not found` atau `Cannot resolve`.

**Solusi:**

1. Periksa path import (gunakan alias `@/`).
2. Pastikan file yang di-import ada.
3. Jalankan `npm install` ulang.

---

# Environment Errors

### Missing Environment Variable

**Masalah:** `Missing environment variable`.

**Solusi:**

1. Buat file `.env` dari `.env.example`.
2. Isi seluruh variabel yang diperlukan.
3. Restart dev server.

---

### Invalid Environment Variable

**Masalah:** Environment variable tidak valid.

**Solusi:**

1. Periksa format value di `.env`.
2. Pastikan tidak ada spasi atau karakter aneh.
3. Restart dev server setelah perubahan.

---

# OpenCode / MCP Errors

### Kredensial MCP Gagal (`Authorization header is badly formatted`)

**Masalah:** `opencode mcp list` melaporkan server `github` gagal dengan HTTP 400, padahal token sudah ada di `.env`.

**Solusi:**

1. Substitusi `{env:NAMA}` dibaca dari environment proses service OpenCode, **bukan** dari `.env` proyek — service tidak memuat `.env`.
2. Simpan nilainya di file terpisah (mis. `~/.config/opencode/.secrets/github-token`, mode `600`).
3. Rujuk file itu lewat substitusi `{file:...}` di `opencode.json`, lalu jalankan `opencode reload`.

Catatan: GitHub remote MCP menolak OAuth (tanpa dynamic client registration), jadi `oauth: false` + header `Authorization: Bearer ...` adalah jalur yang didukung. `opencode mcp debug` bisa melaporkan gagal meski tool-nya tetap jalan.

---

### Editor Menandai Error Schema di `opencode.json`

**Masalah:** VS Code menandai field V2 (`mcp.servers`, `providers`) sebagai tidak valid, padahal mengikuti dokumentasi V2.

**Solusi:**

1. Schema terbitan `https://opencode.ai/config.json` masih menggambarkan V1 (isu upstream `anomalyco/opencode#53398`).
2. Jangan pasang `"$schema"` di `opencode.json` sampai schema V2 terbit; tambahkan kembali setelahnya.
3. Bila error lama masih tampil, jalankan **Developer: Reload Window**.

---

### Server MCP `shadcn` Timeout Saat Start

**Masalah:** server `shadcn` berstatus `pending` atau timeout ketika `opencode mcp list` dijalankan.

**Solusi:**

1. Pakai instalasi lokal, bukan unduhan floating: `"command": ["npx", "--no-install", "shadcn", "mcp"]`.
2. `shadcn@latest` mengunduh ulang setiap spawn sehingga melewati `timeout.startup` default 30 detik.

---

# Quick Reference

| Error            | Command                   |
| ---------------- | ------------------------- |
| TypeScript error | `npm run typecheck`       |
| Lint error       | `npm run lint:fix`        |
| Prisma error     | `npm run prisma:generate` |
| Database error   | `npm run prisma:migrate`  |
| Build error      | `npm run build`           |
| Format code      | `npm run format`          |
| Full check       | `npm run check`           |
| MCP bermasalah   | `opencode mcp list`       |
| Muat ulang config OpenCode | `opencode reload` |

---

# Related Documents

- [FAQ](./faq.md) - Pertanyaan umum.
- [Local Setup](./local-setup.md) - Setup lokal.
- [Developer Guide](./developer-guide.md) - Panduan pengembangan.
