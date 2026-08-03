# Definition of Done

**Project:** LIM Digital Platform

**Folder:** `12-project-management`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan kriteria selesai (Definition of Done) untuk setiap item pekerjaan di LIM Digital Platform. Setiap item dianggap selesai hanya apabila seluruh kriteria terpenuhi.

---

# Purpose

- Memastikan kualitas konsisten.
- Mengurangi tech debt.
- Memudahkan code review.
- Menjadi standar tim.

---

# Definition of Done: Feature

### Code Quality

- [ ] Kode mengikuti Coding Standards.
- [ ] Tidak ada TypeScript error (`npm run typecheck` pass).
- [ ] Tidak ada ESLint error (`npm run lint` pass).
- [ ] Kode di-format dengan Prettier.
- [ ] Tidak ada `console.log()` yang tertinggal.
- [ ] Tidak ada hardcoded value (menggunakan constant/env).

### Architecture

- [ ] Mengikuti Layer Architecture (Presentation -> Service -> Repository).
- [ ] Business Rules berada di Service Layer.
- [ ] Database access melalui Repository.
- [ ] Menggunakan Zod untuk validasi.
- [ ] Menggunakan naming conventions yang benar.

### Testing

- [ ] Build berhasil (`npm run build` pass).
- [ ] Fitur berjalan sesuai kebutuhan.
- [ ] Tested di multiple breakpoints (mobile, tablet, desktop).
- [ ] Tested di light dan dark mode.

### Documentation

- [ ] Dokumentasi teknis diperbarui (jika diperlukan).
- [ ] Code comments untuk alasan bisnis (jika diperlukan).
- [ ] API documentation diperbarui (jika ada perubahan API).

### Deployment

- [ ] Tidak ada conflict dengan branch utama.
- [ ] Dapat di-deploy ke staging tanpa error.
- [ ] Tidak ada regression pada fitur lain.

---

# Definition of Done: Bug Fix

### Code Quality

- [ ] Bug berhasil direproduksi sebelum fix.
- [ ] Root cause teridentifikasi.
- [ ] Fix mengatasi root cause, bukan hanya gejala.
- [ ] Tidak ada side effect baru.

### Testing

- [ ] Bug tidak muncul lagi setelah fix.
- [ ] Fitur terkait masih berjalan normal.
- [ ] `npm run check` pass.

### Documentation

- [ ] Root cause didokumentasi (jika kompleks).
- [ ] Preventive measures dicatat (jika diperlukan).

---

# Definition of Done: Documentation

### Content

- [ ] Konten akurat dan up-to-date.
- [ ] Mengikuti format dokumentasi yang berlaku.
- [ ] Tidak adaTypo atau kesalahan bahasa.
- [ ] Contoh kode berfungsi dengan benar.

### Structure

- [ ] Mengikuti struktur dokumen standar.
- [ ] Header (Project, Folder, Version, Status) lengkap.
- [ ] Related Documents tercantum.

### Review

- [ ] Telah di-review oleh minimal satu developer.
- [ ] Link internal berfungsi dengan benar.

---

# Definition of Done: Database Migration

### Schema

- [ ] Schema mengikuti design database.
- [ ] Tidak ada data loss.
- [ ] Migration reversible.

### Testing

- [ ] Migration berhasil dijalankan.
- [ ] Rollback berhasil dijalankan.
- [ ] Query performa memadai.

### Documentation

- [ ] Database documentation diperbarui.
- [ ] Seed data diperbarui (jika diperlukan).

---

# Definition of Done: UI Component

### Design

- [ ] Sesuai dengan Design System.
- [ ] Responsive (mobile, tablet, desktop).
- [ ] Mendukung light dan dark theme.
- [ ] Accessible (keyboard navigation, ARIA).

### Code

- [ ] Komponen reusable.
- [ ] State management minimal (prefer server component).
- [ ] Props typed dengan benar.
- [ ] Export melalui index.ts.

### Testing

- [ ] Render dengan benar di semua breakpoint.
- [ ] Interaksi berfungsi dengan benar.
- [ ] Loading state ditangani.

---

# Quality Checklist

Sebelum merge ke branch utama:

| Check      | Command                   |
| ---------- | ------------------------- |
| TypeScript | `npm run typecheck`       |
| Lint       | `npm run lint`            |
| Format     | `npm run format:check`    |
| Build      | `npm run build`           |
| Test       | Manual testing di browser |

---

# Reject Criteria

Item akan ditolak apabila:

- Tidak memenuhi Definition of Done.
- Mengandung bug baru.
- Melanggar arsitektur.
- Tidak ada dokumentasi.
- Tidak dapat di-build.

---

# Related Documents

- [Definition of Ready](./definition-of-ready.md) - Kriteria siap.
- [Backlog](./backlog.md) - Daftar backlog.
- `docs/00-overview/10-CODING_STANDARDS.md` - Coding standards.
- `docs/08-design-system/README.md` - Design system.
