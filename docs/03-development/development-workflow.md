# Development Workflow

**Project:** LIM Digital Platform

**Folder:** `03-development`

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan alur kerja pengembangan (Development Workflow) secara end-to-end pada LIM Digital Platform.

Development Workflow menghubungkan seluruh proses dari perencanaan task hingga deployment ke production, memastikan setiap perubahan konsisten, terdokumentasi, teruji, dan aman.

---

# Overview

Seluruh pengembangan LIM Digital Platform mengikuti alur berikut:

```text id="dw01"
Planning

↓

Branching

↓

Development

↓

Local Testing

↓

Commit & Push

↓

Pull Request

↓

Code Review

↓

CI Pipeline

↓

Merge

↓

Deployment

↓

Health Check
```

---

# Development Lifecycle

```text id="dw02"
Issue / Task

↓

Analysis & Planning

↓

Create Branch

↓

Implement Code

↓

Write Test

↓

Run Local Check

↓

Commit

↓

Push

↓

Create Pull Request

↓

CI Pipeline Pass

↓

Code Review Approved

↓

Merge to Develop

↓

Deploy to Staging

↓

QA Testing

↓

Merge to Main

↓

Deploy to Production

↓

Health Check
```

---

# Step by Step

## 1. Planning

Sebelum memulai pengembangan:

- Pahami requirements dari Issue atau User Story.
- Baca dokumentasi terkait di folder `docs/`.
- Identifikasi file yang akan diubah.
- Identifikasi dependency dan risiko.
- Buat rencana implementasi singkat.
- Estimasi waktu pengerjaan.

---

## 2. Branching

Buat branch baru dari `develop`:

```text id="dw03"
git checkout develop
git pull origin develop
git checkout -b feature/<feature-name>
```

Gunakan naming convention yang benar:

- `feature/<feature-name>` untuk fitur baru.
- `bugfix/<bug-name>` untuk perbaikan bug.
- `hotfix/<issue-name>` untuk perbaikan urgent production.
- `docs/<topic>` untuk perubahan dokumentasi.

---

## 3. Development

Selama proses pengembangan:

- Ikuti Coding Standards dan Naming Conventions.
- Ikuti Layer Architecture (Presentation → Service → Repository).
- Gunakan Server Components jika memungkinkan.
- Gunakan Client Components hanya jika diperlukan.
- Gunakan alias import `@/`.
- Validasi semua input.
- Tangani error dengan jelas.
- Jangan mengubah file yang tidak berkaitan.
- Commit secara berkala (atomic commit).

---

## 4. Local Testing

Sebelum melakukan commit:

```text id="dw04"
npm run lint

↓

npm run typecheck

↓

npm run build

↓

Manual Testing di Browser
```

Pastikan:

- Tidak ada ESLint error.
- Tidak ada TypeScript error.
- Build berhasil.
- Fitur berfungsi dengan benar.
- Responsive di mobile, tablet, desktop.
- Berfungsi di light dan dark mode.

---

## 5. Commit & Push

Gunakan Conventional Commits:

```text id="dw05"
git add .
git commit -m "feat(scope): description"
git push origin feature/<feature-name>
```

Format commit:

```text id="dw06"
<type>(<scope>): <description>
```

Contoh:

```text id="dw07"
feat(program): add participant management

fix(auth): resolve token expiration

docs(api): update authentication endpoint
```

---

## 6. Pull Request

Buka Pull Request ke branch `develop`:

- Judul yang jelas dan deskriptif.
- Deskripsi perubahan yang lengkap.
- Link ke Issue (jika ada).
- Screenshot atau recording (jika ada perubahan UI).
- Checklist yang sudah dipenuhi.

---

## 7. Code Review

Review akan dilakukan oleh reviewer:

- Periksa kepatuhan terhadap Architecture.
- Periksa kepatuhan terhadap Business Rules.
- Periksa Code Quality.
- Periksa Security.
- Periksa Performance.
- Periksa Testing.

---

## 8. CI Pipeline

Pull Request harus melalui CI Pipeline:

```text id="dw08"
Install Dependency

↓

Type Check

↓

Lint

↓

Build

↓

Test (jika tersedia)
```

Apabila salah satu gagal, proses merge dihentikan.

---

## 9. Merge

Setelah CI berhasil dan review disetujui:

- Gunakan **Squash and Merge** atau **Rebase and Merge**.
- Hindari Merge Commit kecuali diperlukan.
- Hapus branch setelah merge.

---

## 10. Deployment

Deployment mengikuti environment flow:

```text id="dw09"
Develop

↓

Staging

↓

Production
```

Deployment ke Production hanya dilakukan setelah:

- QA Testing di Staging berhasil.
- Persetujuan dari Technical Lead atau Maintainer.
- Seluruh CI Pipeline berhasil.

---

## 11. Health Check

Setelah deployment, verifikasi:

- Aplikasi berjalan.
- Database terhubung.
- Authentication berfungsi.
- API dapat diakses.
- Error Log tidak menunjukkan masalah kritis.

---

# Feature Development Flow

Alur lengkap untuk pengembangan fitur baru:

