# DEPLOYMENT

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

**Document Type:** Deployment Standard

---

# Purpose

Dokumen ini mendefinisikan standar deployment resmi LIM Digital Platform.

Seluruh proses deployment harus dapat dilakukan secara konsisten, aman, terdokumentasi, dan mudah direplikasi.

Dokumen ini berlaku untuk seluruh environment yang digunakan dalam pengembangan dan operasional sistem.

---

# Deployment Principles

Seluruh deployment mengikuti prinsip berikut:

- Automation First
- Zero Manual Configuration
- Environment Isolation
- Security First
- Rollback Ready
- Repeatable Deployment

---

# Deployment Environments

Platform memiliki tiga environment utama.

## Development

Digunakan oleh developer untuk pengembangan lokal.

Karakteristik:

- Debug aktif.
- Data dummy diperbolehkan.
- Migration dan Seeder dapat dijalankan.
- Tidak digunakan untuk produksi.

---

## Staging

Digunakan untuk:

- Quality Assurance
- User Acceptance Testing
- Validasi Release

Karakteristik:

- Menyerupai Production.
- Database terpisah.
- Konfigurasi hampir identik dengan Production.

---

## Production

Digunakan oleh pengguna akhir.

Karakteristik:

- Stabil.
- Aman.
- Monitoring aktif.
- Backup aktif.
- Logging aktif.

---

# Infrastructure

Platform menggunakan:

## Source Code

- GitHub Repository

## Database

- PostgreSQL
- Neon Database (Tahap Awal)

## Authentication

- Better Auth

## Hosting

Tahap awal:

- Vercel

Roadmap:

- VPS
- Docker
- Kubernetes (jika diperlukan)

---

# Environment Variables

Seluruh konfigurasi sensitif disimpan melalui Environment Variables.

Contoh:

```text id="dp01"
DATABASE_URL

AUTH_SECRET

BETTER_AUTH_SECRET

NEXT_PUBLIC_APP_URL

SMTP_HOST

SMTP_PORT

SMTP_USER

SMTP_PASSWORD
```

Secret tidak boleh disimpan di source code maupun repository.

---

# Deployment Workflow

Alur deployment:

```text id="dp02"
Development

↓

Pull Request

↓

Code Review

↓

Merge

↓

Build

↓

Deployment

↓

Health Check
```

Deployment hanya dilakukan setelah seluruh tahapan berhasil.

---

# Continuous Integration (CI)

Setiap Pull Request wajib menjalankan:

- Install Dependency
- Type Check
- Lint
- Build
- Test (jika tersedia)

Apabila salah satu gagal, proses merge dihentikan.

---

# Continuous Deployment (CD)

Branch:

```text id="dp03"
main
```

menjadi sumber deployment Production.

Deployment dilakukan setelah seluruh proses CI berhasil.

---

# Database Migration

Perubahan schema hanya dilakukan melalui Prisma Migration.

Alur:

```text id="dp04"
Schema Update

↓

Migration

↓

Review

↓

Deploy
```

Migration manual pada Production tidak diperbolehkan. Pada Production (Vercel), migration diterapkan otomatis melalui `prisma migrate deploy` dalam build pipeline.

---

# Seeder

Seeder bersifat idempotent (menggunakan `upsert`) sehingga aman dijalankan berulang kali.

Pada Production (Vercel), migration dan seeder dijalankan otomatis pada setiap deployment melalui build command:

```text id="dp06"
npm run db:deploy   # prisma migrate deploy && tsx prisma/seed.ts
npm run build       # prisma generate && next build
```

Seeder hanya memuat data referensi RBAC (bukan data dummy/transaksi):

- 93 permission.
- 6 role: `super-admin`, `administrator`, `editor`, `operator`, `sekretaris`, `viewer`.
- Grant Role → Permission sesuai `DEFAULT_PERMISSION_MATRIX`.
- User dengan email `ADMIN_EMAIL` terhubung ke role `super-admin`.

Prasyarat environment Production:

- `DATABASE_URL` mengarah ke database Production.
- `ADMIN_EMAIL` dikonfigurasi agar akun admin otomatis mendapatkan role `super-admin` (jika user tersebut sudah ada).

Seeder tidak menulis atau menghapus data pengguna maupun data transaksional.

---

# Backup

Backup database dilakukan secara berkala:

- Harian
- Mingguan
- Bulanan

Backup harus dapat dipulihkan melalui proses restore.

---

# Restore

Restore database hanya dilakukan oleh administrator yang berwenang.

Setiap proses restore harus dicatat dalam Audit Log operasional.

---

# Health Check

Setelah deployment, sistem wajib diperiksa:

- Aplikasi berjalan.
- Database terhubung.
- Authentication berfungsi.
- API dapat diakses.
- Error Log tidak menunjukkan masalah kritis.

---

# Monitoring

Production wajib dipantau.

Minimal meliputi:

- Uptime
- Error Rate
- Response Time
- Database Connection
- Storage Usage

---

# Logging

Deployment menghasilkan log yang memuat:

- Waktu deployment.
- Versi aplikasi.
- Commit yang dirilis.
- Status deployment.
- Hasil Health Check.

---

# Rollback

Apabila deployment gagal:

1. Hentikan deployment.
2. Kembalikan ke versi stabil terakhir.
3. Verifikasi aplikasi.
4. Dokumentasikan penyebab.
5. Lakukan perbaikan sebelum deployment berikutnya.

---

# Release Process

Release mengikuti tahapan berikut:

```text id="dp05"
Development

↓

Testing

↓

Staging

↓

Approval

↓

Production
```

Deployment langsung dari Development ke Production tidak diperbolehkan.

---

# Security

Deployment harus memastikan:

- HTTPS aktif.
- Environment Variables lengkap.
- Secret tidak tercetak pada log.
- Database menggunakan koneksi terenkripsi.
- Hak akses deployment dibatasi.

---

# File Storage

Media dan dokumen tidak disimpan di dalam source code.

Tahap awal:

- Local Storage

Roadmap:

- Cloudflare R2
- Amazon S3
- Google Cloud Storage

---

# Mobile Deployment

Android:

- Internal Testing
- Closed Testing
- Google Play

iOS:

- TestFlight
- App Store

---

# Release Notes

Setiap release wajib memiliki Release Notes yang memuat:

- Fitur baru.
- Perbaikan bug.
- Perubahan penting.
- Migration (jika ada).
- Catatan kompatibilitas.

---

# Disaster Recovery

Platform harus memiliki rencana pemulihan apabila terjadi kegagalan.

Minimal meliputi:

- Backup Database
- Restore Database
- Source Code Repository
- Deployment Procedure
- Dokumentasi Operasional

---

# Governance

Seluruh proses deployment LIM Digital Platform wajib mengikuti dokumen ini.

Perubahan terhadap proses deployment harus didokumentasikan dan disetujui sebelum diterapkan.

---

# Closing

Deployment merupakan tahap akhir sebelum sistem digunakan oleh pengguna.

Dengan mengikuti standar deployment yang konsisten, LIM Digital Platform dapat dirilis secara aman, stabil, terdokumentasi, dan siap berkembang dalam jangka panjang.