```text id="dw10"
Buat Issue

↓

Analisis & Perencanaan

↓

Buat Branch dari develop

↓

Implementasi Fitur

↓

Buat Unit Test

↓

Jalankan Local Check

↓

Commit & Push

↓

Buka Pull Request

↓

CI Pipeline

↓

Code Review

↓

Merge ke develop

↓

Deploy ke Staging

↓

QA Testing

↓

Merge ke main

↓

Deploy ke Production

↓

Health Check

↓

Tutup Issue
```

---

# Bug Fix Flow

Alur untuk perbaikan bug:

```text id="dw11"
Buat Issue (Bug Report)

↓

Reproduksi Bug

↓

Identifikasi Root Cause

↓

Buat Branch dari develop

↓

Implementasi Fix

↓

Verifikasi Fix

↓

Jalankan Local Check

↓

Commit & Push

↓

Buka Pull Request

↓

CI Pipeline

↓

Code Review

↓

Merge ke develop

↓

Deploy ke Staging

↓

Verifikasi di Staging

↓

Merge ke main

↓

Deploy ke Production

↓

Tutup Issue
```

---

# Hotfix Flow

Alur untuk perbaikan urgent di Production:

```text id="dw12"
Buat Issue (Hotfix)

↓

Buat Branch dari main

↓

Implementasi Fix

↓

Jalankan Local Check

↓

Commit & Push

↓

Buka Pull Request ke main

↓

CI Pipeline

↓

Code Review (Fast Track)

↓

Merge ke main

↓

Merge ke develop

↓

Deploy ke Production

↓

Health Check

↓

Tutup Issue
```

---

# Documentation Flow

Alur untuk perubahan dokumentasi:

```text id="dw13"
Buat Branch dari develop

↓

Perbarui Dokumentasi

↓

Review Sendiri

↓

Commit & Push

↓

Buka Pull Request

↓

Code Review

↓

Merge ke develop
```

---

# Database Migration Flow

Alur untuk perubahan schema database:

```text id="dw14"
Perbarui schema.prisma

↓

Jalankan prisma migrate dev

↓

Verifikasi Migration

↓

Update Dokumentasi Database

↓

Commit & Push

↓

Buka Pull Request

↓

Code Review

↓

Merge ke develop

↓

Deploy ke Staging

↓

Verifikasi Migration di Staging

↓

Merge ke main

↓

Deploy ke Production

↓

Verifikasi Migration di Production
```

---

# Environment Workflow

## Development

- Debug aktif.
- Data dummy diperbolehkan.
- Migration dan Seeder dapat dijalankan.

---

## Staging

- Menyerupai Production.
- Database terpisah.
- QA Testing dilakukan di sini.
- User Acceptance Testing.

---

## Production

- Stabil dan aman.
- Monitoring aktif.
- Backup aktif.
- Tidak ada debug mode.

---

# Daily Development Checklist

Checklist harian developer:

```text id="dw15"
□ Pull branch terbaru dari develop

□ Jalankan aplikasi secara lokal

□ Periksa issue yang perlu dikerjakan

□ Mulai development

□ Commit secara berkala

□ Push setelah selesai

□ Buka Pull Request jika sudah siap

□ Review Pull Request tim lain jika ada

□ Periksa status CI Pipeline
```

---

# Pull Request Checklist

Sebelum membuka Pull Request:

```text id="dw16"
□ Kode mengikuti Coding Standards

□ Tidak ada TypeScript error

□ Tidak ada ESLint error

□ Build berhasil

□ Fitur berfungsi dengan benar

□ Responsive di mobile, tablet, desktop

□ Berfungsi di light dan dark mode

□ Tidak ada console.log yang tertinggal

□ Tidak ada hardcoded value

□ Unit Test tersedia (jika applicable)

□ Dokumentasi diperbarui (jika diperlukan)

□ Branch sinkron dengan develop

□ Commit message mengikuti Conventional Commits
```

---

# Merge Checklist

Sebelum merge Pull Request:

```text id="dw17"
□ CI Pipeline berhasil

□ Minimal 1 Approval

□ Tidak ada komentar kritis yang belum diselesaikan

□ Tidak ada konflik

□ Branch dihapus setelah merge
```

---

# Best Practices

- Mulai hari dengan pull branch terbaru.
- Commit kecil dan sering.
- Hindari branch berumur terlalu lama.
- Selesaikan konflik sebelum membuka Pull Request.
- Review Pull Request tim lain secara aktif.
- Komunikasikan perubahan besar sebelum implementasi.
- Dokumentasikan keputusan teknis penting.

---

# Related Documents

- `coding-standards.md` - Standar penulisan kode.
- `naming-conventions.md` - Standar penamaan.
- `git-workflow.md` - Standar Git Workflow.
- `branching-strategy.md` - Strategi branching.
- `commit-convention.md` - Standar penulisan commit.
- `testing-strategy.md` - Strategi pengujian.
- `code-review.md` - Standar Code Review.
- `docs/00-overview/15-DEPLOYMENT.md` - Standar Deployment.
- `docs/00-overview/14-GIT_WORKFLOW.md` - Git Workflow resmi.

---

# Acceptance Criteria

- Seluruh developer memahami Development Workflow.
- Development Workflow diterapkan pada seluruh pengembangan.
- Alur dari task hingga deployment terdokumentasi.
- Checklist digunakan secara konsisten.
- Development Workflow menjadi pedoman resmi proses development.
